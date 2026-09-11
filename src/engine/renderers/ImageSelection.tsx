import { useState } from 'react';
import { motion } from 'framer-motion';
import type { RendererProps } from '../registry';
import type { ImageSelectionSpec } from '../types';

export function ImageSelectionRenderer({
  spec,
  onAttempt,
  showHint,
  lang
}: RendererProps<ImageSelectionSpec>) {
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  function handlePick(i: number) {
    if (locked) return;
    setPicked(i);
    const correct = !!spec.options[i]?.isCorrect;
    setLocked(correct);
    onAttempt({
      correct,
      feedbackKey: correct ? 'feedback.correct' : 'feedback.retry'
    });
    if (!correct) {
      setTimeout(() => {
        setPicked(null);
        setLocked(false);
      }, 900);
    }
  }

  return (
    <div className="w-full">
      <h2 className="font-black text-2xl md:text-3xl text-center mb-6">{spec.question[lang]}</h2>

      {showHint && spec.hint && (
        <div className="mx-auto max-w-xl mb-4 rounded-2xl bg-yellow-50 border border-yellow-200 p-3 text-center">
          💡 {spec.hint[lang]}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
        {spec.options.map((opt, i) => {
          const isPicked = picked === i;
          const state = !isPicked ? 'idle' : opt.isCorrect ? 'good' : 'bad';
          return (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: locked ? 1 : 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handlePick(i)}
              className="rounded-2xl bg-surfaceElevated shadow-card p-5 flex flex-col items-center justify-center gap-2 border-4"
              style={{ borderColor: colorFor(state), minHeight: 140 }}
              disabled={locked}
              aria-label={opt.label[lang]}
            >
              <span aria-hidden="true" className="text-6xl">
                {opt.glyph}
              </span>
              <span className="text-sm font-bold text-inkSoft">{opt.label[lang]}</span>
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
