import type { MultipleChoiceSpec } from '@/engine/types';

/**
 * Inglés muy básico para 2º de primaria: vocabulario de colores.
 * Formato: emoji con "What colour?" y 4 opciones en inglés.
 * Los distractores están escritos a mano para asegurarse de que no colisionan.
 */

interface ColourItem {
  emoji: string;
  word: string;
}

const COLOURS: ColourItem[] = [
  { emoji: '🟥', word: 'red' },
  { emoji: '🟦', word: 'blue' },
  { emoji: '🟩', word: 'green' },
  { emoji: '🟨', word: 'yellow' },
  { emoji: '⬛', word: 'black' },
  { emoji: '⬜', word: 'white' },
  { emoji: '🟧', word: 'orange' },
  { emoji: '🟪', word: 'purple' }
];

function pickDistractors(target: string, count: number): string[] {
  return COLOURS.filter((c) => c.word !== target)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((c) => c.word);
}

export function buildColoursSet(): MultipleChoiceSpec[] {
  return COLOURS.slice(0, 5).map((c, i) => {
    const distractors = pickDistractors(c.word, 3);
    const options = [c.word, ...distractors].sort(() => Math.random() - 0.5);
    return {
      id: `english.colours.${i}`,
      type: 'multiple_choice',
      subjectId: 'english',
      topicId: 'english.colours',
      difficulty: 1,
      question: {
        es: 'What colour?',
        ca: 'What colour?'
      },
      visual: { glyph: c.emoji, label: c.word },
      options: options.map((w) => ({ es: w, ca: w })),
      correctIndex: options.indexOf(c.word),
      hint: {
        es: 'Fíjate bien en el color y elige la palabra en inglés.',
        ca: "Fixa't bé en el color i tria la paraula en anglès."
      }
    };
  });
}
