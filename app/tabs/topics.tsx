import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useTopicStore } from '@/store/topicStore';
import Button from '@/components/Button';
import TopicCard from '@/components/TopicCard';
import colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function TopicScreen() {
  const { currentTopic, generateRandomTopic } = useTopicStore();

  useEffect(() => {
    // If there's no current topic, generate one or go back to home
    if (!currentTopic) {
      generateRandomTopic();
    }
  }, [currentTopic, generateRandomTopic]);

  const handleGenerateNew = () => {
    // Provide haptic feedback on press
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Generate a new random topic
    generateRandomTopic();
  };

  if (!currentTopic) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading topic...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TopicCard topic={currentTopic} />
        
        <View style={styles.buttonContainer}>
          <Button
            title="GENERATE NEW"
            onPress={handleGenerateNew}
            style={styles.generateButton}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Random MITRE ATT&CK Generator</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  generateButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
