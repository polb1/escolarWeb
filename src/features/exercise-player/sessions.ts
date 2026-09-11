import { generateAddition } from '@/engine/generators/addition';
import { generateSubtraction } from '@/engine/generators/subtraction';
import { buildColoursSet } from '@/content/english/colours';
import { buildAnimalsSet } from '@/content/english/animals';
import { buildNumbersSet } from '@/content/english/numbers';
import type { ExerciseSpec, Difficulty } from '@/engine/types';
import { hashSeed } from '@/lib/prng';

export interface SessionDescriptor {
  id: string;
  topicId: string;
  titleKey: string;
  size: number;
  /** true → hay que elegir dificultad antes de empezar; false → contenido estático. */
  hasDifficultyLevels: boolean;
}

export const SESSIONS: Record<string, SessionDescriptor> = {
  'math.addition': {
    id: 'math.addition',
    topicId: 'math.addition',
    titleKey: 'sessions.math.addition',
    size: 5,
    hasDifficultyLevels: true
  },
  'math.subtraction': {
    id: 'math.subtraction',
    topicId: 'math.subtraction',
    titleKey: 'sessions.math.subtraction',
    size: 5,
    hasDifficultyLevels: true
  },
  'english.colours': {
    id: 'english.colours',
    topicId: 'english.colours',
    titleKey: 'sessions.english.colours',
    size: 5,
    hasDifficultyLevels: false
  },
  'english.animals': {
    id: 'english.animals',
    topicId: 'english.animals',
    titleKey: 'sessions.english.animals',
    size: 5,
    hasDifficultyLevels: false
  },
  'english.numbers': {
    id: 'english.numbers',
    topicId: 'english.numbers',
    titleKey: 'sessions.english.numbers',
    size: 5,
    hasDifficultyLevels: false
  }
};

export function buildSession(sessionId: string, difficulty: Difficulty): ExerciseSpec[] {
  const s = SESSIONS[sessionId];
  if (!s) throw new Error(`Unknown session: ${sessionId}`);

  if (s.topicId === 'math.addition' || s.topicId === 'math.subtraction') {
    const runSeed = hashSeed(sessionId, Date.now());
    const items: ExerciseSpec[] = [];
    const gen = s.topicId === 'math.addition' ? generateAddition : generateSubtraction;
    for (let i = 0; i < s.size; i++) {
      items.push(gen({ difficulty, seed: hashSeed(runSeed, i) }));
    }
    return items;
  }

  if (s.topicId === 'english.colours') return buildColoursSet();
  if (s.topicId === 'english.animals') return buildAnimalsSet();
  if (s.topicId === 'english.numbers') return buildNumbersSet();

  throw new Error(`No content builder for topic: ${s.topicId}`);
}
