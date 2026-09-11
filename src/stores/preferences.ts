import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontScale = 'normal' | 'large' | 'xlarge';

interface PreferencesState {
  soundEnabled: boolean;
  fontScale: FontScale;
  reducedMotion: boolean;
  setSound: (v: boolean) => void;
  setFontScale: (v: FontScale) => void;
  setReducedMotion: (v: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      fontScale: 'normal',
      reducedMotion: false,
      setSound: (v) => set({ soundEnabled: v }),
      setFontScale: (v) => {
        document.documentElement.dataset.fontScale = v === 'normal' ? '' : v;
        set({ fontScale: v });
      },
      setReducedMotion: (v) => set({ reducedMotion: v })
    }),
    {
      name: 'estudiaweb.preferences',
      onRehydrateStorage: () => (state) => {
        if (state && state.fontScale !== 'normal') {
          document.documentElement.dataset.fontScale = state.fontScale;
        }
      }
    }
  )
);
