import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { RendererProps } from '../registry';
import type { MatchingSpec } from '../types';
import { rngFromSeed, hashSeed } from '@/lib/prng';

interface Pair {
  key: string;
  leftText: string;
  rightText: string;
}

export function MatchingRenderer({ spec, onAttempt, showHint, lang }: RendererProps<MatchingSpec>) {
  const pairs: Pair[] = useMemo(
    () =>
      spec.pairs.map((p, i) => ({
        key: `${spec.id}:${i}`,
        leftText: p.left[lang],
        rightText: p.right[lang]
      })),
    [spec, lang]
  );

  const rightOrder = useMemo(() => {
    const rng = rngFromSeed(hashSeed(spec.id, 'right'));
    return rng.shuffle(pairs);
  }, [spec.id, pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});

  function pickLeft(key: string) {
    if (matched[key]) return;
    setSelectedLeft(key);
  }

  function pickRight(rightKey: string) {
    if (!selectedLeft) return;
    const correct = selectedLeft === rightKey;
    if (correct) {
      setMatched((m) => ({ ...m, [selectedLeft]: rightKey }));
      const newlyDone = Object.keys(matched).length + 1 === pairs.length;
      onAttempt({
        correct: newlyDone,
        feedbackKey: newlyDone ? 'feedback.correct' : 'feedback.retry'
      });
    } else {
      onAttempt({ correct: false, feedbackKey: 'feedback.retry' });
    }
    setSelectedLeft(null);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="font-black text-2xl text-center mb-6">{spec.prompt[lang]}</h2>

      {showHint && spec.hint && (
        <div className="mb-4 rounded-2xl bg-yellow-50 border border-yellow-200 p-3 text-center">
          💡 {spec.hint[lang]}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <ul className="space-y-3">
          {pairs.map((p) => {
            const isMatched = !!matched[p.key];
            const isSelected = selectedLeft === p.key;
            return (
              <li key={p.key}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  disabled={isMatched}
                  onClick={() => pickLeft(p.key)}
                  className="w-full rounded-2xl bg-surfaceElevated shadow-card p-4 text-lg font-bold border-4"
                  style={{
                    borderColor: isSelected
                      ? 'var(--color-brand)'
                      : isMatched
                        ? 'var(--color-correct)'
                        : 'transparent',
                    opacity: isMatched ? 0.6 : 1
                  }}
                >
                  {p.leftText}
                </motion.button>
              </li>
            );
          })}
        </ul>
        <ul className="space-y-3">
          {rightOrder.map((p) => {
            const rightKey = p.key;
            const alreadyUsed = Object.values(matched).includes(rightKey);
            return (
              <li key={rightKey}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  disabled={alreadyUsed}
                  onClick={() => pickRight(rightKey)}
                  className="w-full rounded-2xl bg-surfaceElevated shadow-card p-4 text-lg font-bold border-4"
                  style={{
                    borderColor: alreadyUsed ? 'var(--color-correct)' : 'transparent',
                    opacity: alreadyUsed ? 0.6 : 1
                  }}
                >
                  {p.rightText}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
