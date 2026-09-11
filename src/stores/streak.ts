import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StreakState {
  current: number;
  best: number;
  lastActiveDate: string | null; // ISO yyyy-mm-dd
  shields: number; // "perdón" semanal
  registerActivity: () => void;
  reset: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const ta = new Date(a + 'T00:00:00').getTime();
  const tb = new Date(b + 'T00:00:00').getTime();
  return Math.round((tb - ta) / 86_400_000);
}

/**
 * Racha diaria con escudos. Cada domingo el niño gana 1 escudo (máx 2).
 * Si falta 1 día pero tiene escudo, se gasta y la racha se mantiene.
 * Si faltan más días, la racha se reinicia sin culpar al niño.
 */
export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      current: 0,
      best: 0,
      lastActiveDate: null,
      shields: 0,

      registerActivity: () => {
        const today = todayIso();
        const { lastActiveDate, current, best, shields } = get();
        if (lastActiveDate === today) return;

        const gap = lastActiveDate ? daysBetween(lastActiveDate, today) : Infinity;

        let nextCurrent = 1;
        let nextShields = shields;
        if (gap === 1) {
          nextCurrent = current + 1;
        } else if (gap === 2 && shields > 0) {
          nextCurrent = current + 1;
          nextShields = shields - 1;
        }

        // Escudo semanal: los domingos regala 1 (máx 2).
        if (new Date(today + 'T00:00:00').getDay() === 0) {
          nextShields = Math.min(2, nextShields + 1);
        }

        set({
          current: nextCurrent,
          best: Math.max(best, nextCurrent),
          lastActiveDate: today,
          shields: nextShields
        });
      },

      reset: () => set({ current: 0, best: 0, lastActiveDate: null, shields: 0 })
    }),
    { name: 'estudiaweb.streak' }
  )
);
