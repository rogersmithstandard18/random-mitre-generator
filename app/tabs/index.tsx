import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTopicStore } from '@/store/topicStore';
import Button from '@/components/Button';
import FilterBar from '@/components/FilterBar';
import colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function HomeScreen() {
  const { generateRandomCard, generateRandomTopic } = useTopicStore();
  const [showFilters, setShowFilters] = useState(false);

  const handleGenerateCard = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    generateRandomCard();
    router.push('/tabs/topic');
  };

  const handleGenerateTactic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    generateRandomTopic();
    router.push('/tabs/topic');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MITRE ATT&CK</Text>
        <Text style={styles.subtitle}>Push-Button Learning</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          isCircle
          onPress={handleGenerateCard}
          style={styles.circleButton}
        />
        <View style={styles.buttonHighlight} />
      </View>

      <Text style={styles.generatorText}>Learn One Concept</Text>
      <Text style={styles.hint}>Tap the button to get a Translation Card</Text>

      {/* Filter toggle */}
      <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterToggle}>
        <Text style={styles.filterToggleText}>
          {showFilters ? 'Hide Filters' : 'Filter by Path / Difficulty / Tactic'}
        </Text>
      </TouchableOpacity>

      {showFilters && <FilterBar />}

      {/* Legacy tactic mode */}
      <TouchableOpacity onPress={handleGenerateTactic} style={styles.tacticLink}>
        <Text style={styles.tacticLinkText}>or generate a random tactic overview</Text>
      </TouchableOpacity>

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
    alignItems: 'center',
  },
  header: {
    marginTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: '#000',
    zIndex: 2,
  },
  buttonHighlight: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    top: 15,
    right: 15,
    zIndex: 3,
  },
  generatorText: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
  },
  filterToggle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  tacticLink: {
    marginTop: 12,
    paddingVertical: 8,
  },
  tacticLinkText: {
    fontSize: 13,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
