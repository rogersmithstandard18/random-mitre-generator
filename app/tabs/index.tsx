
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { router } from 'expo-router';
import { useTopicStore } from '@/store/topicStore';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function HomeScreen() {
  const generateRandomTopic = useTopicStore(state => state.generateRandomTopic);

  const handleGeneratePress = () => {
    // Provide haptic feedback on press
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Generate a new random topic
    generateRandomTopic();
    
    // Navigate to the topic screen
    router.push('/topic');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Random</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          isCircle 
          onPress={handleGeneratePress} 
          style={styles.circleButton}
        />
        <View style={styles.buttonHighlight} />
      </View>
      
      <Text style={styles.generatorText}>Generator</Text>
      
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
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  buttonContainer: {
    marginTop: 60,
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
    marginTop: 60,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
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
