import type { Difficulty } from './types';

/**
 * Adaptatividad simple, honesta y explicable.
 *
 * Regla: ventana móvil de los últimos N intentos por topic.
 *   - aciertos ≥ 80 %  → sube 1 nivel (máx 5)
 *   - aciertos ≤ 40 %  → baja 1 nivel (mín 1) y forzamos pista/explicación
 *   - en medio         → mantiene
 *
 * No es "IA". Es una función pura sobre los últimos intentos, y por eso
 * podemos testearla y explicársela a un profesor.
 */
export interface RecentAttempt {
  correct: boolean;
  hintsUsed: number;
}

export interface AdjustResult {
  next: Difficulty;
  forceHelp: boolean;
}

export function adjustDifficulty(current: Difficulty, recent: RecentAttempt[]): AdjustResult {
  if (recent.length < 3) return { next: current, forceHelp: false };

  const window = recent.slice(-10);
  const ratio = window.filter((a) => a.correct).length / window.length;

  if (ratio >= 0.8) {
    return { next: clamp((current + 1) as Difficulty), forceHelp: false };
  }
  if (ratio <= 0.4) {
    return { next: clamp((current - 1) as Difficulty), forceHelp: true };
  }
  return { next: current, forceHelp: false };
}

function clamp(v: number): Difficulty {
  const n = Math.max(1, Math.min(5, v));
  return n as Difficulty;
}

/** XP por ejercicio, con penalizaciones suaves. Nunca 0 — siempre se premia el intento. */
export function computeXp(params: {
  difficulty: Difficulty;
  correct: boolean;
  firstTry: boolean;
  hintsUsed: number;
}): number {
  const base = [0, 10, 20, 30, 40, 50][params.difficulty] ?? 10;
  let xp = params.correct ? base : Math.round(base * 0.3);
  if (params.hintsUsed > 0) xp = Math.round(xp * 0.7);
  if (!params.firstTry && params.correct) xp = Math.round(xp * 0.7);
  return Math.max(xp, 3);
}
