import type { MultipleChoiceSpec } from '@/engine/types';

/**
 * Partes del cuerpo humano — nivel muy básico.
 */
interface BodyPart {
  emoji: string;
  es: string;
  ca: string;
}

const PARTS: BodyPart[] = [
  { emoji: '👁️', es: 'ojo', ca: 'ull' },
  { emoji: '👂', es: 'oreja', ca: 'orella' },
  { emoji: '👃', es: 'nariz', ca: 'nas' },
  { emoji: '👄', es: 'boca', ca: 'boca' },
  { emoji: '🖐️', es: 'mano', ca: 'mà' },
  { emoji: '🦶', es: 'pie', ca: 'peu' },
  { emoji: '🦵', es: 'pierna', ca: 'cama' }
];

export function buildBodyPartsSet(): MultipleChoiceSpec[] {
  const pool = [...PARTS].sort(() => Math.random() - 0.5).slice(0, 5);
  return pool.map((p, i) => {
    const distractors = PARTS.filter((x) => x.es !== p.es)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const es = [p.es, ...distractors.map((d) => d.es)].sort(() => Math.random() - 0.5);
    const ca = [p.ca, ...distractors.map((d) => d.ca)].sort(() => Math.random() - 0.5);
    return {
      id: `science.body.${i}`,
      type: 'multiple_choice',
      subjectId: 'science',
      topicId: 'science.body',
      difficulty: 1,
      question: {
        es: '¿Qué parte del cuerpo es?',
        ca: 'Quina part del cos és?'
      },
      visual: { glyph: p.emoji, label: p.es },
      options: es.map((word, idx) => ({ es: word, ca: ca[idx]! })),
      correctIndex: es.indexOf(p.es),
      hint: {
        es: 'Fíjate en la forma del icono.',
        ca: 'Fixa’t en la forma de la icona.'
      }
    };
  });
}
