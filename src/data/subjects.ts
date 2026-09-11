export type SubjectId = 'math' | 'spanish' | 'catalan' | 'science' | 'english';

export interface Subject {
  id: SubjectId;
  nameKey: string;
  taglineKey: string;
  icon: string;
  status: 'available' | 'coming_soon';
  colorVar: string;
}

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    nameKey: 'subjects.math.name',
    taglineKey: 'subjects.math.tagline',
    icon: '🔢',
    status: 'available',
    colorVar: 'var(--color-subject-math)'
  },
  {
    id: 'english',
    nameKey: 'subjects.english.name',
    taglineKey: 'subjects.english.tagline',
    icon: '🇬🇧',
    status: 'available',
    colorVar: 'var(--color-subject-english)'
  },
  {
    id: 'spanish',
    nameKey: 'subjects.spanish.name',
    taglineKey: 'subjects.spanish.tagline',
    icon: '📖',
    status: 'available',
    colorVar: 'var(--color-subject-spanish)'
  },
  {
    id: 'catalan',
    nameKey: 'subjects.catalan.name',
    taglineKey: 'subjects.catalan.tagline',
    icon: '🟣',
    status: 'available',
    colorVar: 'var(--color-subject-catalan)'
  },
  {
    id: 'science',
    nameKey: 'subjects.science.name',
    taglineKey: 'subjects.science.tagline',
    icon: '🌱',
    status: 'available',
    colorVar: 'var(--color-subject-science)'
  }
];
