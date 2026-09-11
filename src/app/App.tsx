import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useProfileStore } from '@/stores/profile';
import { useProgressStore } from '@/stores/progress';
import { OnboardingWizard } from '@/features/profile/OnboardingWizard';

export function App() {
  const { profile, loaded, load } = useProfileStore();
  const loadProgress = useProgressStore((s) => s.load);

  useEffect(() => {
    void load();
    void loadProgress();
  }, [load, loadProgress]);

  if (!loaded) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-pulse text-inkSoft">…</div>
      </div>
    );
  }

  if (!profile) {
    return <OnboardingWizard />;
  }

  return <RouterProvider router={router} />;
}
