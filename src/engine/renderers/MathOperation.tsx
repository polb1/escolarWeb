import { useState, useRef, useEffect } from 'react';
import type { RendererProps } from '../registry';
import type { MathOperationSpec } from '../types';

export function MathOperationRenderer({
  spec,
  onAttempt,
  showHint,
  lang
}: RendererProps<MathOperationSpec>) {
  const [value, setValue] = useState('');
  const [locked, setLocked] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [spec.id]);

  function submit() {
    if (locked) return;
    const parsed = Number(value.replace(',', '.').trim());
    if (!Number.isFinite(parsed)) return;
    const correct = parsed === spec.answer;
    if (correct) {
      setLocked(true);
      onAttempt({ correct: true, feedbackKey: 'feedback.correct' });
      return;
    }
    const close = Math.abs(parsed - spec.answer) <= 2;
    setWrongShake(true);
    setTimeout(() => setWrongShake(false), 400);
    onAttempt({
      correct: false,
      feedbackKey: close ? 'feedback.close' : 'feedback.retry',
      showExplanation: true
    });
    setValue('');
    inputRef.current?.focus();
  }

  const [top, bottom] = spec.columns ?? [spec.render, ''];

  return (
    <div className="w-full flex flex-col items-center">
      {showHint && spec.hint && (
        <div className="mb-6 max-w-xl rounded-2xl bg-yellow-50 border border-yellow-200 p-3 text-center">
          💡 {spec.hint[lang]}
        </div>
      )}

      <div
        className="font-black text-6xl md:text-7xl leading-tight tabular-nums text-right px-6 py-4 rounded-2xl bg-surfaceElevated shadow-card"
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          minWidth: 220,
          transform: wrongShake ? 'translateX(0)' : undefined,
          animation: wrongShake ? 'shake 0.4s' : undefined
        }}
        aria-hidden="true"
      >
        <div>{top}</div>
        {bottom && <div>{bottom}</div>}
        <div style={{ borderTop: '4px solid currentColor', margin: '8px 0 4px' }} />
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={locked}
          aria-label={spec.render}
          className="w-full text-right bg-transparent outline-none font-black tabular-nums"
          style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
        />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={locked || value.trim() === ''}
        className="mt-6 rounded-2xl px-8 py-3 font-black text-white bg-brand disabled:opacity-40"
      >
        ✓
      </button>

      <style>{`@keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }`}</style>
    </div>
  );
}
