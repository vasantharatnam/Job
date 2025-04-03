import { View, Text, StyleSheet } from 'react-native';
import { initDB } from '../../database/database'
import {useEffect} from 'react'
export default function Index() {

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDB();
        console.log('Database initialized successfully!');
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Lokal Jobs</Text>
      <Text style={styles.subheading}>
        Discover jobs around you, save your favorites, and apply with ease.
      </Text>
      <Text style={styles.note}>Use the tabs below to get started.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  note: {
    fontSize: 14,
    color: '#777',
    marginTop: 20,
  },
});
