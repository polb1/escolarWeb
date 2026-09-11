import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db, type StoredAttempt, type StoredSessionResult } from '@/db/schema';
import { ACHIEVEMENTS } from '@/data/achievements';
import { useProgressStore } from '@/stores/progress';
import { useStreakStore } from '@/stores/streak';
import { Mascot } from '@/ui/mascot/Mascot';

export function AchievementsPage() {
  const { t } = useTranslation();
  const xp = useProgressStore((s) => s.xp);
  const streakDays = useStreakStore((s) => s.current);

  const [attempts, setAttempts] = useState<StoredAttempt[]>([]);
  const [results, setResults] = useState<StoredSessionResult[]>([]);
  useEffect(() => {
    void Promise.all([
      db.attempts.orderBy('at').reverse().limit(1000).toArray(),
      db.sessionResults.toArray()
    ]).then(([a, r]) => {
      setAttempts(a);
      setResults(r);
    });
  }, []);

  const ctx = { attempts, sessionResults: results, streakDays, xp };
  const evaluated = ACHIEVEMENTS.map((a) => ({ achievement: a, unlocked: a.check(ctx) }));
  const unlockedCount = evaluated.filter((x) => x.unlocked).length;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 pb-24">
      <Link to="/" className="text-inkSoft font-bold">
        ← {t('actions.back')}
      </Link>

      <header className="mt-4 flex items-center gap-4">
        <Mascot size={72} mood="cheer" />
        <div>
          <h1 className="font-black text-3xl">{t('achievementsPage.title')}</h1>
          <p className="text-inkSoft">
            {t('achievementsPage.progress', { unlocked: unlockedCount, total: ACHIEVEMENTS.length })}
          </p>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-3">
        {evaluated.map(({ achievement, unlocked }) => (
          <motion.div
            key={achievement.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative rounded-3xl p-4 flex flex-col items-center text-center"
            style={{
              background: unlocked ? 'var(--color-surface-elevated)' : 'rgba(0,0,0,0.03)',
              border: unlocked ? '3px solid #16a34a' : '2px dashed rgba(0,0,0,0.1)',
              boxShadow: unlocked ? '0 4px 20px rgba(22,163,74,0.15)' : 'none',
              filter: unlocked ? 'none' : 'grayscale(0.8)',
              opacity: unlocked ? 1 : 0.65
            }}
            aria-label={`${t(achievement.nameKey)}: ${unlocked ? t('achievementsPage.unlocked') : t('achievementsPage.locked')}`}
          >
            {unlocked && (
              <div
                className="absolute top-2 right-2 rounded-full w-7 h-7 grid place-items-center text-white text-sm font-black"
                style={{ background: '#16a34a' }}
                aria-hidden="true"
              >
                ✓
              </div>
            )}
            <div className="text-5xl mb-2" aria-hidden="true">
              {achievement.icon}
            </div>
            <div className="font-black">{t(achievement.nameKey)}</div>
            <div className="text-xs text-inkSoft mt-1">{t(achievement.descKey)}</div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
