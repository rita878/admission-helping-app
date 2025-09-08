import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  Linking,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import useRequireAuth from '../hooks/useRequireAuth';
import Loader from '../components/Loader';

const BASE_URL = 'https://server-side-five-taupe.vercel.app/api/universities';

export default function Universities() {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [activeList, setActiveList] = useState('public');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUni, setSelectedUni] = useState(null);

  const { user, checking } = useRequireAuth();

  const fetchUniversities = async (type) => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      const data = res.data.universities[type] || [];
      setUniversities(data);
      setFilteredUniversities(data);
      setActiveList(type);
      setSearchTerm('');
    } catch (err) {
      Alert.alert('Error', `Failed to load ${type} universities`);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUniversities('public');
    }
  }, [user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUniversities(universities);
    } else {
      const filtered = universities.filter((uni) =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
    }
  }, [searchTerm]);

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

  const renderUniversity = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedUni(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        {item.location && <Text style={styles.location}>📍 {item.location}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎓 Explore Universities</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeList === 'public' && styles.activeButton]}
          onPress={() => fetchUniversities('public')}
        >
          <Text style={[styles.toggleText, activeList === 'public' && styles.activeText]}>
            Public
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeList === 'private' && styles.activeButton]}
          onPress={() => fetchUniversities('private')}
        >
          <Text style={[styles.toggleText, activeList === 'private' && styles.activeText]}>
            Private
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="🔍 Search universities..."
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredUniversities}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderUniversity}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.noDataText}>No universities found</Text>}
      />

      {/* Modal to show university details */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedUni?.name}</Text>
              <Text style={styles.modalDetail}>📍 Location: {selectedUni?.location || 'N/A'}</Text>
              <Text style={styles.modalDetail}>🏫 Type: {selectedUni?.type || 'N/A'}</Text>
              <Text style={styles.modalDetail}>🌐 Website: {selectedUni?.website || 'N/A'}</Text>

              {selectedUni?.website && (
                <TouchableOpacity
                  style={styles.visitButton}
                  onPress={() => Linking.openURL(selectedUni.website)}
                >
                  <Text style={styles.visitButtonText}>Visit Website</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={{ color: 'white' }}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e3a8a',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e7ff',
    borderRadius: 20,
    marginHorizontal: 8,
  },
  activeButton: {
    backgroundColor: '#2563eb',
  },
  toggleText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
  },
  location: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#6b7280',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e40af',
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 6,
  },
  visitButton: {
    marginTop: 10,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  visitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#6b7280',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});
