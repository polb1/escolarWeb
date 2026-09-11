import type { MultipleChoiceSpec } from '@/engine/types';

interface Pair {
  word: string;
  antonym: string;
  distractors: string[];
}

const PAIRS: Pair[] = [
  { word: 'alto', antonym: 'bajo', distractors: ['grande', 'largo', 'pesado'] },
  { word: 'frío', antonym: 'caliente', distractors: ['fresco', 'seco', 'suave'] },
  { word: 'día', antonym: 'noche', distractors: ['tarde', 'sol', 'hora'] },
  { word: 'abrir', antonym: 'cerrar', distractors: ['entrar', 'salir', 'sacar'] },
  { word: 'sucio', antonym: 'limpio', distractors: ['nuevo', 'roto', 'pequeño'] },
  { word: 'rápido', antonym: 'lento', distractors: ['tarde', 'quieto', 'ligero'] },
  { word: 'dulce', antonym: 'salado', distractors: ['amargo', 'blando', 'rico'] }
];

export function buildAntonymsSet(): MultipleChoiceSpec[] {
  const pool = [...PAIRS].sort(() => Math.random() - 0.5).slice(0, 5);
  return pool.map((p, i) => {
    const options = [p.antonym, ...p.distractors].sort(() => Math.random() - 0.5);
    return {
      id: `spanish.antonyms.${i}`,
      type: 'multiple_choice',
      subjectId: 'spanish',
      topicId: 'spanish.antonyms',
      difficulty: 1,
      question: {
        es: `¿Qué palabra significa lo contrario de "${p.word}"?`,
        ca: `Quina paraula significa el contrari de "${p.word}"?`
      },
      options: options.map((w) => ({ es: w, ca: w })),
      correctIndex: options.indexOf(p.antonym),
      hint: {
        es: 'Busca la palabra que expresa la idea opuesta.',
        ca: 'Busca la paraula que expressa la idea oposada.'
      }
    };
  });
}
