import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTopicStore } from '@/store/topicStore';
import { Topic } from '@/constants/topics';
import Colors from '@/constants/colors';

export default function HistoryScreen() {
  const router = useRouter();
  const { history, setCurrentTopic } = useTopicStore();

  const handlePressTopic = (topic: Topic) => {
    setCurrentTopic(topic);
    router.push('/'); // Navigate to the main screen where TopicScreen is displayed
  };

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No topics viewed yet.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Topic }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePressTopic(item)}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: Colors.light.text,
  },
  listContentContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  itemId: {
    fontSize: 14,
    color: Colors.light.secondaryText,
    marginTop: 4,
  },
});
