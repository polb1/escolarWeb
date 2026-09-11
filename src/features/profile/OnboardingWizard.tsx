import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot } from '@/ui/mascot/Mascot';
import { useProfileStore } from '@/stores/profile';
import type { AppLanguage } from '@/i18n';
import i18n from '@/i18n';

const AVATARS = ['🦊', '🐼', '🦄', '🐸', '🦁', '🐧', '🐙', '🦉'];

export function OnboardingWizard() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]!);
  const [language, setLanguage] = useState<AppLanguage>((i18n.language as AppLanguage) || 'es');
  const createProfile = useProfileStore((s) => s.create);

  const canAdvance = step === 0 ? nickname.trim().length > 0 : true;

  async function finish() {
    await i18n.changeLanguage(language);
    await createProfile({ nickname: nickname.trim(), avatar, language });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl bg-surfaceElevated shadow-card p-5 md:p-8 border border-black/5">
        <div className="flex items-center gap-3 md:gap-4 mb-6">
          <div className="flex-shrink-0 w-14 h-14 md:w-[72px] md:h-[72px]">
            <Mascot size="100%" mood={step === 2 ? 'cheer' : 'happy'} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-black text-xl md:text-2xl leading-tight">{t('profile.welcomeTitle')}</h1>
            <p className="text-inkSoft text-xs md:text-sm mt-1">{t('profile.welcomeSubtitle')}</p>
          </div>
        </div>

        <StepDots current={step} total={3} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="mt-6 min-h-[180px]"
          >
            {step === 0 && (
              <div>
                <label className="block font-bold text-lg mb-3" htmlFor="nickname">
                  {t('profile.askName')}
                </label>
                <input
                  id="nickname"
                  type="text"
                  autoFocus
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('profile.namePlaceholder')}
                  maxLength={20}
                  className="w-full text-xl rounded-2xl border-2 border-black/10 focus:border-brand px-4 py-3 outline-none"
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="font-bold text-lg mb-3">{t('profile.askAvatar')}</p>
                <div className="grid grid-cols-4 gap-3">
                  {AVATARS.map((emoji) => {
                    const selected = emoji === avatar;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setAvatar(emoji)}
                        aria-pressed={selected}
                        className="rounded-2xl border-4 text-4xl p-2 bg-white transition-transform"
                        style={{
                          borderColor: selected ? 'var(--color-brand)' : 'transparent',
                          transform: selected ? 'scale(1.05)' : 'scale(1)'
                        }}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="font-bold text-lg mb-3">{t('profile.askLanguage')}</p>
                <div className="grid grid-cols-2 gap-3">
                  <LangButton
                    label="Castellano"
                    flag="🇪🇸"
                    active={language === 'es'}
                    onClick={() => setLanguage('es')}
                  />
                  <LangButton
                    label="Català"
                    flag="🏴󠁥󠁳󠁣󠁴󠁿"
                    active={language === 'ca'}
                    onClick={() => setLanguage('ca')}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-2xl px-5 py-3 font-bold text-ink disabled:opacity-30"
          >
            {t('profile.back')}
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => canAdvance && setStep((s) => s + 1)}
              disabled={!canAdvance}
              className="rounded-2xl px-6 py-3 font-black text-white bg-brand disabled:opacity-40"
              style={{ minWidth: 140 }}
            >
              {t('profile.next')}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="rounded-2xl px-6 py-3 font-black text-white bg-brand"
              style={{ minWidth: 140 }}
            >
              {t('profile.start')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex justify-center gap-2" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-2 rounded-full transition-all"
          style={{
            width: i === current ? 28 : 10,
            background: i <= current ? 'var(--color-brand)' : 'rgba(0,0,0,0.1)'
          }}
        />
      ))}
    </div>
  );
}

function LangButton({
  label,
  flag,
  active,
  onClick
}: {
  label: string;
  flag: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-2xl border-4 p-4 bg-white flex items-center justify-center gap-2 text-lg font-bold"
      style={{ borderColor: active ? 'var(--color-brand)' : 'transparent' }}
    >
      <span aria-hidden="true" className="text-2xl">
        {flag}
      </span>
      {label}
    </button>
  );
}
