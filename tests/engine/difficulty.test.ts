import { describe, expect, it } from 'vitest';
import { adjustDifficulty, computeXp } from '@/engine/difficulty';

describe('adjustDifficulty', () => {
  it('mantiene el nivel si hay menos de 3 intentos', () => {
    expect(adjustDifficulty(3, [])).toEqual({ next: 3, forceHelp: false });
    expect(adjustDifficulty(3, [{ correct: true, hintsUsed: 0 }])).toEqual({ next: 3, forceHelp: false });
  });

  it('sube nivel con ≥80% aciertos', () => {
    const recent = Array.from({ length: 10 }, (_, i) => ({ correct: i < 9, hintsUsed: 0 }));
    expect(adjustDifficulty(3, recent).next).toBe(4);
  });

  it('no sube por encima de 5', () => {
    const recent = Array.from({ length: 10 }, () => ({ correct: true, hintsUsed: 0 }));
    expect(adjustDifficulty(5, recent).next).toBe(5);
  });

  it('baja nivel con ≤40% aciertos y fuerza ayuda', () => {
    const recent = Array.from({ length: 10 }, (_, i) => ({ correct: i < 3, hintsUsed: 0 }));
    const r = adjustDifficulty(3, recent);
    expect(r.next).toBe(2);
    expect(r.forceHelp).toBe(true);
  });

  it('no baja por debajo de 1', () => {
    const recent = Array.from({ length: 10 }, () => ({ correct: false, hintsUsed: 0 }));
    expect(adjustDifficulty(1, recent).next).toBe(1);
  });

  it('mantiene en la zona media', () => {
    const recent = Array.from({ length: 10 }, (_, i) => ({ correct: i < 6, hintsUsed: 0 }));
    expect(adjustDifficulty(3, recent).next).toBe(3);
  });
});

describe('computeXp', () => {
  it('nunca da 0 aunque falle sin dificultad', () => {
    expect(computeXp({ difficulty: 1, correct: false, firstTry: false, hintsUsed: 1 })).toBeGreaterThanOrEqual(3);
  });

  it('máximo cuando acierta al primer intento sin pistas', () => {
    const max = computeXp({ difficulty: 5, correct: true, firstTry: true, hintsUsed: 0 });
    const withHint = computeXp({ difficulty: 5, correct: true, firstTry: true, hintsUsed: 1 });
    expect(withHint).toBeLessThan(max);
  });
});
