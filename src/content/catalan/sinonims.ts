import type { MultipleChoiceSpec } from '@/engine/types';

interface Pair {
  word: string;
  synonym: string;
  distractors: string[];
}

const PAIRS: Pair[] = [
  { word: 'alegre', synonym: 'content', distractors: ['trist', 'enfadat', 'cansat'] },
  { word: 'bonic', synonym: 'formós', distractors: ['lleig', 'brut', 'trencat'] },
  { word: 'ràpid', synonym: 'veloç', distractors: ['lent', 'quiet', 'pesat'] },
  { word: 'gran', synonym: 'enorme', distractors: ['petit', 'poc', 'curt'] },
  { word: 'valent', synonym: 'agosarat', distractors: ['poruc', 'tímid', 'callat'] },
  { word: 'llest', synonym: 'intel·ligent', distractors: ['ruc', 'lent', 'fluix'] }
];

export function buildSinonimsSet(): MultipleChoiceSpec[] {
  const pool = [...PAIRS].sort(() => Math.random() - 0.5).slice(0, 5);
  return pool.map((p, i) => {
    const options = [p.synonym, ...p.distractors].sort(() => Math.random() - 0.5);
    return {
      id: `catalan.sinonims.${i}`,
      type: 'multiple_choice',
      subjectId: 'catalan',
      topicId: 'catalan.sinonims',
      difficulty: 1,
      question: {
        es: `¿Qué palabra en catalán significa lo mismo que "${p.word}"?`,
        ca: `Quina paraula vol dir el mateix que "${p.word}"?`
      },
      options: options.map((w) => ({ es: w, ca: w })),
      correctIndex: options.indexOf(p.synonym),
      hint: {
        es: 'Busca la palabra que expresa una idea muy parecida.',
        ca: 'Busca la paraula que expressa una idea molt semblant.'
      }
    };
  });
}
