import { motion } from 'framer-motion';

interface Props {
  onKey: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9']
] as const;

/**
 * Teclado numérico grande, pensado para dedos de niño en tablet.
 * Filas 1-2-3, 4-5-6, 7-8-9, ⌫-0-✓ — layout de calculadora, no de teléfono,
 * porque coincide con la disposición del teclado escolar.
 */
export function NumericKeypad({ onKey, onBackspace, onSubmit, disabled }: Props) {
  return (
    <div className="w-full max-w-xs mx-auto grid grid-cols-3 gap-3" role="group" aria-label="Teclado numérico">
      {ROWS.map((row) =>
        row.map((digit) => (
          <Key key={digit} label={digit} onClick={() => onKey(digit)} disabled={disabled} />
        ))
      )}
      <Key label="⌫" onClick={onBackspace} disabled={disabled} muted />
      <Key label="0" onClick={() => onKey('0')} disabled={disabled} />
      <Key label="✓" onClick={onSubmit} disabled={disabled} accent />
    </div>
  );
}

function Key({
  label,
  onClick,
  disabled,
  accent,
  muted
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      className="rounded-2xl font-black text-2xl md:text-3xl shadow-card disabled:opacity-40"
      style={{
        minHeight: 64,
        background: accent ? 'var(--color-brand)' : 'var(--color-surface-elevated)',
        color: accent ? '#fff' : muted ? 'var(--color-ink-soft)' : 'var(--color-ink)'
      }}
      aria-label={label === '⌫' ? 'Borrar' : label === '✓' ? 'Enviar' : label}
    >
      {label}
    </motion.button>
  );
}
