import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from '@/i18n';
import { translatePath } from '@/lib/routes';
import { useProfileStore } from '@/stores/profile';
import type { AppLanguage } from '@/i18n';

/**
 * Selector de idioma flotante, esquina superior derecha. Al pulsar cambia
 * i18n Y traduce la ruta actual — para que un enlace en catalán acabe en
 * su equivalente castellano (o al revés) en lugar de romperse.
 * También persiste la elección en el perfil, si existe.
 */
export function LanguageSwitcher() {
  const { i18n: i18nHook } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.update);

  const current: AppLanguage = i18nHook.language.startsWith('ca') ? 'ca' : 'es';

  async function switchTo(next: AppLanguage) {
    if (next === current) return;
    await i18n.changeLanguage(next);
    if (profile) await updateProfile({ language: next });
    const translated = translatePath(location.pathname, current, next);
    if (translated !== location.pathname) {
      navigate(translated + location.search, { replace: true });
    }
  }

  return (
    <div
      className="fixed top-3 right-3 md:top-4 md:right-4 z-30 flex gap-1 rounded-full bg-surfaceElevated shadow-card border border-black/5 p-1"
      role="group"
      aria-label="Idioma"
    >
      <LangButton label="ES" active={current === 'es'} onClick={() => void switchTo('es')} />
      <LangButton label="CA" active={current === 'ca'} onClick={() => void switchTo('ca')} />
    </div>
  );
}

function LangButton({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full font-black text-xs px-2.5 py-1 transition-colors"
      style={{
        background: active ? 'var(--color-brand)' : 'transparent',
        color: active ? '#fff' : 'var(--color-ink-soft)',
        minHeight: 28
      }}
    >
      {label}
    </button>
  );
}
