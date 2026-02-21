import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserTier = 'free' | 'starter' | 'professional' | 'team';

interface TierFeatures {
  canUseFilters: boolean;
  canUseLearningPathFilter: boolean;
  canUseFavorites: boolean;
  canViewHistory: boolean;
  hasPrioritySupport: boolean;
  canPlayScenarios: boolean;
  canUseScenarioFilters: boolean;
  canTrackScenarioProgress: boolean;
}

export const TIER_FEATURES: Record<UserTier, TierFeatures> = {
  free: {
    canUseFilters: false,
    canUseLearningPathFilter: false,
    canUseFavorites: false,
    canViewHistory: false,
    hasPrioritySupport: false,
    canPlayScenarios: false,
    canUseScenarioFilters: false,
    canTrackScenarioProgress: false,
  },
  starter: {
    canUseFilters: true,
    canUseLearningPathFilter: false,
    canUseFavorites: true,
    canViewHistory: true,
    hasPrioritySupport: false,
    canPlayScenarios: true,
    canUseScenarioFilters: false,
    canTrackScenarioProgress: false,
  },
  professional: {
    canUseFilters: true,
    canUseLearningPathFilter: true,
    canUseFavorites: true,
    canViewHistory: true,
    hasPrioritySupport: true,
    canPlayScenarios: true,
    canUseScenarioFilters: true,
    canTrackScenarioProgress: true,
  },
  team: {
    canUseFilters: true,
    canUseLearningPathFilter: true,
    canUseFavorites: true,
    canViewHistory: true,
    hasPrioritySupport: true,
    canPlayScenarios: true,
    canUseScenarioFilters: true,
    canTrackScenarioProgress: true,
  },
};

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  tier?: UserTier;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  getUserTier: () => UserTier;
  getTierFeatures: () => TierFeatures;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token, user) => {
        // Default to 'free' tier if not specified
        const userWithTier = { ...user, tier: user.tier || 'free' as UserTier };
        set({ token, user: userWithTier, isAuthenticated: true });
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      setUser: (user) => {
        set({ user });
      },

      getUserTier: () => {
        const user = get().user;

        // Admin bypass: if user's email matches ADMIN_EMAIL env var, grant professional tier
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        if (adminEmail && user?.email === adminEmail) {
          return 'professional';
        }

        return user?.tier || 'free';
      },

      getTierFeatures: () => {
        const tier = get().getUserTier();
        return TIER_FEATURES[tier];
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
