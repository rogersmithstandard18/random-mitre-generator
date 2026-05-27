import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import inlineTechniques from '@/constants/techniques';
import { TranslationCard, Difficulty, LearningPath, MitreTactic, RiskCategory, IndustryImpact } from '@/types/TranslationCard';
import { useAuthStore } from './authStore';
import { supabase } from '@/lib/supabase';

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
  techniques: TranslationCard[];
  techniquesLoaded: boolean;

  generateRandomCard: () => void;
  setFilter: (key: keyof Filters, value: string | null) => void;
  clearFilters: () => void;
  toggleFavorite: (techniqueId: string) => void;
  toggleAdvanced: () => void;
  restoreFromServer: (data: { cardHistory?: unknown[]; favorites?: string[]; showAdvanced?: boolean }) => void;
  loadTechniques: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: Record<string, any>): TranslationCard {
  return {
    techniqueId: row.technique_id,
    techniqueName: row.technique_name,
    tactic: row.tactic as MitreTactic,
    tacticId: row.tactic_id,
    difficulty: row.difficulty as Difficulty,
    learningPaths: row.learning_paths as LearningPath[],
    plainExplanation: row.plain_explanation,
    riskCategory: row.risk_category as RiskCategory,
    riskDescription: row.risk_description,
    boardroomPitch: row.boardroom_pitch,
    industryImpacts: row.industry_impacts as IndustryImpact[],
    detectionHints: row.detection_hints as string[],
    mitigations: row.mitigations as string[],
    reflectionQuestion: row.reflection_question,
    spotTheRisk: row.spot_the_risk,
  };
}

function getFilteredTechniques(techniques: TranslationCard[], filters: Filters): TranslationCard[] {
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
      techniques: inlineTechniques,
      techniquesLoaded: false,

      loadTechniques: async () => {
        const { data, error } = await supabase
          .from('techniques')
          .select('*')
          .order('technique_id');
        if (!error && data && data.length > 0) {
          set({ techniques: data.map(mapRow), techniquesLoaded: true });
        } else {
          set({ techniquesLoaded: true });
        }
      },

      generateRandomCard: () => {
        const { cardHistory, filters, techniques } = get();
        const pool = getFilteredTechniques(techniques, filters);
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
        // Auto-generate a new card matching the filter
        get().generateRandomCard();
      },

      clearFilters: () => {
        set({ filters: { difficulty: null, learningPath: null, tactic: null } });
        // Auto-generate a new card with no filters
        get().generateRandomCard();
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

      restoreFromServer: (data) => {
        set({
          cardHistory: (data.cardHistory as TranslationCard[]) || [],
          favorites: data.favorites || [],
          showAdvanced: data.showAdvanced || false,
        });
      },
    }),
    {
      name: 'topic-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
