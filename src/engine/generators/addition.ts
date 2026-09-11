import { rngFromSeed, hashSeed } from '@/lib/prng';
import type { Difficulty, MathOperationSpec } from '@/engine/types';

export interface AdditionParams {
  /** 1: 1-cifra sin llevada. 2: hasta 20. 3: 2-cifras sin llevada. 4: 2-cifras con llevada. 5: 2+3 cifras con llevada. */
  difficulty: Difficulty;
  seed: number;
}

interface Range {
  a: [number, number];
  b: [number, number];
  requireCarry: boolean | 'any';
  forbidCarry: boolean;
}

const RANGES: Record<Difficulty, Range> = {
  1: { a: [1, 9], b: [1, 9], requireCarry: false, forbidCarry: true },
  2: { a: [5, 15], b: [1, 9], requireCarry: 'any', forbidCarry: false },
  3: { a: [10, 89], b: [10, 89], requireCarry: false, forbidCarry: true },
  4: { a: [15, 89], b: [11, 89], requireCarry: true, forbidCarry: false },
  5: { a: [100, 799], b: [10, 199], requireCarry: true, forbidCarry: false }
};

function hasCarry(a: number, b: number): boolean {
  const s = a.toString();
  const t = b.toString();
  const len = Math.max(s.length, t.length);
  let carry = 0;
  for (let i = 0; i < len; i++) {
    const da = Number(s[s.length - 1 - i] ?? 0);
    const db = Number(t[t.length - 1 - i] ?? 0);
    const sum = da + db + carry;
    if (sum >= 10) return true;
    carry = 0;
  }
  return false;
}

export function generateAddition({ difficulty, seed }: AdditionParams): MathOperationSpec {
  const range = RANGES[difficulty];
  const rng = rngFromSeed(seed);

  let a = 0;
  let b = 0;
  // Muestreo con rechazo: 30 intentos suficientes con los rangos previstos.
  for (let attempt = 0; attempt < 30; attempt++) {
    a = rng.int(range.a[0], range.a[1]);
    b = rng.int(range.b[0], range.b[1]);
    const carry = hasCarry(a, b);
    if (range.forbidCarry && carry) continue;
    if (range.requireCarry === true && !carry) continue;
    break;
  }

  const answer = a + b;
  const idSeed = hashSeed('add', difficulty, seed);

  return {
    id: `gen:add:d${difficulty}:${idSeed}`,
    type: 'math_operation',
    subjectId: 'math',
    topicId: 'math.addition',
    difficulty,
    curriculum: ['RD.MAT.A.3', 'RD.MAT.A.4'],
    render: `${a} + ${b}`,
    answer,
    columns: [String(a).padStart(3, ' '), `+ ${String(b).padStart(2, ' ')}`],
    hint: {
      es: 'Primero suma las unidades. Después, suma las decenas.',
      ca: 'Primer suma les unitats. Després, suma les desenes.'
    },
    explanation: {
      es: `${a} + ${b} = ${answer}. Piensa la suma paso a paso, columna por columna.`,
      ca: `${a} + ${b} = ${answer}. Pensa la suma pas a pas, columna per columna.`
    }
  };
}
