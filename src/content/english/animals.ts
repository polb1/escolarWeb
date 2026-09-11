import type { MultipleChoiceSpec } from '@/engine/types';

interface Animal {
  emoji: string;
  word: string;
}

const ANIMALS: Animal[] = [
  { emoji: '🐶', word: 'dog' },
  { emoji: '🐱', word: 'cat' },
  { emoji: '🐟', word: 'fish' },
  { emoji: '🐦', word: 'bird' },
  { emoji: '🐴', word: 'horse' },
  { emoji: '🐮', word: 'cow' },
  { emoji: '🐷', word: 'pig' },
  { emoji: '🐘', word: 'elephant' }
];

function pickDistractors(target: string, count: number): string[] {
  return ANIMALS.filter((a) => a.word !== target)
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((a) => a.word);
}

export function buildAnimalsSet(): MultipleChoiceSpec[] {
  return ANIMALS.slice(0, 5).map((animal, i) => {
    const distractors = pickDistractors(animal.word, 3);
    const options = [animal.word, ...distractors].sort(() => Math.random() - 0.5);
    return {
      id: `english.animals.${i}`,
      type: 'multiple_choice',
      subjectId: 'english',
      topicId: 'english.animals',
      difficulty: 1,
      question: {
        es: 'What animal is this?',
        ca: 'What animal is this?'
      },
      visual: { glyph: animal.emoji, label: animal.word },
      options: options.map((w) => ({ es: w, ca: w })),
      correctIndex: options.indexOf(animal.word),
      hint: {
        es: 'Mira el dibujo y elige el nombre del animal en inglés.',
        ca: "Mira el dibuix i tria el nom de l'animal en anglès."
      }
    };
  });
}
