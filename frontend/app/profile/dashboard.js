import '../../firebase';

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Loader from '../../components/Loader';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace('/profile/login');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              await signOut(auth);
              Alert.alert('Success', 'You have been logged out.');
              router.replace('/profile/login');
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  if (loading || loggingOut) {
    return <Loader />;
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <Text style={{ color: '#fff', fontSize: 24 }}>
            {user.displayName?.charAt(0) || 'U'}
          </Text>
        </View>
      )}

      <Text style={styles.title}>🎉 Welcome to Your Dashboard</Text>
      <Text style={styles.name}>{user.displayName || 'No Name Set'}</Text>
      <Text style={styles.email}>Logged in as: {user.email}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/universities')}
      >
        <Text style={styles.buttonText}>🎓 View Universities</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/suggestions')}
      >
        <Text style={styles.buttonText}>💡 View Suggestions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderAvatar: {
    backgroundColor: '#2563eb',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: '#2563eb',
  },
  name: {
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: '#444',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
    width: '100%',
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
