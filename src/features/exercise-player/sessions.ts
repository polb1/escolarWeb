import { generateAddition } from '@/engine/generators/addition';
import { generateSubtraction } from '@/engine/generators/subtraction';
import { generateComparison } from '@/engine/generators/comparison';
import { generateOrdering } from '@/engine/generators/ordering';
import { generateMultiplication } from '@/engine/generators/multiplication';
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
  'math.comparison': {
    id: 'math.comparison',
    topicId: 'math.comparison',
    titleKey: 'sessions.math.comparison',
    size: 5,
    hasDifficultyLevels: true
  },
  'math.ordering': {
    id: 'math.ordering',
    topicId: 'math.ordering',
    titleKey: 'sessions.math.ordering',
    size: 4,
    hasDifficultyLevels: true
  },
  'math.multiplication': {
    id: 'math.multiplication',
    topicId: 'math.multiplication',
    titleKey: 'sessions.math.multiplication',
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

  const runSeed = hashSeed(sessionId, Date.now());

  switch (s.topicId) {
    case 'math.addition':
      return times(s.size, (i) => generateAddition({ difficulty, seed: hashSeed(runSeed, i) }));
    case 'math.subtraction':
      return times(s.size, (i) => generateSubtraction({ difficulty, seed: hashSeed(runSeed, i) }));
    case 'math.comparison':
      return times(s.size, (i) => generateComparison({ difficulty, seed: hashSeed(runSeed, i) }));
    case 'math.ordering':
      return times(s.size, (i) =>
        generateOrdering({
          difficulty,
          seed: hashSeed(runSeed, i),
          direction: i % 2 === 0 ? 'asc' : 'desc'
        })
      );
    case 'math.multiplication':
      return times(s.size, (i) => generateMultiplication({ difficulty, seed: hashSeed(runSeed, i) }));
    case 'english.colours':
      return buildColoursSet();
    case 'english.animals':
      return buildAnimalsSet();
    case 'english.numbers':
      return buildNumbersSet();
  }

  throw new Error(`No content builder for topic: ${s.topicId}`);
}

function times<T>(n: number, fn: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}
