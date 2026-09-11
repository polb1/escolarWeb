import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mascot } from '@/ui/mascot/Mascot';
import { usePath } from '@/lib/usePath';

interface Game {
  sessionId: string;
  titleKey: string;
  descKey: string;
  icon: string;
  color: string;
}

const GAMES: Game[] = [
  {
    sessionId: 'games.memory.animals',
    titleKey: 'games.memoryAnimals',
    descKey: 'games.memoryAnimalsDesc',
    icon: '🐶',
    color: '#14b8a6'
  },
  {
    sessionId: 'games.memory.colours',
    titleKey: 'games.memoryColours',
    descKey: 'games.memoryColoursDesc',
    icon: '🎨',
    color: '#a855f7'
  },
  {
    sessionId: 'games.memory.numbers',
    titleKey: 'games.memoryNumbers',
    descKey: 'games.memoryNumbersDesc',
    icon: '🔢',
    color: '#3b82f6'
  }
];

export function GamesPage() {
  const { t } = useTranslation();
  const path = usePath();
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-24">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex-shrink-0 w-14 h-14 md:w-[72px] md:h-[72px]">
          <Mascot size="100%" mood="cheer" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-black text-2xl md:text-3xl leading-tight">{t('gamesPage.title')}</h1>
          <p className="text-inkSoft text-sm md:text-base">{t('gamesPage.subtitle')}</p>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAMES.map((game) => (
          <motion.div key={game.sessionId} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={path('play', game.sessionId)}
              className="block rounded-3xl bg-surfaceElevated shadow-card p-6 border-4"
              style={{ borderColor: game.color }}
            >
              <div className="text-5xl mb-3" aria-hidden="true">
                {game.icon}
              </div>
              <div className="font-black text-xl">{t(game.titleKey)}</div>
              <div className="text-inkSoft mt-1 text-sm">{t(game.descKey)}</div>
            </Link>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
