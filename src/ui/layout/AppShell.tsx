import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Gamepad2, BarChart3, User } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { usePath } from '@/lib/usePath';

/** En estas rutas escondemos la navegación inferior para dar foco al juego. */
const FULLSCREEN_ROUTES = ['/jugar/', '/play/'];

export function AppShell() {
  const { t } = useTranslation();
  const location = useLocation();
  const p = usePath();
  const fullscreen = FULLSCREEN_ROUTES.some((prefix) => location.pathname.startsWith(prefix));

  const items = [
    { to: '/', label: t('nav.home'), Icon: Home, end: true },
    { to: p('games'), label: t('nav.games'), Icon: Gamepad2 },
    { to: p('progress'), label: t('nav.progress'), Icon: BarChart3 },
    { to: p('profile'), label: t('nav.profile'), Icon: User }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {!fullscreen && <LanguageSwitcher />}
      <main className={`flex-1 ${fullscreen ? '' : 'pb-20'}`}>
        <Outlet />
      </main>
      {!fullscreen && (
        <nav
          aria-label="Principal"
          className="fixed bottom-0 inset-x-0 bg-surfaceElevated border-t border-black/5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <ul className="grid grid-cols-4 mx-auto max-w-2xl">
            {items.map(({ to, label, Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 py-2 text-xs font-bold ${
                      isActive ? 'text-brand' : 'text-inkSoft'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
