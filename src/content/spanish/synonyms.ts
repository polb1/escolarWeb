import type { MultipleChoiceSpec } from '@/engine/types';

interface SynonymPair {
  word: string;
  synonym: string;
  distractors: string[];
}

const PAIRS: SynonymPair[] = [
  { word: 'alegre', synonym: 'contento', distractors: ['triste', 'enfadado', 'cansado'] },
  { word: 'bonito', synonym: 'hermoso', distractors: ['feo', 'sucio', 'roto'] },
  { word: 'rápido', synonym: 'veloz', distractors: ['lento', 'quieto', 'pesado'] },
  { word: 'grande', synonym: 'enorme', distractors: ['pequeño', 'poco', 'corto'] },
  { word: 'valiente', synonym: 'atrevido', distractors: ['miedoso', 'tímido', 'callado'] },
  { word: 'guapo', synonym: 'apuesto', distractors: ['feo', 'raro', 'desordenado'] },
  { word: 'listo', synonym: 'inteligente', distractors: ['tonto', 'lento', 'flojo'] }
];

export function buildSynonymsSet(): MultipleChoiceSpec[] {
  const pool = [...PAIRS].sort(() => Math.random() - 0.5).slice(0, 5);
  return pool.map((p, i) => {
    const options = [p.synonym, ...p.distractors].sort(() => Math.random() - 0.5);
    return {
      id: `spanish.synonyms.${i}`,
      type: 'multiple_choice',
      subjectId: 'spanish',
      topicId: 'spanish.synonyms',
      difficulty: 1,
      curriculum: ['RD.LCL.D.vocab'],
      question: {
        es: `¿Qué palabra significa lo mismo que "${p.word}"?`,
        ca: `Quina paraula significa el mateix que "${p.word}"?`
      },
      options: options.map((w) => ({ es: w, ca: w })),
      correctIndex: options.indexOf(p.synonym),
      hint: {
        es: 'Piensa en una palabra que puedas usar en su lugar sin que cambie el sentido.',
        ca: 'Pensa en una paraula que puguis fer servir al seu lloc sense que canviï el sentit.'
      }
    };
  });
}
