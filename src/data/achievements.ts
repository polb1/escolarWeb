import type { StoredAttempt, StoredSessionResult } from '@/db/schema';

/** Estado sobre el que se evalúan los logros — todo lo que hay en el store. */
export interface AchievementContext {
  attempts: StoredAttempt[];
  sessionResults: StoredSessionResult[];
  streakDays: number;
  xp: number;
}

export interface Achievement {
  id: string;
  nameKey: string;
  descKey: string;
  icon: string;
  check: (ctx: AchievementContext) => boolean;
}

/**
 * Catálogo declarativo de logros. Añadir uno = añadir una entrada aquí.
 * `check` es una función pura sobre el estado; es fácil testearla.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    nameKey: 'achievements.first_steps.name',
    descKey: 'achievements.first_steps.desc',
    icon: '👟',
    check: (ctx) => ctx.attempts.length >= 1
  },
  {
    id: 'ten_correct',
    nameKey: 'achievements.ten_correct.name',
    descKey: 'achievements.ten_correct.desc',
    icon: '✨',
    check: (ctx) => ctx.attempts.filter((a) => a.correct).length >= 10
  },
  {
    id: 'math_starter',
    nameKey: 'achievements.math_starter.name',
    descKey: 'achievements.math_starter.desc',
    icon: '🔢',
    check: (ctx) => ctx.sessionResults.some((r) => r.sessionId.startsWith('math.') && r.stars >= 1)
  },
  {
    id: 'english_starter',
    nameKey: 'achievements.english_starter.name',
    descKey: 'achievements.english_starter.desc',
    icon: '🇬🇧',
    check: (ctx) => ctx.sessionResults.some((r) => r.sessionId.startsWith('english.') && r.stars >= 1)
  },
  {
    id: 'three_stars',
    nameKey: 'achievements.three_stars.name',
    descKey: 'achievements.three_stars.desc',
    icon: '🌟',
    check: (ctx) => ctx.sessionResults.some((r) => r.stars === 3)
  },
  {
    id: 'streak_3',
    nameKey: 'achievements.streak_3.name',
    descKey: 'achievements.streak_3.desc',
    icon: '🔥',
    check: (ctx) => ctx.streakDays >= 3
  },
  {
    id: 'streak_7',
    nameKey: 'achievements.streak_7.name',
    descKey: 'achievements.streak_7.desc',
    icon: '💥',
    check: (ctx) => ctx.streakDays >= 7
  },
  {
    id: 'xp_100',
    nameKey: 'achievements.xp_100.name',
    descKey: 'achievements.xp_100.desc',
    icon: '⭐',
    check: (ctx) => ctx.xp >= 100
  }
];
