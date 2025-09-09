import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirm || !name || !photo) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(userCred.user, {
        displayName: name,
        photoURL: photo,
      });

      Alert.alert('Success', 'Account created successfully!');
      router.replace('/profile/dashboard'); // ✅ Fixed path
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <Text style={styles.title}>📝 Register</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TextInput
        placeholder="Photo URL"
        value={photo}
        onChangeText={setPhoto}
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/profile/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
  },
});
