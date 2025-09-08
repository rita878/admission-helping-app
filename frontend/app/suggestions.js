import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import useRequireAuth from '../hooks/useRequireAuth';
import Loader from '../components/Loader';

export default function Suggestions() {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user, checking } = useRequireAuth();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://server-side-five-taupe.vercel.app/api/notes');
      setNotes(res.data.reverse());
    } catch (err) {
      Alert.alert('Error', 'Failed to load notes');
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Both title and content are required');
      return;
    }

    const noteData = {
      title,
      content,
      uploaderEmail: user?.email || 'anonymous',
    };

    try {
      await axios.post('https://server-side-five-taupe.vercel.app/api/notes', noteData);
      setModalVisible(false);
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (err) {
      Alert.alert('Error', 'Failed to save note');
      console.error('Upload Error:', err.message);
    }
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  if (checking || loading) {
    return <Loader />;
  }

  if (!user) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📚 Welcome to Notes & Suggestions</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedNote(item)}
            style={styles.noteCard}
          >
            <Text style={styles.noteTitle}>📌 {item.title}</Text>
            <Text numberOfLines={2} style={styles.notePreview}>
              {item.content}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={styles.noNotesText}>No notes found. Add some!</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>➕ Add New Note</Text>
      </TouchableOpacity>

      {/* Add Note Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>📝 Create a New Note</Text>
            <TextInput
              placeholder="Enter note title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Write your note here..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={5}
              style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.submitButton} onPress={uploadNote}>
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Note Details Modal */}
      <Modal visible={!!selectedNote} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.noteDetailsModal}>
            <ScrollView>
              <Text style={styles.modalTitle}>📖 {selectedNote?.title}</Text>
              <Text style={styles.noteContent}>{selectedNote?.content}</Text>
              <Text style={styles.metaText}>👤 {selectedNote?.uploaderEmail}</Text>
              <Text style={styles.metaText}>
                📅 {new Date(selectedNote?.uploadedAt).toLocaleString()}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedNote(null)}
                style={styles.closeButton}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#f7f5f2ff' },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7c3aed',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  noteCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#38bdf8',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  notePreview: {
    color: '#334155',
    fontSize: 15,
  },
  noNotesText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 40,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  input: {
    borderColor: '#cbd5e1',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noteDetailsModal: {
    backgroundColor: '#fef9c3',
    padding: 25,
    borderRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  noteContent: {
    fontSize: 17,
    color: '#1e293b',
    marginTop: 10,
    marginBottom: 15,
    lineHeight: 24,
    textAlign: 'justify',
    fontFamily: 'serif',
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  closeButton: {
    backgroundColor: '#1e3a8a',
    marginTop: 15,
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
});
