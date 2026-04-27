import { create } from 'zustand';

interface UserProfile {
  id: string;
  name?: string;
  age?: number;
  weight_kg?: number;
  height_cm?: number;
  sex?: string;
  health_goal?: string;
  dietary_restrictions?: string[];
  activity_level?: string;
  onboarding_completed: boolean;
}

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),
}));
