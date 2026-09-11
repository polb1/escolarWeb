import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SUBJECTS } from '@/data/subjects';
import { SubjectCard } from '@/features/subjects/SubjectCard';
import { Mascot } from '@/ui/mascot/Mascot';
import { useProfileStore } from '@/stores/profile';
import { useStreakStore } from '@/stores/streak';
import { db } from '@/db/schema';
import { SESSIONS } from '@/features/exercise-player/sessions';

function greetingKey(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return 'greeting.morning';
  if (h < 20) return 'greeting.afternoon';
  return 'greeting.evening';
}

/**
 * "Misión del día" es determinista: derivada de la fecha, para que el niño
 * vea siempre lo mismo hoy y no dependa de cuándo abra la app.
 */
function pickTodaysMission(): string {
  const availableSessions = Object.keys(SESSIONS).filter(
    (id) => !id.startsWith('games.') // los juegos no cuentan como misión "educativa"
  );
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = seed % availableSessions.length;
  return availableSessions[idx]!;
}

export function HomePage() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  const streak = useStreakStore((s) => s.current);
  const name = profile?.nickname ?? t('greeting.anonymous');

  const mission = pickTodaysMission();
  const missionSession = SESSIONS[mission];

  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  useEffect(() => {
    void db.sessionResults
      .orderBy('at')
      .reverse()
      .first()
      .then((r) => setLastSessionId(r?.sessionId ?? null));
  }, []);

  const lastSession = lastSessionId ? SESSIONS[lastSessionId] : null;

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-24">
      <header className="flex items-center gap-3 md:gap-4 mb-6">
        <div className="flex-shrink-0 w-14 h-14 md:w-20 md:h-20">
          <Mascot size="100%" mood="happy" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-xl md:text-3xl leading-tight break-words">
            {t(greetingKey(), { name })}
          </h1>
          <p className="text-inkSoft text-sm md:text-base mt-1">{t('home.prompt')}</p>
        </div>
        {streak > 0 && (
          <div
            className="rounded-2xl px-2 md:px-3 py-2 shadow-card bg-surfaceElevated border border-black/5 flex items-center gap-1 font-black text-sm md:text-base flex-shrink-0"
            aria-label={`Racha ${streak}`}
          >
            <span aria-hidden="true">🔥</span>
            <span className="tabular-nums">{streak}</span>
          </div>
        )}
      </header>

      {missionSession && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          aria-labelledby="today-mission"
          className="rounded-2xl bg-surfaceElevated shadow-card p-4 md:p-5 mb-4 border border-black/5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold uppercase tracking-wide text-inkSoft">
                🎯 <span id="today-mission">{t('home.todayMission')}</span>
              </div>
              <div className="text-base md:text-lg font-black mt-1 truncate">{t(missionSession.titleKey)}</div>
            </div>
            <Link
              to={missionSession.hasDifficultyLevels ? `/start/${mission}` : `/play/${mission}`}
              className="rounded-2xl px-4 py-2.5 md:py-3 font-black text-white bg-brand whitespace-nowrap flex-shrink-0"
            >
              {t('home.play')}
            </Link>
          </div>
        </motion.section>
      )}

      {lastSession && lastSession.id !== missionSession?.id && (
        <section aria-labelledby="continue" className="mb-6">
          <Link
            to={lastSession.hasDifficultyLevels ? `/start/${lastSession.id}` : `/play/${lastSession.id}`}
            className="block rounded-2xl bg-surfaceElevated shadow-card p-4 border-l-8 border-brand"
          >
            <div className="text-xs font-bold uppercase tracking-wide text-inkSoft">
              <span id="continue">↩️ {t('home.continue')}</span>
            </div>
            <div className="font-black mt-1">{t(lastSession.titleKey)}</div>
          </Link>
        </section>
      )}

      <section aria-label={t('home.prompt')} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUBJECTS.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </section>

      <nav aria-label="Secciones" className="mt-8 grid grid-cols-3 gap-3">
        <FooterLink to="/progress" icon="⭐" label={t('home.seeProgress')} />
        <FooterLink to="/achievements" icon="🏆" label={t('home.seeAchievements')} />
        <FooterLink to="/games" icon="🎮" label={t('home.playGames')} />
      </nav>
    </div>
  );
}

function FooterLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-2xl bg-surfaceElevated shadow-card p-4 flex items-center justify-center gap-2 font-bold text-ink hover:shadow-cardHover transition-shadow"
    >
      <span aria-hidden="true" className="text-2xl">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
