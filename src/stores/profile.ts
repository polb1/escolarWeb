import { create } from 'zustand';
import { db, type StoredProfile } from '@/db/schema';

interface ProfileState {
  profile: StoredProfile | null;
  loaded: boolean;
  load: () => Promise<void>;
  create: (data: Omit<StoredProfile, 'id' | 'createdAt'>) => Promise<void>;
  update: (patch: Partial<Omit<StoredProfile, 'id'>>) => Promise<void>;
  reset: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loaded: false,
  load: async () => {
    const profile = (await db.profile.get('me')) ?? null;
    set({ profile, loaded: true });
  },
  create: async (data) => {
    const profile: StoredProfile = { id: 'me', createdAt: Date.now(), ...data };
    await db.profile.put(profile);
    set({ profile });
  },
  update: async (patch) => {
    const current = get().profile;
    if (!current) return;
    const next = { ...current, ...patch };
    await db.profile.put(next);
    set({ profile: next });
  },
  reset: async () => {
    await db.profile.delete('me');
    set({ profile: null });
  }
}));
