import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import topics, { Topic } from '@/constants/topics';

interface TopicState {
  currentTopic: Topic | null;
  history: Topic[];
  generateRandomTopic: () => void;
}

export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
      currentTopic: null,
      history: [],
      generateRandomTopic: () => {
        const { history } = get();
        
        // Filter out recently used topics to avoid repetition
        const availableTopics = topics.filter(topic => 
          !history.slice(0, Math.min(history.length, 3)).some(h => h.id === topic.id)
        );
        
        // If all topics have been used recently, just use all topics
        const topicsToChooseFrom = availableTopics.length > 0 ? availableTopics : topics;
        
        // Select a random topic
        const randomIndex = Math.floor(Math.random() * topicsToChooseFrom.length);
        const newTopic = topicsToChooseFrom[randomIndex];
        
        set(state => ({
          currentTopic: newTopic,
          history: [newTopic, ...state.history].slice(0, 10) // Keep last 10 topics
        }));
      }
    }),
    {
      name: 'topic-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
