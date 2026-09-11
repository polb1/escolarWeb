import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { SESSIONS } from './sessions';
import { Mascot } from '@/ui/mascot/Mascot';
import type { Difficulty } from '@/engine/types';
import { getCurriculumFor } from '@/data/curriculum';

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
function CurriculumFootnote({ sessionId }: { sessionId: string }) {
  const tags = getCurriculumFor(sessionId);
  if (tags.length === 0) return null;
  return (
    <details className="mt-6 rounded-2xl bg-black/5 p-3 text-sm text-inkSoft">
      <summary className="cursor-pointer font-bold">📘 Currículo oficial</summary>
      <ul className="mt-2 space-y-2">
        {tags.map((tag) => (
          <li key={tag.code}>
            <span className="font-mono text-xs bg-white rounded px-1 py-0.5 mr-2">{tag.code}</span>
            {tag.text}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs opacity-75">
        Referencia: Real Decreto 157/2022, ANEXO II, Educación Primaria, Primer Ciclo.
      </p>
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

      <div className="mt-6 flex items-center gap-4">
        <Mascot size={72} mood="happy" />
        <div>
          <h1 className="font-black text-2xl md:text-3xl">{t(session.titleKey)}</h1>
          <p className="text-inkSoft mt-1">{t('difficulty.prompt')}</p>
        </div>
      </div>

      <CurriculumFootnote sessionId={sessionId} />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CHOICES.map((c) => (
          <motion.button
            key={c.d}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/play/${sessionId}?d=${c.d}`)}
            className="rounded-3xl bg-surfaceElevated shadow-card p-6 text-left border-4 focus-visible:outline-none"
            style={{ borderColor: c.color }}
          >
            <div className="text-5xl mb-3" aria-hidden="true">
              {c.emoji}
            </div>
            <div className="font-black text-xl" style={{ color: c.color }}>
              {t(c.labelKey)}
            </div>
            <div className="text-inkSoft mt-1 text-sm">{t(c.descKey)}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
