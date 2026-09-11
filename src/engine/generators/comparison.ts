import { rngFromSeed, hashSeed } from '@/lib/prng';
import type { Difficulty, MultipleChoiceSpec } from '@/engine/types';

export interface ComparisonParams {
  difficulty: Difficulty;
  seed: number;
}

/** Rango de números por dificultad (públic 2º primaria). */
const RANGES: Record<Difficulty, [number, number]> = {
  1: [1, 20],
  2: [10, 99],
  3: [50, 200],
  4: [100, 500],
  5: [200, 999]
};

/**
 * Ejercicio "¿cuál es mayor?" con 2 opciones.
 * Garantizamos por construcción que a != b (rechazo si sale igual).
 */
export function generateComparison({ difficulty, seed }: ComparisonParams): MultipleChoiceSpec {
  const [min, max] = RANGES[difficulty];
  const rng = rngFromSeed(seed);
  let a = 0;
  let b = 0;
  for (let attempt = 0; attempt < 20; attempt++) {
    a = rng.int(min, max);
    b = rng.int(min, max);
    if (a !== b) break;
  }
  if (a === b) b = a + 1;

  const bigger = a > b ? String(a) : String(b);
  const smaller = a > b ? String(b) : String(a);
  // El orden en pantalla se aleatoriza por el propio hashSeed.
  const optionsRaw = rng.next() < 0.5 ? [smaller, bigger] : [bigger, smaller];
  const correctIndex = optionsRaw.indexOf(bigger);

  const idSeed = hashSeed('cmp', difficulty, seed);
  return {
    id: `gen:cmp:d${difficulty}:${idSeed}`,
    type: 'multiple_choice',
    subjectId: 'math',
    topicId: 'math.comparison',
    difficulty,
    curriculum: ['RD.MAT.A.4', 'DEC.MAT.SNUM.REL'],
    question: {
      es: '¿Qué número es mayor?',
      ca: 'Quin nombre és més gran?'
    },
    options: optionsRaw.map((v) => ({ es: v, ca: v })),
    correctIndex,
    hint: {
      es: 'Fíjate primero en las centenas, luego en las decenas y por último en las unidades.',
      ca: "Fixa't primer en les centenes, després en les desenes i finalment en les unitats."
    }
  };
}
