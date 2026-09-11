import { create } from 'zustand';
import { db, type StoredAttempt, type StoredMastery, type StoredSessionResult } from '@/db/schema';
import type { Difficulty } from '@/engine/types';
import { adjustDifficulty } from '@/engine/difficulty';

interface ProgressState {
  xp: number;
  streakCurrent: number;
  loaded: boolean;
  masteryByTopic: Record<string, StoredMastery>;
  bestStarsBySession: Record<string, 0 | 1 | 2 | 3>;
  load: () => Promise<void>;
  recordAttempt: (a: Omit<StoredAttempt, 'id' | 'at'>) => Promise<void>;
  recordSessionResult: (r: Omit<StoredSessionResult, 'at'>) => Promise<void>;
  awardXp: (amount: number) => void;
  currentDifficulty: (topicId: string) => Difficulty;
  streakForTopic: (topicId: string, limit?: number) => { correct: boolean; hintsUsed: number }[];
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  xp: 0,
  streakCurrent: 0,
  loaded: false,
  masteryByTopic: {},
  bestStarsBySession: {},

  load: async () => {
    const [attempts, mastery, results] = await Promise.all([
      db.attempts.orderBy('at').reverse().limit(200).toArray(),
      db.mastery.toArray(),
      db.sessionResults.toArray()
    ]);
    const xp = attempts.reduce((acc, a) => acc + (a.correct ? 10 : 3), 0);
    const map: Record<string, StoredMastery> = {};
    for (const m of mastery) map[m.topicId] = m;
    const starMap: Record<string, 0 | 1 | 2 | 3> = {};
    for (const r of results) starMap[r.sessionId] = r.stars;
    set({ xp, masteryByTopic: map, bestStarsBySession: starMap, loaded: true });
  },

  recordSessionResult: async (r) => {
    const prev = await db.sessionResults.get(r.sessionId);
    if (prev && prev.stars >= r.stars) return; // solo guardamos el mejor
    const stored: StoredSessionResult = { ...r, at: Date.now() };
    await db.sessionResults.put(stored);
    set((s) => ({ bestStarsBySession: { ...s.bestStarsBySession, [r.sessionId]: r.stars } }));
  },

  recordAttempt: async (a) => {
    const stored: StoredAttempt = { ...a, at: Date.now() };
    await db.attempts.add(stored);

    const prev = get().masteryByTopic[a.topicId];
    const ewma = prev
      ? prev.ewmaCorrect * 0.7 + (a.correct ? 0.3 : 0)
      : a.correct
        ? 0.6
        : 0.3;
    const nextMastery: StoredMastery = {
      topicId: a.topicId,
      ewmaCorrect: ewma,
      level: Math.max(1, Math.min(5, Math.ceil(ewma * 5))) as Difficulty,
      updatedAt: Date.now()
    };
    await db.mastery.put(nextMastery);

    set((s) => ({
      masteryByTopic: { ...s.masteryByTopic, [a.topicId]: nextMastery }
    }));
  },

  awardXp: (amount) => set((s) => ({ xp: s.xp + amount })),

  currentDifficulty: (topicId) => {
    const m = get().masteryByTopic[topicId];
    const start = m?.level ?? 1;
    const recent = get().streakForTopic(topicId, 10);
    return adjustDifficulty(start, recent).next;
  },

  streakForTopic: (_topicId, _limit = 10) => {
    // La ventana móvil se computa desde IndexedDB antes de arrancar cada sesión.
    // En el store en memoria mantenemos vacío; el player la recarga cuando la necesita.
    return [];
  }
}));

/** Utilidad para leer los últimos N intentos de un topic desde Dexie. */
export async function loadRecentAttempts(topicId: string, limit = 10) {
  const all = await db.attempts.where('topicId').equals(topicId).reverse().limit(limit).toArray();
  return all.reverse().map((a) => ({ correct: a.correct, hintsUsed: a.hintsUsed }));
}
