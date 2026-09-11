import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { RendererProps } from '../registry';
import type { MemorySpec } from '../types';
import { rngFromSeed, hashSeed } from '@/lib/prng';

interface Card {
  key: string;
  pairId: string;
  glyph: string;
  label?: string;
}

/**
 * Juego de memoria (parejas). El "onAttempt(correct=true)" se emite una sola
 * vez, cuando el niño encuentra todas las parejas → el player cierra la sesión.
 */
export function MemoryRenderer({ spec, onAttempt, showHint, lang }: RendererProps<MemorySpec>) {
  const cards: Card[] = useMemo(() => {
    const list: Card[] = [];
    spec.pairs.forEach((p) => {
      list.push({ key: `${p.pairId}:a`, pairId: p.pairId, glyph: p.a.glyph, label: p.a.label });
      list.push({ key: `${p.pairId}:b`, pairId: p.pairId, glyph: p.b.glyph, label: p.b.label });
    });
    const rng = rngFromSeed(hashSeed(spec.id, 'shuffle'));
    return rng.shuffle(list);
  }, [spec]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [locked, setLocked] = useState(false);

  function pick(card: Card) {
    if (locked || matched.has(card.pairId) || flipped.includes(card.key)) return;
    if (flipped.length === 0) {
      setFlipped([card.key]);
      return;
    }
    const firstKey = flipped[0]!;
    const first = cards.find((c) => c.key === firstKey)!;
    setFlipped([firstKey, card.key]);
    if (first.pairId === card.pairId) {
      // Match
      const nextMatched = new Set(matched);
      nextMatched.add(card.pairId);
      setTimeout(() => {
        setMatched(nextMatched);
        setFlipped([]);
        if (nextMatched.size === spec.pairs.length) {
          onAttempt({ correct: true, feedbackKey: 'feedback.correct' });
        }
      }, 500);
    } else {
      setLocked(true);
      setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, 900);
    }
  }

  const cols = cards.length <= 6 ? 3 : cards.length <= 12 ? 4 : 5;

  return (
    <div className="w-full max-w-lg mx-auto">
      <h2 className="font-black text-xl md:text-2xl text-center mb-4">{spec.prompt[lang]}</h2>

      {showHint && spec.hint && (
        <div className="mb-4 rounded-2xl bg-yellow-50 border border-yellow-200 p-3 text-center">
          💡 {spec.hint[lang]}
        </div>
      )}

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.key);
          const isMatched = matched.has(card.pairId);
          const showFace = isFlipped || isMatched;
          return (
            <motion.button
              key={card.key}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => pick(card)}
              className="aspect-square rounded-2xl shadow-card border-4 grid place-items-center"
              style={{
                background: isMatched ? '#dcfce7' : 'var(--color-surface-elevated)',
                borderColor: isMatched
                  ? 'var(--color-correct)'
                  : isFlipped
                    ? 'var(--color-brand)'
                    : 'transparent',
                opacity: isMatched ? 0.7 : 1,
                perspective: 800
              }}
              disabled={isMatched}
              aria-label={showFace ? card.label ?? 'carta' : 'carta oculta'}
            >
              <div className="text-4xl md:text-5xl" aria-hidden="true">
                {showFace ? card.glyph : '❓'}
              </div>
              {showFace && card.label && (
                <div className="text-xs font-bold text-inkSoft mt-1">{card.label}</div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
