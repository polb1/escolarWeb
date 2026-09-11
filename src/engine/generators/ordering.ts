import { rngFromSeed, hashSeed } from '@/lib/prng';
import type { Difficulty, OrderingSpec } from '@/engine/types';

export interface OrderingParams {
  difficulty: Difficulty;
  seed: number;
  direction?: 'asc' | 'desc';
}

const RANGES: Record<Difficulty, { min: number; max: number; size: number }> = {
  1: { min: 1, max: 20, size: 3 },
  2: { min: 10, max: 99, size: 3 },
  3: { min: 10, max: 99, size: 4 },
  4: { min: 50, max: 500, size: 4 },
  5: { min: 100, max: 999, size: 5 }
};

/** Genera un ejercicio "ordena de menor a mayor" con N números únicos. */
export function generateOrdering({
  difficulty,
  seed,
  direction = 'asc'
}: OrderingParams): OrderingSpec {
  const range = RANGES[difficulty];
  const rng = rngFromSeed(seed);
  const nums = new Set<number>();
  let safety = 200;
  while (nums.size < range.size && safety-- > 0) {
    nums.add(rng.int(range.min, range.max));
  }
  const arr = Array.from(nums);
  arr.sort((a, b) => (direction === 'asc' ? a - b : b - a));

  const items = arr.map((n) => ({ key: `n:${n}`, label: String(n), sortValue: n }));
  const idSeed = hashSeed('ord', difficulty, seed);

  return {
    id: `gen:ord:d${difficulty}:${idSeed}`,
    type: 'ordering',
    subjectId: 'math',
    topicId: 'math.ordering',
    difficulty,
    prompt: {
      es: direction === 'asc' ? 'Ordena de menor a mayor' : 'Ordena de mayor a menor',
      ca: direction === 'asc' ? 'Ordena de menor a més gran' : 'Ordena de més gran a menor'
    },
    items,
    direction,
    hint: {
      es: 'Arrastra las tarjetas para colocarlas en el orden correcto.',
      ca: 'Arrossega les targetes per posar-les en l’ordre correcte.'
    }
  };
}
