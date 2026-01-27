import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTopicStore } from '@/store/topicStore';
import Button from '@/components/Button';
import TopicCard from '@/components/TopicCard';
import TranslationCardView from '@/components/TranslationCardView';
import colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function TopicScreen() {
  const { currentTopic, currentCard, generateRandomCard, generateRandomTopic } = useTopicStore();

  useEffect(() => {
    if (!currentCard && !currentTopic) {
      generateRandomCard();
    }
  }, []);

  const handleGenerateNew = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    generateRandomCard();
  };

  if (!currentCard && !currentTopic) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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
        {currentCard ? (
          <TranslationCardView card={currentCard} />
        ) : currentTopic ? (
          <TopicCard topic={currentTopic} />
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            title="NEXT CONCEPT"
            onPress={handleGenerateNew}
            style={styles.generateButton}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>MITRE ATT&CK Cybersecurity Learning</Text>
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
