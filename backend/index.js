// index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors({ origin: "*" }));

// Test route
app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// MongoDB Setup
const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("universities");
    const usersCollection = db.collection("users");
    const notesCollection = db.collection("notes");
    const publicUnis = db.collection("public");
    const privateUnis = db.collection("private");

    // ----------- Universities Endpoint -----------
    app.get("/api/universities", async (req, res) => {
      try {
        const publicData = await publicUnis.find().toArray();
        const privateData = await privateUnis.find().toArray();

        res.json({
          universities: {
            public: publicData,
            private: privateData,
          },
        });
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch universities", details: err.message });
      }
    });

    app.get("/api/universities/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const objectId = new ObjectId(id);
        const publicUni = await publicUnis.findOne({ _id: objectId });
        if (publicUni) return res.json(publicUni);

        const privateUni = await privateUnis.findOne({ _id: objectId });
        if (privateUni) return res.json(privateUni);

        res.status(404).json({ error: "University not found" });
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch university", details: err.message });
      }
    });

    // ----------- Users Endpoint -----------
    const generateUserId = () => `AFD${Math.floor(Math.random() * 1000000)}`;

    app.get("/api/users", async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.json(users);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch users", details: err.message });
      }
    });

    app.post("/api/users", async (req, res) => {
      const { fullName, collegeName, email, password } = req.body;
      if (!fullName || !collegeName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
      try {
        const userId = generateUserId();
        const newUser = { userId, fullName, collegeName, email, password };
        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: "User registered", userId });
      } catch (err) {
        res.status(500).json({ error: "Registration failed", details: err.message });
      }
    });

    app.get("/api/users/:email", async (req, res) => {
      try {
        const user = await usersCollection.findOne({ email: req.params.email });
        if (user) res.json(user);
        else res.status(404).json({ error: "User not found" });
      } catch (err) {
        res.status(500).json({ error: "Error finding user", details: err.message });
      }
    });

    app.put("/api/users/:email", async (req, res) => {
      try {
        const result = await usersCollection.findOneAndUpdate(
          { email: req.params.email },
          { $set: req.body },
          { returnDocument: "after" }
        );
        if (!result.value) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User updated", updatedUser: result.value });
      } catch (err) {
        res.status(500).json({ error: "Update failed", details: err.message });
      }
    });

    app.delete("/api/users/:email", async (req, res) => {
      try {
        const result = await usersCollection.findOneAndDelete({ email: req.params.email });
        if (!result.value) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted", deletedUser: result.value });
      } catch (err) {
        res.status(500).json({ error: "Delete failed", details: err.message });
      }
    });

    // ----------- Notes Endpoint -----------
    app.get("/api/notes", async (req, res) => {
      try {
        const notes = await notesCollection.find().toArray();
        res.json(notes);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch notes", details: err.message });
      }
    });

    app.post("/api/notes", async (req, res) => {
      const { title, content, uploaderEmail } = req.body;
      if (!title || !content || !uploaderEmail) {
        return res.status(400).json({ error: "All fields are required" });
      }
      try {
        const newNote = {
          title,
          content,
          uploaderEmail,
          uploadedAt: new Date(),
        };
        const result = await notesCollection.insertOne(newNote);
        res.status(201).json({ message: "Note added", id: result.insertedId });
      } catch (err) {
        res.status(500).json({ error: "Failed to add note", details: err.message });
      }
    });

    app.get("/api/notes/user/:email", async (req, res) => {
      try {
        const userNotes = await notesCollection.find({ uploaderEmail: req.params.email }).toArray();
        res.json(userNotes);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch user notes", details: err.message });
      }
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

run().catch(console.dir);
