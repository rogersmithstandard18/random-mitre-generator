import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Topic } from '@/constants/topics';
import colors from '@/constants/colors';

interface TopicCardProps {
  topic: Topic;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{topic.title}</Text>
      <Text style={styles.description}>{topic.description}</Text>
      <Text style={styles.id}>ID: {topic.id}</Text>
      
      <View style={styles.bulletContainer}>
        {topic.bullets.map((bullet, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{bullet}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  id: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  bulletContainer: {
    marginTop: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
    color: colors.text,
  },
  bulletText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
});

export default TopicCard;
