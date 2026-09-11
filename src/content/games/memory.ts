import type { MemorySpec } from '@/engine/types';

/**
 * Juego de memoria: parejas de emoji ↔ emoji o número ↔ cantidad.
 * Cada `build*` devuelve un único MemorySpec — el juego dura hasta emparejar todas.
 */

export function buildMemoryAnimals(): MemorySpec[] {
  return [
    {
      id: 'game.memory.animals',
      type: 'memory',
      subjectId: 'english',
      topicId: 'games.memory.animals',
      difficulty: 1,
      prompt: {
        es: 'Encuentra las parejas de animales',
        ca: 'Troba les parelles d’animals'
      },
      pairs: [
        { pairId: 'dog', a: { glyph: '🐶' }, b: { glyph: '🐶', label: 'dog' } },
        { pairId: 'cat', a: { glyph: '🐱' }, b: { glyph: '🐱', label: 'cat' } },
        { pairId: 'fish', a: { glyph: '🐟' }, b: { glyph: '🐟', label: 'fish' } },
        { pairId: 'horse', a: { glyph: '🐴' }, b: { glyph: '🐴', label: 'horse' } },
        { pairId: 'cow', a: { glyph: '🐮' }, b: { glyph: '🐮', label: 'cow' } },
        { pairId: 'pig', a: { glyph: '🐷' }, b: { glyph: '🐷', label: 'pig' } }
      ]
    }
  ];
}

export function buildMemoryNumbers(): MemorySpec[] {
  // Parejas número ↔ cantidad de puntos.
  const numbers = [
    { n: '1', dots: '●' },
    { n: '2', dots: '● ●' },
    { n: '3', dots: '● ● ●' },
    { n: '4', dots: '● ● ● ●' },
    { n: '5', dots: '● ● ● ● ●' }
  ];
  return [
    {
      id: 'game.memory.numbers',
      type: 'memory',
      subjectId: 'math',
      topicId: 'games.memory.numbers',
      difficulty: 1,
      prompt: {
        es: 'Empareja cada número con la cantidad correcta',
        ca: 'Empareja cada nombre amb la quantitat correcta'
      },
      pairs: numbers.map((x) => ({
        pairId: x.n,
        a: { glyph: x.n },
        b: { glyph: x.dots }
      }))
    }
  ];
}

export function buildMemoryColours(): MemorySpec[] {
  return [
    {
      id: 'game.memory.colours',
      type: 'memory',
      subjectId: 'english',
      topicId: 'games.memory.colours',
      difficulty: 1,
      prompt: {
        es: 'Empareja cada color con su nombre en inglés',
        ca: 'Empareja cada color amb el seu nom en anglès'
      },
      pairs: [
        { pairId: 'red', a: { glyph: '🟥' }, b: { glyph: 'red' } },
        { pairId: 'blue', a: { glyph: '🟦' }, b: { glyph: 'blue' } },
        { pairId: 'green', a: { glyph: '🟩' }, b: { glyph: 'green' } },
        { pairId: 'yellow', a: { glyph: '🟨' }, b: { glyph: 'yellow' } },
        { pairId: 'orange', a: { glyph: '🟧' }, b: { glyph: 'orange' } },
        { pairId: 'purple', a: { glyph: '🟪' }, b: { glyph: 'purple' } }
      ]
    }
  ];
}
