import type { MultipleChoiceSpec } from '@/engine/types';

const NUMBERS = [
  { digit: '1', word: 'one' },
  { digit: '2', word: 'two' },
  { digit: '3', word: 'three' },
  { digit: '4', word: 'four' },
  { digit: '5', word: 'five' },
  { digit: '6', word: 'six' },
  { digit: '7', word: 'seven' },
  { digit: '8', word: 'eight' },
  { digit: '9', word: 'nine' },
  { digit: '10', word: 'ten' }
] as const;

function pickDistractors(target: string, count: number): string[] {
  return NUMBERS.filter((n) => n.word !== target)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((n) => n.word);
}

export function buildNumbersSet(): MultipleChoiceSpec[] {
  const pool = [...NUMBERS].sort(() => Math.random() - 0.5).slice(0, 5);
  return pool.map((n, i) => {
    const distractors = pickDistractors(n.word, 3);
    const options = [n.word, ...distractors].sort(() => Math.random() - 0.5);
    return {
      id: `english.numbers.${i}`,
      type: 'multiple_choice',
      subjectId: 'english',
      topicId: 'english.numbers',
      difficulty: 1,
      question: {
        es: '¿Qué número es?',
        ca: 'Quin nombre és?'
      },
      visual: { glyph: n.digit, label: n.word },
      options: options.map((w) => ({ es: w, ca: w })),
      correctIndex: options.indexOf(n.word),
      hint: {
        es: 'Cuenta despacio en inglés: one, two, three…',
        ca: 'Compta a poc a poc en anglès: one, two, three…'
      }
    };
  });
}
