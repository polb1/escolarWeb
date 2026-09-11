import { describe, expect, it } from 'vitest';
import { generateComparison } from '@/engine/generators/comparison';
import { generateOrdering } from '@/engine/generators/ordering';
import { generateMultiplication } from '@/engine/generators/multiplication';
import type { Difficulty } from '@/engine/types';
import { hashSeed } from '@/lib/prng';

const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];
const N = 200;

describe('comparison generator', () => {
  it.each(DIFFICULTIES)('la opción marcada como correcta es el número mayor (d%s)', (d) => {
    for (let i = 0; i < N; i++) {
      const spec = generateComparison({ difficulty: d, seed: hashSeed('t-cmp', d, i) });
      const chosen = Number(spec.options[spec.correctIndex]!.es);
      const other = Number(spec.options[1 - spec.correctIndex]!.es);
      expect(chosen).toBeGreaterThan(other);
    }
  });
});

describe('ordering generator', () => {
  it.each(DIFFICULTIES)('los sortValue del array están correctamente ordenados (d%s asc)', (d) => {
    for (let i = 0; i < N; i++) {
      const spec = generateOrdering({ difficulty: d, seed: hashSeed('t-ord', d, i), direction: 'asc' });
      const values = spec.items.map((x) => x.sortValue);
      const sorted = [...values].sort((a, b) => a - b);
      expect(values).toEqual(sorted);
      // Todos distintos:
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('desc funciona', () => {
    const spec = generateOrdering({ difficulty: 3, seed: 42, direction: 'desc' });
    const values = spec.items.map((x) => x.sortValue);
    for (let i = 1; i < values.length; i++) {
      expect(values[i - 1]!).toBeGreaterThanOrEqual(values[i]!);
    }
  });
});

describe('multiplication generator', () => {
  it.each(DIFFICULTIES)('la respuesta declarada es correcta (d%s)', (d) => {
    for (let i = 0; i < N; i++) {
      const spec = generateMultiplication({ difficulty: d, seed: hashSeed('t-mul', d, i) });
      const [aStr, bStr] = spec.render.split(' × ');
      const a = Number(aStr);
      const b = Number(bStr);
      expect(a * b).toBe(spec.answer);
    }
  });

  it('d1 solo genera tabla del 2', () => {
    for (let i = 0; i < 50; i++) {
      const spec = generateMultiplication({ difficulty: 1, seed: i });
      const a = Number(spec.render.split(' × ')[0]);
      expect(a).toBe(2);
    }
  });

  it('tabla forzada respeta el parámetro', () => {
    const spec = generateMultiplication({ difficulty: 3, seed: 1, table: 5 });
    expect(Number(spec.render.split(' × ')[0])).toBe(5);
  });
});
