import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import topicsData from '../data/topicsData'; // Path updated to .ts file
import { Topic } from '../constants/topics'; // Already relative

interface TopicState {
  currentTopic: Topic | null;
  history: Topic[];
  generateRandomTopic: () => void;
  setCurrentTopic: (topic: Topic) => void;
}

export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
      currentTopic: null,
      history: [],
      setCurrentTopic: (topic: Topic) => {
        set(state => {
          // Avoid adding duplicate if it's already the current topic
          if (state.currentTopic?.id === topic.id) {
            return { currentTopic: topic };
          }
          // Avoid adding duplicate if it's already the most recent in history
          if (state.history.length > 0 && state.history[0].id === topic.id) {
            return { currentTopic: topic };
          }
          return {
            currentTopic: topic,
            // Add to history, ensuring no direct sequential duplicates
            history: [topic, ...state.history.filter(t => t.id !== topic.id)].slice(0, 10)
          };
        });
      },
      generateRandomTopic: () => {
        const { history } = get();
        
        // Filter out recently used topics to avoid repetition
        const typedTopicsData = topicsData as Topic[];
        const availableTopics = typedTopicsData.filter(topic => 
          !history.slice(0, Math.min(history.length, 3)).some(h => h.id === topic.id)
        );
        
        // If all topics have been used recently, just use all topics
        const topicsToChooseFrom = availableTopics.length > 0 ? availableTopics : typedTopicsData;
        
        // Select a random topic
        const randomIndex = Math.floor(Math.random() * topicsToChooseFrom.length);
        const newTopic = topicsToChooseFrom[randomIndex];
        
        set(state => {
          // Update history similarly to setCurrentTopic to avoid immediate duplicates
          const newHistory = [newTopic, ...state.history.filter(t => t.id !== newTopic.id)].slice(0, 10);
          return {
            currentTopic: newTopic,
            history: newHistory
          };
        });
      }
    }),
    {
      name: 'topic-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
