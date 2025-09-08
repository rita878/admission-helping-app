import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router'; // ✅ Safer navigation between tabs

const { width: screenWidth } = Dimensions.get('window');

const features = [
  {
    icon: '🎓',
    title: 'All Public & Private Universities',
    desc: 'Easily browse and apply to every university in Bangladesh.',
  },
  {
    icon: '🧠',
    title: 'Admission Test Suggestions',
    desc: 'Study tips and subject-wise suggestions tailored for you.',
  },
  {
    icon: '🤝',
    title: 'Mentorship & Support',
    desc: 'Get help from mentors and successful students anytime.',
  },
];

const motivations = [
  {
    emoji: '🚀',
    title: 'Your Journey Starts Here',
    text: 'No more confusing websites. Everything you need in one powerful app.',
  },
  {
    emoji: '🌟',
    title: 'Be University-Ready',
    text: 'Get ahead with guidance, resources, and a dashboard built for your success.',
  },
];

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner */}
      <Image
        source={require('../assets/banner.png')}
        style={styles.banner}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>🎓 Right Step Admission</Text>
      <Text style={styles.subtitle}>
        Apply to public and private universities across Bangladesh in just a few taps.
      </Text>

      {/* Action Buttons */}
      <View style={styles.navRow}>
        <Link href="/suggestions" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>Suggestions</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/universities" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>Universities</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* What You'll Love Section */}
      <Text style={styles.sectionTitle}>✨ What You’ll Love</Text>
      {features.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.icon} {item.title}</Text>
          <Text style={styles.cardText}>{item.desc}</Text>
        </View>
      ))}

      {/* Motivation Section */}
      <Text style={styles.sectionTitle}>💡 Motivation</Text>
      {motivations.map((m, index) => (
        <View key={index} style={styles.motivationBox}>
          <Text style={styles.motivationTitle}>{m.emoji} {m.title}</Text>
          <Text style={styles.motivationText}>{m.text}</Text>
        </View>
      ))}

      <Text style={styles.footer}>🚀 Built with ❤️ for future students of Bangladesh</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    flexGrow: 1,
  },
  banner: {
    width: screenWidth * 0.9,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 15,
    marginBottom: 20,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  navButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  navText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#334155',
  },
  motivationBox: {
    backgroundColor: '#e0f2fe',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0284c7',
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 14,
    color: '#0369a1',
  },
  footer: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 25,
    textAlign: 'center',
  },
});
