// ✅ FIXED & OPTIMIZED: app/_layout.js
import '../firebase'; // ✅ Ensure Firebase is initialized first

import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator, View } from 'react-native';

export default function Layout() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Auth Checked:', user?.email || 'No user');
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const getIcon = (routeName) => {
    const icons = {
      index: 'home-outline',
      suggestions: 'bulb-outline',
      universities: 'school-outline',
      profile: 'person-outline',
    };
    return icons[routeName] || 'ellipse-outline';
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={getIcon(route.name)} size={size} color={color} />
        ),
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#2563eb' },
        headerTintColor: '#fff',
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="suggestions" options={{ title: 'Suggestions' }} />
      <Tabs.Screen name="universities" options={{ title: 'Universities' }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false, // 🔒 Profile stack has its own layout
        }}
      />
    </Tabs>
  );
}
