import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useProfileStore } from '@/stores/profile';
import { OnboardingWizard } from '@/features/profile/OnboardingWizard';

export function App() {
  const { profile, loaded, load } = useProfileStore();

  useEffect(() => {
    void load();
  }, [load]);

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
