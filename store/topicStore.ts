import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import topics, { Topic } from '@/constants/topics';
import techniques from '@/constants/techniques';
import { TranslationCard, Difficulty, LearningPath, MitreTactic } from '@/types/TranslationCard';

interface Filters {
  difficulty: Difficulty | null;
  learningPath: LearningPath | null;
  tactic: MitreTactic | null;
}

interface TopicState {
  // Legacy topic support
  currentTopic: Topic | null;
  history: Topic[];
  generateRandomTopic: () => void;

  // Translation Card state
  currentCard: TranslationCard | null;
  cardHistory: TranslationCard[];
  favorites: string[]; // technique IDs
  filters: Filters;
  showAdvanced: boolean;

  // Translation Card actions
  generateRandomCard: () => void;
  setFilter: (key: keyof Filters, value: string | null) => void;
  clearFilters: () => void;
  toggleFavorite: (techniqueId: string) => void;
  toggleAdvanced: () => void;
}

function getFilteredTechniques(filters: Filters): TranslationCard[] {
  let pool = techniques;
  if (filters.difficulty) {
    pool = pool.filter(t => t.difficulty === filters.difficulty);
  }
  if (filters.learningPath) {
    pool = pool.filter(t => t.learningPaths.includes(filters.learningPath!));
  }
  if (filters.tactic) {
    pool = pool.filter(t => t.tactic === filters.tactic);
  }
  return pool;
}

export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
      // Legacy
      currentTopic: null,
      history: [],
      generateRandomTopic: () => {
        const { history } = get();
        const availableTopics = topics.filter(topic =>
          !history.slice(0, Math.min(history.length, 3)).some(h => h.id === topic.id)
        );
        const topicsToChooseFrom = availableTopics.length > 0 ? availableTopics : topics;
        const randomIndex = Math.floor(Math.random() * topicsToChooseFrom.length);
        const newTopic = topicsToChooseFrom[randomIndex];
        set(state => ({
          currentTopic: newTopic,
          history: [newTopic, ...state.history].slice(0, 10),
        }));
      },

      // Translation Cards
      currentCard: null,
      cardHistory: [],
      favorites: [],
      filters: { difficulty: null, learningPath: null, tactic: null },
      showAdvanced: false,

      generateRandomCard: () => {
        const { cardHistory, filters } = get();
        const pool = getFilteredTechniques(filters);
        if (pool.length === 0) return;

        const recentIds = cardHistory.slice(0, Math.min(cardHistory.length, 3)).map(c => c.techniqueId);
        const available = pool.filter(t => !recentIds.includes(t.techniqueId));
        const candidates = available.length > 0 ? available : pool;
        const card = candidates[Math.floor(Math.random() * candidates.length)];

        set(state => ({
          currentCard: card,
          cardHistory: [card, ...state.cardHistory].slice(0, 50),
        }));
      },

      setFilter: (key, value) => {
        set(state => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      clearFilters: () => {
        set({ filters: { difficulty: null, learningPath: null, tactic: null } });
      },

      toggleFavorite: (techniqueId: string) => {
        set(state => ({
          favorites: state.favorites.includes(techniqueId)
            ? state.favorites.filter(id => id !== techniqueId)
            : [...state.favorites, techniqueId],
        }));
      },

      toggleAdvanced: () => {
        set(state => ({ showAdvanced: !state.showAdvanced }));
      },
    }),
    {
      name: 'topic-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
