import { useState } from 'react';
import { motion } from 'framer-motion';
import type { RendererProps } from '../registry';
import type { MultipleChoiceSpec } from '../types';

export function MultipleChoiceRenderer({
  spec,
  onAttempt,
  showHint,
  lang
}: RendererProps<MultipleChoiceSpec>) {
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  function handlePick(i: number) {
    if (locked) return;
    setPicked(i);
    const correct = i === spec.correctIndex;
    setLocked(correct);
    onAttempt({
      correct,
      feedbackKey: correct ? 'feedback.correct' : 'feedback.retry'
    });
    if (!correct) {
      // Permitir reintento inmediato tras breve delay
      setTimeout(() => {
        setPicked(null);
        setLocked(false);
      }, 900);
    }
  }

  return (
    <div className="w-full">
      {spec.visual && (
        <div className="mx-auto mb-6 max-w-[280px] rounded-3xl bg-surfaceElevated shadow-card border border-black/5 aspect-square grid place-items-center">
          <div
            className="text-[7rem] md:text-[9rem] leading-none select-none"
            aria-label={spec.visual.label}
            role="img"
          >
            {spec.visual.glyph}
          </div>
        </div>
      )}
      <h2 className="font-black text-2xl md:text-3xl text-center mb-6">{spec.question[lang]}</h2>

      {showHint && spec.hint && (
        <div className="mx-auto max-w-xl mb-4 rounded-2xl bg-yellow-50 border border-yellow-200 p-3 text-center text-ink">
          💡 {spec.hint[lang]}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
        {spec.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === spec.correctIndex;
          const state = !isPicked ? 'idle' : isCorrect ? 'good' : 'bad';
          return (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: locked ? 1 : 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePick(i)}
              className="rounded-2xl bg-surfaceElevated shadow-card p-5 text-lg font-bold border-4"
              style={{ borderColor: colorFor(state) }}
              disabled={locked}
            >
              {opt[lang]}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function colorFor(s: 'idle' | 'good' | 'bad') {
  if (s === 'good') return 'var(--color-correct)';
  if (s === 'bad') return 'var(--color-retry)';
  return 'transparent';
}
