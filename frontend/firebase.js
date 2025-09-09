// firebase.js
import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD_nh_l4ebHusqdnqJl3svFnSG0znlrgZ8",
  authDomain: "admission-9b74e.firebaseapp.com",
  projectId: "admission-9b74e",
  storageBucket: "admission-9b74e.firebasestorage.app",
  messagingSenderId: "213648622483",
  appId: "1:213648622483:web:561a0c15b76cb797b45e66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth only (no Firestore)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
