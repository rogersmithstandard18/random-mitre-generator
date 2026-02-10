import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import scenarios from '@/constants/scenarios';
import type { Scenario, ScenarioProgress } from '@/types/Scenario';
import type { Difficulty, LearningPath } from '@/types/TranslationCard';
import { useAuthStore } from './authStore';

interface ScenarioFilters {
  difficulty: Difficulty | null;
  learningPath: LearningPath | null;
  securityPlus: string | null;
  owasp: string | null;
}

interface ScenarioState {
  activeScenarioId: string | null;
  progress: ScenarioProgress[];
  filters: ScenarioFilters;

  setActiveScenario: (id: string | null) => void;
  recordProgress: (entry: ScenarioProgress) => void;
  setFilter: (key: keyof ScenarioFilters, value: string | null) => void;
  clearFilters: () => void;
  getFilteredScenarios: () => Scenario[];
  getScenarioById: (id: string) => Scenario | undefined;
  getProgressForScenario: (id: string) => ScenarioProgress | undefined;
  getBestScore: (id: string) => number;
  getCompletedCount: () => number;
  getTotalScore: () => { earned: number; possible: number };
  restoreFromServer: (data: unknown[]) => void;
}

async function syncProgressToBackend(progress: ScenarioProgress[]) {
  const token = useAuthStore.getState().token;
  if (!token) return;

  try {
    await fetch('/api/user/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ scenarioProgress: progress }),
    });
  } catch (error) {
    console.error('Scenario progress sync failed:', error);
  }
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set, get) => ({
      activeScenarioId: null,
      progress: [],
      filters: {
        difficulty: null,
        learningPath: null,
        securityPlus: null,
        owasp: null,
      },

      setActiveScenario: (id) => set({ activeScenarioId: id }),

      recordProgress: (entry) => {
        set((state) => {
          // Replace if same scenario already attempted, keep best
          const existing = state.progress.find((p) => p.scenarioId === entry.scenarioId);
          let newProgress: ScenarioProgress[];
          if (existing && existing.score >= entry.score) {
            // Keep existing better score but record the attempt timestamp
            newProgress = state.progress.map((p) =>
              p.scenarioId === entry.scenarioId ? { ...p, completedAt: entry.completedAt } : p
            );
          } else {
            newProgress = [
              ...state.progress.filter((p) => p.scenarioId !== entry.scenarioId),
              entry,
            ];
          }
          syncProgressToBackend(newProgress);
          return { progress: newProgress };
        });
      },

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            difficulty: null,
            learningPath: null,
            securityPlus: null,
            owasp: null,
          },
        });
      },

      getFilteredScenarios: () => {
        const { filters } = get();
        let pool = scenarios;

        if (filters.difficulty) {
          pool = pool.filter((s) => s.difficulty === filters.difficulty);
        }
        if (filters.learningPath) {
          pool = pool.filter((s) =>
            s.learning_paths.includes(filters.learningPath!)
          );
        }
        if (filters.securityPlus) {
          pool = pool.filter((s) =>
            s.security_plus_objectives.some((o) => o.startsWith(filters.securityPlus!))
          );
        }
        if (filters.owasp) {
          pool = pool.filter((s) =>
            s.owasp_mapping.some((o) => o.startsWith(filters.owasp!))
          );
        }

        return pool;
      },

      getScenarioById: (id) => scenarios.find((s) => s.id === id),

      getProgressForScenario: (id) => get().progress.find((p) => p.scenarioId === id),

      getBestScore: (id) => {
        const p = get().progress.find((pr) => pr.scenarioId === id);
        return p ? p.score : 0;
      },

      getCompletedCount: () => get().progress.length,

      getTotalScore: () => {
        const prog = get().progress;
        return {
          earned: prog.reduce((sum, p) => sum + p.score, 0),
          possible: prog.reduce((sum, p) => sum + p.maxScore, 0),
        };
      },

      restoreFromServer: (data) => {
        set({ progress: (data as ScenarioProgress[]) || [] });
      },
    }),
    {
      name: 'scenario-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
