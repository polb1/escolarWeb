import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Type, Languages } from 'lucide-react';
import i18n from '@/i18n';
import { usePreferencesStore, type FontScale } from '@/stores/preferences';
import { useProfileStore } from '@/stores/profile';

export function SettingsPage() {
  const { t } = useTranslation();
  const prefs = usePreferencesStore();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.update);

  async function setLanguage(lang: 'es' | 'ca') {
    await i18n.changeLanguage(lang);
    if (profile) await updateProfile({ language: lang });
  }

  return (
    <div className="mx-auto max-w-xl px-4 pt-6 pb-24">
      <Link to="/profile" className="text-inkSoft font-bold">
        ← {t('actions.back')}
      </Link>

      <h1 className="mt-4 font-black text-3xl mb-6">{t('settings.title')}</h1>

      <Row icon={<Languages size={22} />} label={t('settings.language')}>
        <SegmentedGroup
          options={[
            { value: 'es', label: '🇪🇸 Castellano' },
            { value: 'ca', label: '🏴 Català' }
          ]}
          value={i18n.language.startsWith('ca') ? 'ca' : 'es'}
          onChange={(v) => setLanguage(v as 'es' | 'ca')}
        />
      </Row>

      <Row
        icon={prefs.soundEnabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
        label={t('settings.sound')}
      >
        <SegmentedGroup
          options={[
            { value: 'on', label: '🔊' },
            { value: 'off', label: '🔇' }
          ]}
          value={prefs.soundEnabled ? 'on' : 'off'}
          onChange={(v) => prefs.setSound(v === 'on')}
        />
      </Row>

      <Row icon={<Type size={22} />} label={t('settings.fontSize')}>
        <SegmentedGroup
          options={[
            { value: 'normal', label: t('settings.fontSizeNormal') },
            { value: 'large', label: t('settings.fontSizeLarge') },
            { value: 'xlarge', label: t('settings.fontSizeXLarge') }
          ]}
          value={prefs.fontScale}
          onChange={(v) => prefs.setFontScale(v as FontScale)}
        />
      </Row>
    </div>
  );
}

function Row({
  icon,
  label,
  children
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-surfaceElevated shadow-card p-5 mb-4 border border-black/5">
      <div className="flex items-center gap-3 mb-3">
        <span aria-hidden="true" className="text-inkSoft">
          {icon}
        </span>
        <span className="font-black">{label}</span>
      </div>
      {children}
    </div>
  );
}

function SegmentedGroup({
  options,
  value,
  onChange
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }} role="radiogroup">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className="rounded-2xl p-3 font-bold border-4 text-center"
            style={{
              borderColor: active ? 'var(--color-brand)' : 'transparent',
              background: active ? 'var(--color-brand)11' : 'transparent',
              color: active ? 'var(--color-brand)' : 'var(--color-ink)'
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
