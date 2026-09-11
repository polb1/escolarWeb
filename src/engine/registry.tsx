import type { ComponentType } from 'react';
import type { ExerciseSpec, ExerciseType, AttemptResult } from './types';
import { MultipleChoiceRenderer } from './renderers/MultipleChoice';
import { MathOperationRenderer } from './renderers/MathOperation';
import { MatchingRenderer } from './renderers/Matching';
import { ImageSelectionRenderer } from './renderers/ImageSelection';
import { OrderingRenderer } from './renderers/Ordering';
import { MemoryRenderer } from './renderers/Memory';

/** Un renderer recibe la spec y un callback para reportar cada intento. */
export interface RendererProps<S extends ExerciseSpec = ExerciseSpec> {
  spec: S;
  onAttempt: (result: AttemptResult) => void;
  /** true → el renderer debe mostrar la pista automáticamente (adaptatividad). */
  showHint: boolean;
  /** Idioma actual, para elegir la variante correcta de `Localized`. */
  lang: 'es' | 'ca';
}

type AnyRenderer = ComponentType<RendererProps<never>>;

const REGISTRY: Record<ExerciseType, AnyRenderer> = {
  multiple_choice: MultipleChoiceRenderer as unknown as AnyRenderer,
  math_operation: MathOperationRenderer as unknown as AnyRenderer,
  matching: MatchingRenderer as unknown as AnyRenderer,
  image_selection: ImageSelectionRenderer as unknown as AnyRenderer,
  ordering: OrderingRenderer as unknown as AnyRenderer,
  memory: MemoryRenderer as unknown as AnyRenderer
};

export function getRenderer(type: ExerciseType): AnyRenderer {
  const r = REGISTRY[type];
  if (!r) throw new Error(`No renderer for exercise type: ${type}`);
  return r;
}
