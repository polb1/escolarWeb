import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { AppShell } from '@/ui/layout/AppShell';
import { HomePage } from '@/features/home/HomePage';
import { SubjectView } from '@/features/subjects/SubjectView';
import { ExercisePlayer } from '@/features/exercise-player/ExercisePlayer';
import { SessionStart } from '@/features/exercise-player/SessionStart';
import { ProgressPage } from '@/features/progress/ProgressPage';
import { AchievementsPage } from '@/features/achievements/AchievementsPage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { GamesPage } from '@/features/games/GamesPage';
import { allPatternsFor, type RouteName } from '@/lib/routes';

/**
 * Registra una ruta bajo todas sus variantes de idioma (deduplicadas),
 * de modo que `/asignatura/math` y `/assignatura/math` sirvan el mismo
 * componente. Los IDs internos (math, math.addition, ...) se mantienen
 * como segmentos programáticos y no se traducen.
 */
function localized(name: RouteName, tail: string, element: JSX.Element): RouteObject[] {
  return allPatternsFor(name).map((seg) => ({ path: `${seg}${tail}`, element }));
}

const children: RouteObject[] = [
  { index: true, element: <HomePage /> },
  ...localized('subject', '/:id', <SubjectView />),
  ...localized('start', '/:sessionId', <SessionStart />),
  ...localized('play', '/:sessionId', <ExercisePlayer />),
  ...localized('games', '', <GamesPage />),
  ...localized('progress', '', <ProgressPage />),
  ...localized('achievements', '', <AchievementsPage />),
  ...localized('profile', '', <ProfilePage />),
  ...localized('settings', '', <SettingsPage />),
  { path: '*', element: <Navigate to="/" replace /> }
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children
  }
]);
