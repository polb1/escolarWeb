import type { ImageSelectionSpec } from '@/engine/types';

/**
 * "Elige el <categoría>" — image_selection con 4 opciones donde solo una encaja.
 */
interface AnimalItem {
  glyph: string;
  label: { es: string; ca: string };
  category: 'mammal' | 'bird' | 'fish' | 'reptile' | 'insect';
}

const POOL: AnimalItem[] = [
  { glyph: '🐶', label: { es: 'perro', ca: 'gos' }, category: 'mammal' },
  { glyph: '🐱', label: { es: 'gato', ca: 'gat' }, category: 'mammal' },
  { glyph: '🐮', label: { es: 'vaca', ca: 'vaca' }, category: 'mammal' },
  { glyph: '🐴', label: { es: 'caballo', ca: 'cavall' }, category: 'mammal' },
  { glyph: '🐘', label: { es: 'elefante', ca: 'elefant' }, category: 'mammal' },
  { glyph: '🐦', label: { es: 'pájaro', ca: 'ocell' }, category: 'bird' },
  { glyph: '🦉', label: { es: 'búho', ca: 'mussol' }, category: 'bird' },
  { glyph: '🦆', label: { es: 'pato', ca: 'ànec' }, category: 'bird' },
  { glyph: '🐟', label: { es: 'pez', ca: 'peix' }, category: 'fish' },
  { glyph: '🐠', label: { es: 'pez', ca: 'peix' }, category: 'fish' },
  { glyph: '🐍', label: { es: 'serpiente', ca: 'serp' }, category: 'reptile' },
  { glyph: '🐢', label: { es: 'tortuga', ca: 'tortuga' }, category: 'reptile' },
  { glyph: '🦋', label: { es: 'mariposa', ca: 'papallona' }, category: 'insect' },
  { glyph: '🐝', label: { es: 'abeja', ca: 'abella' }, category: 'insect' }
];

const CATEGORIES: Record<AnimalItem['category'], { es: string; ca: string }> = {
  mammal: { es: 'un mamífero', ca: 'un mamífer' },
  bird: { es: 'un ave', ca: 'un ocell' },
  fish: { es: 'un pez', ca: 'un peix' },
  reptile: { es: 'un reptil', ca: 'un rèptil' },
  insect: { es: 'un insecto', ca: 'un insecte' }
};

export function buildAnimalCategoriesSet(): ImageSelectionSpec[] {
  const wanted: AnimalItem['category'][] = ['mammal', 'bird', 'fish', 'reptile', 'insect'];
  return wanted.map((cat, i) => {
    const correct = POOL.filter((a) => a.category === cat).sort(() => Math.random() - 0.5)[0]!;
    const distractors = POOL.filter((a) => a.category !== cat)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [correct, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((a) => ({
        glyph: a.glyph,
        label: a.label,
        isCorrect: a.category === cat
      }));
    return {
      id: `science.animals.${cat}.${i}`,
      type: 'image_selection',
      subjectId: 'science',
      topicId: 'science.animals',
      difficulty: 1,
      curriculum: ['DEC.CMN.CC.vida'],
      question: {
        es: `Elige ${CATEGORIES[cat].es}`,
        ca: `Tria ${CATEGORIES[cat].ca}`
      },
      options,
      hint: {
        es: 'Piensa qué caracteriza a este tipo de animal.',
        ca: 'Pensa què caracteritza aquest tipus d’animal.'
      }
    };
  });
}
