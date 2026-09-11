import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/ui/layout/AppShell';
import { HomePage } from '@/features/home/HomePage';
import { SubjectView } from '@/features/subjects/SubjectView';
import { Placeholder } from '@/features/placeholder/Placeholder';
import { ExercisePlayer } from '@/features/exercise-player/ExercisePlayer';
import { SessionStart } from '@/features/exercise-player/SessionStart';
import { ProgressPage } from '@/features/progress/ProgressPage';
import { AchievementsPage } from '@/features/achievements/AchievementsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'subject/:id', element: <SubjectView /> },
      { path: 'start/:sessionId', element: <SessionStart /> },
      { path: 'play/:sessionId', element: <ExercisePlayer /> },
      { path: 'games', element: <Placeholder title="Juegos" icon="🎮" /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'achievements', element: <AchievementsPage /> },
      { path: 'profile', element: <Placeholder title="Perfil" icon="🧒" /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);
