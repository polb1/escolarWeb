import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Gamepad2, BarChart3, User } from 'lucide-react';

export function AppShell() {
  const { t } = useTranslation();

  const items = [
    { to: '/', label: t('nav.home'), Icon: Home, end: true },
    { to: '/games', label: t('nav.games'), Icon: Gamepad2 },
    { to: '/progress', label: t('nav.progress'), Icon: BarChart3 },
    { to: '/profile', label: t('nav.profile'), Icon: User }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <nav
        aria-label="Principal"
        className="fixed bottom-0 inset-x-0 bg-surfaceElevated border-t border-black/5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
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
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
