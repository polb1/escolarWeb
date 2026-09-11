import { motion } from 'framer-motion';

type Mood = 'happy' | 'thinking' | 'cheer';

interface Props {
  mood?: Mood;
  /** Ancho/alto en px. Se puede omitir si el contenedor padre define el tamaño. */
  size?: number | '100%';
  ariaLabel?: string;
}

/**
 * "Lumi" — pequeña criatura amistosa inspirada en una gota de luz.
 * Diseño propio, sin dependencias externas. Un solo SVG con expresiones.
 */
export function Mascot({ mood = 'happy', size = 96, ariaLabel = 'Lumi' }: Props) {
  const eyeCurve = mood === 'thinking' ? 'M-4,0 Q0,-4 4,0' : 'M-4,0 Q0,3 4,0';
  const mouth =
    mood === 'cheer' ? 'M-10,4 Q0,16 10,4' : mood === 'thinking' ? 'M-6,4 L6,4' : 'M-8,2 Q0,10 8,2';

  return (
    <motion.svg
      role="img"
      aria-label={ariaLabel}
      width={size === '100%' ? '100%' : size}
      height={size === '100%' ? '100%' : size}
      style={{ maxWidth: '100%', maxHeight: '100%' }}
      viewBox="-60 -60 120 120"
      initial={{ scale: 0.95 }}
      animate={{ scale: [0.98, 1.02, 0.98] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <radialGradient id="lumiBody" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.6" stopColor="#facc15" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
        <radialGradient id="lumiGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r="56" fill="url(#lumiGlow)" />

      {/* Cuerpo (gota redondeada) */}
      <path
        d="M0,-42 C28,-42 42,-20 42,4 C42,28 22,44 0,44 C-22,44 -42,28 -42,4 C-42,-20 -28,-42 0,-42 Z"
        fill="url(#lumiBody)"
        stroke="#f59e0b"
        strokeWidth="2"
      />

      {/* Mejillas */}
      <circle cx="-22" cy="8" r="6" fill="#fbcfe8" opacity="0.7" />
      <circle cx="22" cy="8" r="6" fill="#fbcfe8" opacity="0.7" />

      {/* Ojos */}
      <g transform="translate(-14 -6)">
        <path d={eyeCurve} stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(14 -6)">
        <path d={eyeCurve} stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* Boca */}
      <path d={mouth} stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Chispas */}
      <g fill="#ffffff">
        <circle cx="-30" cy="-24" r="3" />
        <circle cx="26" cy="-30" r="2" />
        <circle cx="34" cy="20" r="2" />
      </g>
    </motion.svg>
  );
}
