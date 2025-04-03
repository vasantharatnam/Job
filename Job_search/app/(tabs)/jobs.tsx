// jobs.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { addBookmark, removeBookmark, getBookmarks } from '../../database/database';

export default function HomeScreen() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchJobsAndBookmarks();
  }, []);

  const fetchJobsAndBookmarks = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([fetchJobs(), fetchBookmarks()]);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const URL = `https://testapi.getlokalapp.com/common/jobs?page=${page}`;
      const res = await fetch(URL);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setJobs(prev => [...prev, ...data.results]);
      } else if (jobs.length === 0) {
        setError('No jobs available.');
      }
    } catch (err) {
      setError('Error fetching jobs.');
    }
  };

  const fetchBookmarks = async () => {
    try {
      const bookmarks = await getBookmarks();
      setBookmarkedJobs(bookmarks);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    try {
      const URL = `https://testapi.getlokalapp.com/common/jobs?page=${nextPage}`;
      const res = await fetch(URL);
      const data = await res.json();
      if (data.results) {
        setJobs(prevJobs => [...prevJobs, ...data.results]);
      }
    } catch (err) {
      console.error('Error loading more jobs:', err);
    }
  };

  const toggleBookmark = async (job) => {
    try {
      const isAlreadyBookmarked = bookmarkedJobs.some(j => j.id === job.id);
      if (isAlreadyBookmarked) {
        await removeBookmark(job.id);
      } else {
        await addBookmark(job);
      }
      const updatedBookmarks = await getBookmarks();
      setBookmarkedJobs(updatedBookmarks);
    } catch (err) {
      console.error('Error updating bookmark:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setJobs([]);
    setPage(1);
    setError('');
    try {
      await fetchJobsAndBookmarks();
    } catch (err) {
      setError('Error refreshing data.');
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    const isBookmarked = bookmarkedJobs.some(j => j.id === item.id);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <TouchableOpacity onPress={() => toggleBookmark(item)}>
            <FontAwesome
              name={isBookmarked ? 'bookmark' : 'bookmark-o'}
              size={24}
              color={isBookmarked ? '#000000' : '#333'}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Location: {item.primary_details?.Place || 'Unknown'}</Text>
        <Text style={styles.label}>Salary: {item.primary_details?.Salary || 'N/A'}</Text>
        <Text style={styles.label}>Type: {item.primary_details?.JobType || 'Not specified'}</Text>
        <TouchableOpacity onPress={() => setSelectedJob(item)}>
          <Text style={styles.jobDetailsBtn}>View Details →</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderJobDetails = () => {
    if (!selectedJob) return null;
    const { title, primary_details, description, company_name, created_at } = selectedJob;
    return (
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>{title}</Text>
        <Text style={styles.label}>Company: {company_name}</Text>
        <Text style={styles.label}>Location: {primary_details?.Place || 'Unknown'}</Text>
        <Text style={styles.label}>Salary: {primary_details?.Salary || 'N/A'}</Text>
        <Text style={styles.label}>Type: {primary_details?.Job_Type || 'N/A'}</Text>
        <Text style={styles.label}>Experience: {primary_details?.Experience || 'N/A'}</Text>
        <Text style={styles.label}>Posted on: {new Date(created_at).toDateString()}</Text>
        <Text style={[styles.label, { marginTop: 12 }]}>Description:</Text>
        <Text style={styles.description}>{description || 'No description available.'}</Text>
        <TouchableOpacity onPress={() => setSelectedJob(null)} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Job Listings</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  if (loading && jobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.message}>Loading Jobs...</Text>
      </SafeAreaView>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.retryText}>Tap to Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (jobs.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>No jobs available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Job Listings</Text>
      {selectedJob ? (
        renderJobDetails()
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    minHeight: 180,
    minWidth: 300,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  label: {
    fontSize: 14,
    marginTop: 4,
  },
  jobDetailsBtn: {
    marginTop: 10,
    fontSize: 14,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  detailsContainer: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginTop: 6,
    color: '#444',
    lineHeight: 20,
  },
  backButton: {
    marginTop: 30,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    alignSelf: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
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
