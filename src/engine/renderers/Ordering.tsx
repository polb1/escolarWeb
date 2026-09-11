import { useMemo, useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import type { RendererProps } from '../registry';
import type { OrderingSpec } from '../types';
import { rngFromSeed, hashSeed } from '@/lib/prng';

interface Item {
  key: string;
  label: string;
  sortValue: number;
}

/**
 * Renderer de "ordenar". Framer Motion Reorder soporta drag en touch y ratón.
 * El niño arrastra las fichas; al pulsar ✓ verifica.
 */
export function OrderingRenderer({ spec, onAttempt, showHint, lang }: RendererProps<OrderingSpec>) {
  const initial = useMemo<Item[]>(() => {
    const rng = rngFromSeed(hashSeed(spec.id, 'shuffle'));
    // Nos aseguramos de que la mezcla no coincida con la solución.
    let shuffled = rng.shuffle(spec.items);
    if (isSorted(shuffled, spec.direction)) {
      shuffled = [...shuffled].reverse();
    }
    return shuffled;
  }, [spec]);

  const [order, setOrder] = useState<Item[]>(initial);
  const [locked, setLocked] = useState(false);

  function check() {
    if (locked) return;
    const correct = isSorted(order, spec.direction);
    if (correct) {
      setLocked(true);
      onAttempt({ correct: true, feedbackKey: 'feedback.correct' });
    } else {
      onAttempt({ correct: false, feedbackKey: 'feedback.retry' });
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="font-black text-xl md:text-2xl text-center mb-6">{spec.prompt[lang]}</h2>

      {showHint && spec.hint && (
        <div className="mb-4 rounded-2xl bg-yellow-50 border border-yellow-200 p-3 text-center">
          💡 {spec.hint[lang]}
        </div>
      )}

      <Reorder.Group axis="y" values={order} onReorder={setOrder} className="space-y-3">
        {order.map((item) => (
          <Reorder.Item
            key={item.key}
            value={item}
            className="rounded-2xl bg-surfaceElevated shadow-card px-5 py-4 flex items-center gap-3 border-4 cursor-grab active:cursor-grabbing"
            style={{ borderColor: locked ? 'var(--color-correct)' : 'transparent' }}
            whileDrag={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
          >
            <span aria-hidden="true" className="text-2xl text-inkSoft">
              ≡
            </span>
            <span className="font-black text-2xl tabular-nums">{item.label}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={check}
        disabled={locked}
        className="mt-6 w-full rounded-2xl px-6 py-3 font-black text-white bg-brand disabled:opacity-40"
      >
        ✓
      </motion.button>
    </div>
  );
}

function isSorted(items: readonly Item[], direction: 'asc' | 'desc'): boolean {
  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1]!.sortValue;
    const curr = items[i]!.sortValue;
    if (direction === 'asc' && prev > curr) return false;
    if (direction === 'desc' && prev < curr) return false;
  }
  return true;
}
