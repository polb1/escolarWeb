import { rngFromSeed, hashSeed } from '@/lib/prng';
import type { Difficulty, MathOperationSpec } from '@/engine/types';

export interface MultiplicationParams {
  difficulty: Difficulty;
  seed: number;
  /** Tabla concreta (2, 5, 10…) o `null` para todas. */
  table?: number | null;
}

/**
 * Multiplicación como introducción en 2º.
 * En 2º de primaria se suele empezar por las tablas del 2, 5 y 10.
 * Difficulty controla qué tabla y qué factor máximo.
 */
export function generateMultiplication({
  difficulty,
  seed,
  table = null
}: MultiplicationParams): MathOperationSpec {
  const rng = rngFromSeed(seed);

  const usedTable = table ?? pickTable(rng, difficulty);
  const maxFactor = difficulty <= 2 ? 5 : difficulty === 3 ? 10 : 10;
  const factor = rng.int(1, maxFactor);

  const answer = usedTable * factor;
  const idSeed = hashSeed('mul', difficulty, seed);

  return {
    id: `gen:mul:d${difficulty}:${idSeed}`,
    type: 'math_operation',
    subjectId: 'math',
    topicId: `math.multiplication.${usedTable}`,
    difficulty,
    render: `${usedTable} × ${factor}`,
    answer,
    hint: {
      es: `Multiplicar ${usedTable} × ${factor} es sumar ${usedTable} un total de ${factor} veces.`,
      ca: `Multiplicar ${usedTable} × ${factor} és sumar ${usedTable} un total de ${factor} vegades.`
    },
    explanation: {
      es: `${usedTable} × ${factor} = ${answer}. Recuerda: multiplicar es sumar el mismo número varias veces.`,
      ca: `${usedTable} × ${factor} = ${answer}. Recorda: multiplicar és sumar el mateix nombre diverses vegades.`
    }
  };
}

function pickTable(rng: { int: (a: number, b: number) => number }, d: Difficulty): number {
  if (d === 1) return 2;
  if (d === 2) return rng.int(0, 1) === 0 ? 2 : 5;
  if (d === 3) return [2, 5, 10][rng.int(0, 2)]!;
  return [2, 3, 4, 5, 10][rng.int(0, 4)]!;
}
