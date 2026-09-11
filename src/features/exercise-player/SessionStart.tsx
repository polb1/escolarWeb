import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SESSIONS } from './sessions';
import { Mascot } from '@/ui/mascot/Mascot';
import type { Difficulty } from '@/engine/types';
import { getCurriculumFor } from '@/data/curriculum';
import { usePath } from '@/lib/usePath';

interface DifficultyChoice {
  d: Difficulty;
  labelKey: string;
  descKey: string;
  emoji: string;
  color: string;
}

/**
 * Selector de dificultad antes de empezar una sesión con niveles.
 * Solo se ofrecen 3 niveles al niño (1, 2, 3). Los niveles 4-5 se reservan
 * para la adaptatividad interna cuando el niño demuestra dominio.
 */
const SOURCE_LABELS: Record<string, string> = {
  'RD-157-2022': 'Real Decreto 157/2022, ANEXO II — Educación Primaria (España)',
  'Decret-175-2022': 'Decret 175/2022, Annex 2 — Educació Primària (Catalunya)'
};

function CurriculumFootnote({ sessionId }: { sessionId: string }) {
  const tags = getCurriculumFor(sessionId);
  if (tags.length === 0) return null;

  const grouped = tags.reduce<Record<string, typeof tags>>((acc, tag) => {
    (acc[tag.source] ??= []).push(tag);
    return acc;
  }, {});

  return (
    // `key` fuerza un remount por sesión: al cambiar de sesión (o volver aquí
    // tras jugar) el <details> nace cerrado en vez de recordar el estado
    // que tuviera antes en el mismo nodo.
    <details key={sessionId} className="mt-6 rounded-2xl bg-black/5 p-3 text-sm text-inkSoft">
      <summary className="cursor-pointer font-bold">📘 Currículo oficial</summary>
      <div className="mt-3 space-y-4">
        {Object.entries(grouped).map(([source, srcTags]) => (
          <div key={source}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1">
              {SOURCE_LABELS[source] ?? source}
            </p>
            <ul className="space-y-2">
              {srcTags.map((tag) => (
                <li key={tag.code}>
                  <span className="font-mono text-xs bg-white rounded px-1 py-0.5 mr-2">
                    {tag.code}
                  </span>
                  {tag.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

const CHOICES: DifficultyChoice[] = [
  { d: 1, labelKey: 'difficulty.easy', descKey: 'difficulty.easyDesc', emoji: '🌱', color: '#22c55e' },
  { d: 2, labelKey: 'difficulty.medium', descKey: 'difficulty.mediumDesc', emoji: '⭐', color: '#3b82f6' },
  { d: 3, labelKey: 'difficulty.hard', descKey: 'difficulty.hardDesc', emoji: '🔥', color: '#f97316' }
];

export function SessionStart() {
  const { sessionId = '' } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = usePath();
  const session = SESSIONS[sessionId];

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p>404</p>
        <Link to="/" className="text-brand underline">
          {t('actions.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-24">
      <button type="button" onClick={() => navigate(-1)} className="text-inkSoft font-bold">
        ← {t('actions.back')}
      </button>

      <div className="mt-6 flex items-center gap-3 md:gap-4">
        <div className="flex-shrink-0 w-14 h-14 md:w-[72px] md:h-[72px]">
          <Mascot size="100%" mood="happy" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-black text-xl md:text-3xl leading-tight break-words">{t(session.titleKey)}</h1>
          <p className="text-inkSoft text-sm md:text-base mt-1">{t('difficulty.prompt')}</p>
        </div>
      </div>

      <CurriculumFootnote sessionId={sessionId} />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {CHOICES.map((c) => (
          <motion.button
            key={c.d}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`${path('play', sessionId)}?d=${c.d}`)}
            className="rounded-2xl md:rounded-3xl bg-surfaceElevated shadow-card p-4 md:p-6 text-left border-4 focus-visible:outline-none"
            style={{ borderColor: c.color }}
          >
            <div className="text-4xl md:text-5xl mb-2 md:mb-3" aria-hidden="true">
              {c.emoji}
            </div>
            <div className="font-black text-lg md:text-xl" style={{ color: c.color }}>
              {t(c.labelKey)}
            </div>
            <div className="text-inkSoft mt-1 text-xs md:text-sm">{t(c.descKey)}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
