import type { SubjectId } from '@/data/subjects';

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type ExerciseType =
  | 'multiple_choice'
  | 'math_operation'
  | 'matching'
  | 'image_selection'
  | 'ordering'
  | 'memory';

export interface Localized {
  es: string;
  ca: string;
  en?: string;
}

export interface ExerciseBase {
  id: string;
  type: ExerciseType;
  subjectId: SubjectId;
  topicId: string;
  difficulty: Difficulty;
  /** Etiquetas del currículo (pendiente auditar). */
  curriculum?: string[];
  hint?: Localized;
  explanation?: Localized;
}

export interface MultipleChoiceSpec extends ExerciseBase {
  type: 'multiple_choice';
  question: Localized;
  options: Localized[];
  correctIndex: number;
}

export interface MathOperationSpec extends ExerciseBase {
  type: 'math_operation';
  /** Renderizado visual del planteamiento (`"34 + 28"`). */
  render: string;
  /** Respuesta numérica esperada. Siempre calculada, nunca inventada. */
  answer: number;
  /** Vista previa opcional en dos líneas: `["  34", "+ 28"]`. */
  columns?: [string, string];
}

export interface MatchingSpec extends ExerciseBase {
  type: 'matching';
  prompt: Localized;
  /** Pares que hay que unir. El orden en pantalla se aleatoriza. */
  pairs: { left: Localized; right: Localized }[];
}

export interface ImageSelectionSpec extends ExerciseBase {
  type: 'image_selection';
  question: Localized;
  /** Cada opción es un emoji grande. Formato: {glyph, label, isCorrect}. */
  options: { glyph: string; label: Localized; isCorrect: boolean }[];
}

export interface OrderingSpec extends ExerciseBase {
  type: 'ordering';
  prompt: Localized;
  /** Elementos a ordenar. Se presentan barajados; el orden correcto es el del array. */
  items: { key: string; label: string; sortValue: number }[];
  direction: 'asc' | 'desc';
}

export interface MemorySpec extends ExerciseBase {
  type: 'memory';
  prompt: Localized;
  /** Pares que hay que encontrar. Cada par produce 2 cartas con el mismo `pairId`. */
  pairs: { pairId: string; a: { glyph: string; label?: string }; b: { glyph: string; label?: string } }[];
}

export type ExerciseSpec =
  | MultipleChoiceSpec
  | MathOperationSpec
  | MatchingSpec
  | ImageSelectionSpec
  | OrderingSpec
  | MemorySpec;

/** Resultado de UN intento del jugador dentro de un ejercicio. */
export interface AttemptResult {
  correct: boolean;
  /** Mensaje amable a mostrar en el panel de feedback. */
  feedbackKey: 'feedback.correct' | 'feedback.retry' | 'feedback.close';
  /** Explicación adicional si estamos en el 2º+ intento fallado. */
  showExplanation?: boolean;
}

export interface SessionSummary {
  total: number;
  correct: number;
  firstTryCorrect: number;
  hintsUsed: number;
  totalMs: number;
  xpEarned: number;
}
