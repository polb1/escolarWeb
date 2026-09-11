import type { MultipleChoiceSpec } from '@/engine/types';

/**
 * Vocabulari bàsic: animals de la granja i de bosc, amb emoji.
 * Format: emoji + "Com es diu aquest animal?" + opcions en català.
 */
interface Item {
  emoji: string;
  word: string;
}

const ANIMALS: Item[] = [
  { emoji: '🐶', word: 'gos' },
  { emoji: '🐱', word: 'gat' },
  { emoji: '🐴', word: 'cavall' },
  { emoji: '🐮', word: 'vaca' },
  { emoji: '🐷', word: 'porc' },
  { emoji: '🐔', word: 'gallina' },
  { emoji: '🐰', word: 'conill' },
  { emoji: '🐑', word: 'ovella' }
];

function pickDistractors(target: string, count: number): string[] {
  return ANIMALS.filter((a) => a.word !== target)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((a) => a.word);
}

export function buildAnimalsCatalanSet(): MultipleChoiceSpec[] {
  const pool = [...ANIMALS].sort(() => Math.random() - 0.5).slice(0, 5);
  return pool.map((a, i) => {
    const distractors = pickDistractors(a.word, 3);
    const options = [a.word, ...distractors].sort(() => Math.random() - 0.5);
    return {
      id: `catalan.animals.${i}`,
      type: 'multiple_choice',
      subjectId: 'catalan',
      topicId: 'catalan.animals',
      difficulty: 1,
      question: {
        es: `${a.emoji}  ¿Cómo se dice este animal en catalán?`,
        ca: `${a.emoji}  Com es diu aquest animal?`
      },
      options: options.map((w) => ({ es: w, ca: w })),
      correctIndex: options.indexOf(a.word),
      hint: {
        es: 'Mira el dibujo y elige el nombre correcto.',
        ca: 'Mira el dibuix i tria el nom correcte.'
      }
    };
  });
}
