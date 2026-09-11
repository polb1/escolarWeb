import { createBrowserRouter, Navigate } from 'react-router-dom';
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'subject/:id', element: <SubjectView /> },
      { path: 'start/:sessionId', element: <SessionStart /> },
      { path: 'play/:sessionId', element: <ExercisePlayer /> },
      { path: 'games', element: <GamesPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);
