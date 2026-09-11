import { useState } from 'react';
import type { RendererProps } from '../registry';
import type { MathOperationSpec } from '../types';
import { NumericKeypad } from './NumericKeypad';

export function MathOperationRenderer({
  spec,
  onAttempt,
  showHint,
  lang
}: RendererProps<MathOperationSpec>) {
  const [value, setValue] = useState('');
  const [locked, setLocked] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);

  function pushDigit(d: string) {
    if (locked) return;
    // Máx 4 dígitos: los ejercicios nunca llegan a 5 cifras en 2º.
    if (value.length >= 4) return;
    setValue((v) => (v === '' && d === '0' ? '0' : v + d));
  }

  function backspace() {
    if (locked) return;
    setValue((v) => v.slice(0, -1));
  }

  function submit() {
    if (locked || value === '') return;
    const parsed = Number(value);
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
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {showHint && spec.hint && (
        <div className="max-w-xl rounded-2xl bg-yellow-50 border border-yellow-200 p-3 text-center">
          💡 {spec.hint[lang]}
        </div>
      )}

      <div
        className="font-black text-5xl md:text-6xl leading-tight tabular-nums text-center px-8 py-4 rounded-2xl bg-surfaceElevated shadow-card"
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          minWidth: 260,
          animation: wrongShake ? 'shake 0.4s' : undefined
        }}
        aria-live="polite"
      >
        <div className="text-inkSoft">{spec.render}</div>
        <div style={{ borderTop: '4px solid currentColor', margin: '8px 0' }} />
        <div style={{ minHeight: '1em' }}>{value || ' '}</div>
      </div>

      <NumericKeypad
        onKey={pushDigit}
        onBackspace={backspace}
        onSubmit={submit}
        disabled={locked}
      />

      <style>{`@keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }`}</style>
    </div>
  );
}
