// bookmarks.tsx
import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getBookmarks } from '../../database/database';

export default function BookmarksScreen() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadBookmarks = async () => {
        setLoading(true);
        setError('');
        try {
          const bookmarks = await getBookmarks();
          setBookmarkedJobs(bookmarks);
        } catch (err) {
          setError('Failed to load bookmarks.');
        } finally {
          setLoading(false);
        }
      };
      loadBookmarks();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.message}>Loading Bookmarks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => getBookmarks()}>
          <Text style={styles.retryText}>Tap to Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (bookmarkedJobs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No bookmarks available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookmarked Jobs</Text>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={bookmarkedJobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.label}>📍 {item.primary_details?.Place || 'Unknown'}</Text>
            <Text style={styles.label}>💰 {item.primary_details?.Salary || 'N/A'}</Text>
            <Text style={styles.label}>📝 {item.description?.slice(0, 80)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginTop: 4,
  },
  message: {
    fontSize: 16,
    marginTop: 10,
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 16,
    marginTop: 10,
    color: 'red',
    alignSelf: 'center',
  },
  retryText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});
