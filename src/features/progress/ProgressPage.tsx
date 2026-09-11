import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db, type StoredAttempt } from '@/db/schema';
import { useProgressStore } from '@/stores/progress';
import { useStreakStore } from '@/stores/streak';
import { SUBJECTS } from '@/data/subjects';
import { Mascot } from '@/ui/mascot/Mascot';

/**
 * Panel de progreso adaptado a niño: pocas cifras grandes,
 * gráfica semanal como estrellas por día, y dominio por asignatura.
 */
export function ProgressPage() {
  const { t } = useTranslation();
  const xp = useProgressStore((s) => s.xp);
  const bestStars = useProgressStore((s) => s.bestStarsBySession);
  const streak = useStreakStore();

  const [attempts, setAttempts] = useState<StoredAttempt[]>([]);
  useEffect(() => {
    void db.attempts.orderBy('at').reverse().limit(500).toArray().then(setAttempts);
  }, []);

  // Estrellas conseguidas por día en los últimos 7 días.
  const weekly = buildWeeklyStars(attempts);

  // Dominio aproximado por asignatura = % aciertos de los últimos 30 días.
  const bySubject = SUBJECTS.map((subject) => {
    const relevant = attempts.filter((a) => a.subjectId === subject.id);
    const total = relevant.length;
    const correct = relevant.filter((a) => a.correct).length;
    const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { subject, total, percent };
  }).filter((x) => x.total > 0);

  const totalStars = Object.values(bestStars).reduce<number>((acc, s) => acc + s, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 pb-24">
      <Link to="/" className="text-inkSoft font-bold">
        ← {t('actions.back')}
      </Link>

      <header className="mt-4 flex items-center gap-4">
        <Mascot size={72} mood="cheer" />
        <div>
          <h1 className="font-black text-3xl">{t('progressPage.title')}</h1>
          <p className="text-inkSoft">{t('progressPage.subtitle')}</p>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-3 gap-3" aria-label={t('progressPage.summary')}>
        <StatCard icon="⭐" value={xp} label={t('progressPage.xp')} />
        <StatCard icon="🌟" value={totalStars} label={t('progressPage.stars')} />
        <StatCard icon="🔥" value={streak.current} label={t('progressPage.streak')} />
      </section>

      <section className="mt-8">
        <h2 className="font-black text-xl mb-3">{t('progressPage.thisWeek')}</h2>
        <div className="rounded-3xl bg-surfaceElevated shadow-card p-5 border border-black/5">
          <div className="grid grid-cols-7 gap-2 text-center">
            {weekly.map((day) => (
              <div key={day.iso} className="flex flex-col items-center gap-1">
                <div className="text-xs text-inkSoft font-bold uppercase">{day.short}</div>
                <div className="text-lg" aria-label={`${day.stars} estrellas`}>
                  {day.stars > 0 ? '⭐'.repeat(Math.min(day.stars, 5)) : '·'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-black text-xl mb-3">{t('progressPage.bySubject')}</h2>
        {bySubject.length === 0 ? (
          <div className="rounded-3xl bg-surfaceElevated shadow-card p-6 text-center text-inkSoft border border-black/5">
            {t('progressPage.emptyPrompt')}
          </div>
        ) : (
          <div className="space-y-3">
            {bySubject.map((row) => (
              <div
                key={row.subject.id}
                className="rounded-2xl bg-surfaceElevated shadow-card p-4 border-l-8"
                style={{ borderLeftColor: row.subject.colorVar }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-black text-lg flex items-center gap-2">
                    <span aria-hidden="true">{row.subject.icon}</span>
                    {t(row.subject.nameKey)}
                  </div>
                  <div className="tabular-nums font-black" style={{ color: row.subject.colorVar }}>
                    {row.percent}%
                  </div>
                </div>
                <div className="h-3 rounded-full overflow-hidden bg-black/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.percent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: row.subject.colorVar }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="rounded-3xl bg-surfaceElevated shadow-card p-4 text-center border border-black/5">
      <div className="text-3xl" aria-hidden="true">
        {icon}
      </div>
      <div className="font-black text-2xl tabular-nums mt-1">{value}</div>
      <div className="text-xs font-bold text-inkSoft uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function buildWeeklyStars(attempts: StoredAttempt[]) {
  const now = new Date();
  const days: { iso: string; short: string; stars: number }[] = [];
  const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    const stars = attempts.filter(
      (a) => a.correct && new Date(a.at).toISOString().slice(0, 10) === iso
    ).length;
    days.push({ iso, short: dayNames[d.getDay()] ?? '?', stars });
  }
  return days;
}
