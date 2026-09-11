import { rngFromSeed, hashSeed } from '@/lib/prng';
import type { Difficulty, MathOperationSpec } from '@/engine/types';

export interface SubtractionParams {
  difficulty: Difficulty;
  seed: number;
}

interface Range {
  min: number;
  maxA: number;
  requireBorrow: boolean;
  forbidBorrow: boolean;
}

const RANGES: Record<Difficulty, Range> = {
  1: { min: 1, maxA: 9, requireBorrow: false, forbidBorrow: true },
  2: { min: 1, maxA: 20, requireBorrow: false, forbidBorrow: true },
  3: { min: 10, maxA: 89, requireBorrow: false, forbidBorrow: true },
  4: { min: 15, maxA: 89, requireBorrow: true, forbidBorrow: false },
  5: { min: 100, maxA: 999, requireBorrow: true, forbidBorrow: false }
};

function needsBorrow(a: number, b: number): boolean {
  const s = a.toString();
  const t = b.toString();
  const len = Math.max(s.length, t.length);
  for (let i = 0; i < len; i++) {
    const da = Number(s[s.length - 1 - i] ?? 0);
    const db = Number(t[t.length - 1 - i] ?? 0);
    if (db > da) return true;
    if (db < da) return false;
  }
  return false;
}

export function generateSubtraction({ difficulty, seed }: SubtractionParams): MathOperationSpec {
  const range = RANGES[difficulty];
  const rng = rngFromSeed(seed);

  let a = 0;
  let b = 0;
  for (let attempt = 0; attempt < 30; attempt++) {
    a = rng.int(range.min + 1, range.maxA);
    b = rng.int(range.min, a); // garantiza a >= b (sin negativos en 2º Primaria)
    const borrow = needsBorrow(a, b);
    if (range.forbidBorrow && borrow) continue;
    if (range.requireBorrow && !borrow) continue;
    break;
  }

  const answer = a - b;
  const idSeed = hashSeed('sub', difficulty, seed);

  return {
    id: `gen:sub:d${difficulty}:${idSeed}`,
    type: 'math_operation',
    subjectId: 'math',
    topicId: 'math.subtraction',
    difficulty,
    render: `${a} − ${b}`,
    answer,
    columns: [String(a).padStart(3, ' '), `− ${String(b).padStart(2, ' ')}`],
    hint: {
      es: 'Empieza por las unidades. Si el número de arriba es menor, "pide prestado" a la decena.',
      ca: 'Comença per les unitats. Si el nombre de dalt és més petit, "demana" a la desena.'
    },
    explanation: {
      es: `${a} − ${b} = ${answer}. Ve columna por columna, de derecha a izquierda.`,
      ca: `${a} − ${b} = ${answer}. Ves columna per columna, de dreta a esquerra.`
    }
  };
}
