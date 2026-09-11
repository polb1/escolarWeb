import { describe, expect, it } from 'vitest';
import { generateAddition } from '@/engine/generators/addition';
import { generateSubtraction } from '@/engine/generators/subtraction';
import type { Difficulty } from '@/engine/types';
import { hashSeed } from '@/lib/prng';

const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];
const SAMPLE_SIZE = 300;

/**
 * Estos tests son la red de seguridad crítica del engine:
 *   - Nunca un ejercicio con respuesta declarada errónea.
 *   - Nunca un resultado negativo en restas.
 *   - Determinismo garantizado por seed.
 *   - Los rangos y las llevadas cumplen las restricciones anunciadas por nivel.
 */

describe('addition generator', () => {
  it.each(DIFFICULTIES)('la respuesta declarada es correcta (d%s)', (d) => {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const spec = generateAddition({ difficulty: d, seed: hashSeed('t-add', d, i) });
      const [aStr, bStr] = spec.render.split(' + ');
      const a = Number(aStr);
      const b = Number(bStr);
      expect(a + b).toBe(spec.answer);
      expect(Number.isInteger(a)).toBe(true);
      expect(Number.isInteger(b)).toBe(true);
      expect(a).toBeGreaterThan(0);
      expect(b).toBeGreaterThan(0);
    }
  });

  it('mismo seed → misma pregunta (determinismo)', () => {
    const s1 = generateAddition({ difficulty: 3, seed: 42 });
    const s2 = generateAddition({ difficulty: 3, seed: 42 });
    expect(s1.render).toBe(s2.render);
    expect(s1.answer).toBe(s2.answer);
    expect(s1.id).toBe(s2.id);
  });

  it('d3 nunca genera llevada (política declarada)', () => {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const spec = generateAddition({ difficulty: 3, seed: hashSeed('nc', i) });
      const [aStr, bStr] = spec.render.split(' + ');
      const a = Number(aStr);
      const b = Number(bStr);
      expect((a % 10) + (b % 10)).toBeLessThan(10);
    }
  });
});

describe('subtraction generator', () => {
  it.each(DIFFICULTIES)('la respuesta declarada es correcta y no negativa (d%s)', (d) => {
    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const spec = generateSubtraction({ difficulty: d, seed: hashSeed('t-sub', d, i) });
      const [aStr, bStr] = spec.render.split(' − ');
      const a = Number(aStr);
      const b = Number(bStr);
      expect(a - b).toBe(spec.answer);
      expect(spec.answer).toBeGreaterThanOrEqual(0);
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it('mismo seed → misma pregunta', () => {
    const s1 = generateSubtraction({ difficulty: 2, seed: 7 });
    const s2 = generateSubtraction({ difficulty: 2, seed: 7 });
    expect(s1.render).toBe(s2.render);
    expect(s1.answer).toBe(s2.answer);
  });
});
