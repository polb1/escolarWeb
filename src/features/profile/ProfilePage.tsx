import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Edit3 } from 'lucide-react';
import { useProfileStore } from '@/stores/profile';
import { useProgressStore } from '@/stores/progress';
import { useStreakStore } from '@/stores/streak';
import { db } from '@/db/schema';

const AVATARS = ['🦊', '🐼', '🦄', '🐸', '🦁', '🐧', '🐙', '🦉'];

export function ProfilePage() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.update);
  const resetProfile = useProfileStore((s) => s.reset);
  const streak = useStreakStore();
  const xp = useProgressStore((s) => s.xp);
  const bestStars = useProgressStore((s) => s.bestStarsBySession);
  const totalStars = Object.values(bestStars).reduce<number>((a, b) => a + b, 0);

  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(profile?.nickname ?? '');
  const [avatar, setAvatar] = useState(profile?.avatar ?? AVATARS[0]!);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!profile) return null;

  async function save() {
    await updateProfile({ nickname: nickname.trim(), avatar });
    setEditing(false);
  }

  async function performReset() {
    await db.attempts.clear();
    await db.mastery.clear();
    await db.sessionResults.clear();
    useStreakStore.getState().reset();
    await resetProfile();
  }

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 pb-24">
      <Link to="/" className="text-inkSoft font-bold">
        ← {t('actions.back')}
      </Link>

      <div className="mt-6 rounded-2xl md:rounded-3xl bg-surfaceElevated shadow-card p-4 md:p-6 border border-black/5 flex items-center gap-3 md:gap-5">
        <div className="text-4xl md:text-6xl flex-shrink-0" aria-hidden="true">
          {profile.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-inkSoft text-xs md:text-sm font-bold uppercase tracking-wide">
            {t('profilePage.hi')}
          </div>
          <div className="font-black text-xl md:text-2xl truncate">{profile.nickname}</div>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full p-3 bg-brand text-white flex-shrink-0"
          aria-label={t('profilePage.edit')}
        >
          <Edit3 size={20} aria-hidden="true" />
        </button>
      </div>

      <section className="mt-6 grid grid-cols-3 gap-3">
        <MiniStat icon="⭐" value={xp} label={t('progressPage.xp')} />
        <MiniStat icon="🌟" value={totalStars} label={t('progressPage.stars')} />
        <MiniStat icon="🔥" value={streak.current} label={t('progressPage.streak')} />
      </section>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          to="/settings"
          className="rounded-2xl bg-surfaceElevated shadow-card p-4 border border-black/5 flex items-center gap-3 font-bold"
        >
          <Settings size={22} aria-hidden="true" />
          {t('settings.title')}
        </Link>
        <button
          type="button"
          onClick={() => setConfirmReset(true)}
          className="rounded-2xl p-4 border-2 border-dashed border-red-300 text-red-600 font-bold"
        >
          🗑️ {t('profilePage.reset')}
        </button>
      </div>

      <AnimatePresence>
        {editing && (
          <Modal onClose={() => setEditing(false)}>
            <h2 className="font-black text-xl mb-3">{t('profilePage.editTitle')}</h2>
            <label htmlFor="edit-nick" className="text-sm font-bold text-inkSoft">
              {t('profile.askName')}
            </label>
            <input
              id="edit-nick"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="w-full mt-1 mb-4 text-xl rounded-2xl border-2 border-black/10 focus:border-brand px-4 py-3 outline-none"
            />
            <p className="text-sm font-bold text-inkSoft mb-2">{t('profile.askAvatar')}</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {AVATARS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setAvatar(e)}
                  aria-pressed={avatar === e}
                  className="rounded-2xl border-4 text-3xl p-2 bg-white transition-transform"
                  style={{
                    borderColor: avatar === e ? 'var(--color-brand)' : 'transparent'
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-2xl px-5 py-3 font-bold text-ink"
              >
                {t('actions.close')}
              </button>
              <button
                type="button"
                onClick={save}
                className="flex-1 rounded-2xl px-5 py-3 font-black text-white bg-brand"
              >
                {t('actions.continue')}
              </button>
            </div>
          </Modal>
        )}

        {confirmReset && (
          <Modal onClose={() => setConfirmReset(false)}>
            <h2 className="font-black text-xl mb-3">{t('profilePage.resetTitle')}</h2>
            <p className="text-inkSoft mb-6">{t('profilePage.resetWarn')}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded-2xl px-5 py-3 font-bold text-ink"
              >
                {t('actions.close')}
              </button>
              <button
                type="button"
                onClick={performReset}
                className="flex-1 rounded-2xl px-5 py-3 font-black text-white bg-red-500"
              >
                {t('profilePage.resetConfirm')}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniStat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-surfaceElevated shadow-card p-3 text-center border border-black/5">
      <div className="text-2xl" aria-hidden="true">
        {icon}
      </div>
      <div className="font-black tabular-nums mt-1">{value}</div>
      <div className="text-[10px] font-bold text-inkSoft uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 grid place-items-center px-4 z-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-surfaceElevated shadow-cardHover p-6 border border-black/5"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
