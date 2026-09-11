import { useTranslation } from 'react-i18next';
import { SUBJECTS } from '@/data/subjects';
import { SubjectCard } from '@/features/subjects/SubjectCard';
import { Mascot } from '@/ui/mascot/Mascot';
import { useProfileStore } from '@/stores/profile';
import { Link } from 'react-router-dom';

function greetingKey(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return 'greeting.morning';
  if (h < 20) return 'greeting.afternoon';
  return 'greeting.evening';
}

export function HomePage() {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  const name = profile?.nickname ?? t('greeting.anonymous');

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <Mascot size={80} mood="happy" />
        <div>
          <h1 className="font-black text-2xl md:text-3xl leading-tight">
            {t(greetingKey(), { name })}
          </h1>
          <p className="text-inkSoft mt-1">{t('home.prompt')}</p>
        </div>
      </header>

      <section
        aria-labelledby="today-mission"
        className="rounded-2xl bg-surfaceElevated shadow-card p-5 mb-8 border border-black/5"
      >
        <div className="text-sm font-bold uppercase tracking-wide text-inkSoft mb-1">
          🎯 <span id="today-mission">{t('home.todayMission')}</span>
        </div>
        <p className="text-lg">{t('home.todayMissionEmpty')}</p>
      </section>

      <section aria-label={t('home.prompt')} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUBJECTS.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </section>

      <nav aria-label="Secciones" className="mt-8 grid grid-cols-3 gap-3">
        <FooterLink to="/progress" icon="⭐" label={t('home.seeProgress')} />
        <FooterLink to="/achievements" icon="🏆" label={t('home.seeAchievements')} />
        <FooterLink to="/games" icon="🎮" label={t('home.playGames')} />
      </nav>
    </div>
  );
}

function FooterLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-2xl bg-surfaceElevated shadow-card p-4 flex items-center justify-center gap-2 font-bold text-ink hover:shadow-cardHover transition-shadow"
    >
      <span aria-hidden="true" className="text-2xl">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
