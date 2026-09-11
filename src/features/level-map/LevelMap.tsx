import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { SESSIONS } from '@/features/exercise-player/sessions';
import { useProgressStore } from '@/stores/progress';
import { usePath } from '@/lib/usePath';

export interface LevelNode {
  sessionId: string;
  titleKey: string;
  icon: string;
  color: string;
}

interface Props {
  nodes: LevelNode[];
  subjectColor: string;
}

/**
 * Mapa de niveles: camino curvo en SVG con nodos posicionados a lo largo.
 * Cada nodo representa una sesión. Un nodo se desbloquea cuando el anterior
 * tiene ≥1 estrella. El primero está siempre disponible.
 */
export function LevelMap({ nodes, subjectColor }: Props) {
  const { t } = useTranslation();
  const path = usePath();
  const bestStars = useProgressStore((s) => s.bestStarsBySession);

  const layout = useMemo(() => buildLayout(nodes.length), [nodes.length]);

  // Un nodo está desbloqueado si es el primero o si el anterior tiene ≥1 estrella.
  const unlocked = useMemo(() => {
    return nodes.map((_, i) => {
      if (i === 0) return true;
      const prevId = nodes[i - 1]!.sessionId;
      return (bestStars[prevId] ?? 0) >= 1;
    });
  }, [nodes, bestStars]);

  const viewBoxHeight = layout.height;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        viewBox={`0 0 100 ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMin meet"
        className="w-full"
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        {/* Camino de fondo — dos capas: sombra clara + puntitos coloreados */}
        <path
          d={layout.pathD}
          fill="none"
          stroke={subjectColor}
          strokeOpacity="0.15"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d={layout.pathD}
          fill="none"
          stroke={subjectColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.1 2.5"
        />
      </svg>

      {/* Nodos en HTML (sobre el SVG) — más fáciles de hacer accesibles que en SVG */}
      <div
        className="absolute inset-0"
        style={{
          // La misma proporción que el viewBox: viewport = 100 x viewBoxHeight
          aspectRatio: `100 / ${viewBoxHeight}`
        }}
      >
        {nodes.map((node, i) => {
          const point = layout.points[i]!;
          const stars = bestStars[node.sessionId] ?? 0;
          const isOpen = unlocked[i];
          const session = SESSIONS[node.sessionId];
          const to = session?.hasDifficultyLevels
            ? path('start', node.sessionId)
            : path('play', node.sessionId);

          return (
            <div
              key={node.sessionId}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${point.x}%`, top: `${(point.y / viewBoxHeight) * 100}%` }}
            >
              <NodeButton
                to={to}
                label={t(node.titleKey)}
                icon={node.icon}
                color={node.color}
                stars={stars}
                locked={!isOpen}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NodeButton({
  to,
  label,
  icon,
  color,
  stars,
  locked
}: {
  to: string;
  label: string;
  icon: string;
  color: string;
  stars: 0 | 1 | 2 | 3;
  locked: boolean;
}) {
  const content = (
    <div
      className="grid place-items-center rounded-full shadow-cardHover"
      style={{
        width: 80,
        height: 80,
        background: locked ? '#e5e7eb' : 'var(--color-surface-elevated)',
        border: `4px solid ${locked ? '#cbd5e1' : color}`,
        filter: locked ? 'grayscale(0.7)' : 'none'
      }}
    >
      {locked ? <Lock size={26} className="text-slate-400" aria-hidden="true" /> : (
        <span className="text-4xl" aria-hidden="true">
          {icon}
        </span>
      )}
    </div>
  );

  const stripe = (
    <div className="flex flex-col items-center gap-1 mt-1">
      <div className="text-xs font-black text-ink text-center max-w-[110px]">{label}</div>
      {!locked && <StarRow stars={stars} />}
    </div>
  );

  if (locked) {
    return (
      <div className="flex flex-col items-center" aria-label={`${label} bloqueado`}>
        {content}
        {stripe}
      </div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} className="flex flex-col items-center">
      <Link to={to} aria-label={label} className="focus-visible:outline-none">
        {content}
      </Link>
      {stripe}
    </motion.div>
  );
}

function StarRow({ stars }: { stars: 0 | 1 | 2 | 3 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${stars} de 3 estrellas`}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ opacity: i < stars ? 1 : 0.25, fontSize: 12 }} aria-hidden="true">
          ⭐
        </span>
      ))}
    </div>
  );
}

/**
 * Coloca N nodos en zig-zag a lo largo de una S-curve.
 * Sistema de coordenadas: 0-100 horizontal, height crece según N.
 */
function buildLayout(n: number): { points: { x: number; y: number }[]; pathD: string; height: number } {
  const spacing = 55; // distancia vertical entre nodos (en unidades del viewBox)
  const marginTop = 35;
  const marginBottom = 40;
  const height = marginTop + spacing * (n - 1) + marginBottom;

  const points = Array.from({ length: n }, (_, i) => ({
    // Alterna 30% ← 70% para dar sensación de camino serpenteante.
    x: i % 2 === 0 ? 30 : 70,
    y: marginTop + i * spacing
  }));

  // Path S-curve entre puntos usando curvas cúbicas.
  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1]!;
    const p1 = points[i]!;
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }

  return { points, pathD: d, height };
}
