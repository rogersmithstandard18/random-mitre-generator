import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import techniques from '@/constants/techniques';
import { TranslationCard, Difficulty, LearningPath, MitreTactic } from '@/types/TranslationCard';
import { useAuthStore } from './authStore';

interface Filters {
  difficulty: Difficulty | null;
  learningPath: LearningPath | null;
  tactic: MitreTactic | null;
}

interface TopicState {
  currentCard: TranslationCard | null;
  cardHistory: TranslationCard[];
  favorites: string[];
  filters: Filters;
  showAdvanced: boolean;

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

async function syncToBackend(state: { cardHistory?: TranslationCard[]; favorites?: string[]; showAdvanced?: boolean }) {
  const token = useAuthStore.getState().token;
  if (!token) return;

  try {
    await fetch('/api/user/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cardHistory: state.cardHistory,
        favorites: state.favorites,
        showAdvanced: state.showAdvanced,
      }),
    });
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
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

        set(state => {
          const newCardHistory = [card, ...state.cardHistory].slice(0, 50);
          syncToBackend({ cardHistory: newCardHistory, favorites: state.favorites, showAdvanced: state.showAdvanced });
          return {
            currentCard: card,
            cardHistory: newCardHistory,
          };
        });
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
        set(state => {
          const newFavorites = state.favorites.includes(techniqueId)
            ? state.favorites.filter(id => id !== techniqueId)
            : [...state.favorites, techniqueId];

          syncToBackend({ cardHistory: state.cardHistory, favorites: newFavorites, showAdvanced: state.showAdvanced });

          return { favorites: newFavorites };
        });
      },

      toggleAdvanced: () => {
        set(state => {
          const newShowAdvanced = !state.showAdvanced;
          syncToBackend({ cardHistory: state.cardHistory, favorites: state.favorites, showAdvanced: newShowAdvanced });
          return { showAdvanced: newShowAdvanced };
        });
      },
    }),
    {
      name: 'topic-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
