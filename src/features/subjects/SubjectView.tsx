import { useParams, Link } from 'react-router-dom';
import { SUBJECTS, type SubjectId } from '@/data/subjects';
import { useTranslation } from 'react-i18next';
import { SESSIONS } from '@/features/exercise-player/sessions';
import { LevelMap, type LevelNode } from '@/features/level-map/LevelMap';
import { usePath } from '@/lib/usePath';

interface TopicChoice {
  sessionId: string;
  titleKey: string;
  icon: string;
}

const TOPICS_BY_SUBJECT: Partial<Record<SubjectId, TopicChoice[]>> = {
  math: [
    { sessionId: 'math.comparison', titleKey: 'sessions.math.comparison', icon: '⚖️' },
    { sessionId: 'math.ordering', titleKey: 'sessions.math.ordering', icon: '🔢' },
    { sessionId: 'math.addition', titleKey: 'sessions.math.addition', icon: '➕' },
    { sessionId: 'math.subtraction', titleKey: 'sessions.math.subtraction', icon: '➖' },
    { sessionId: 'math.multiplication', titleKey: 'sessions.math.multiplication', icon: '✖️' }
  ],
  english: [
    { sessionId: 'english.colours', titleKey: 'sessions.english.colours', icon: '🎨' },
    { sessionId: 'english.animals', titleKey: 'sessions.english.animals', icon: '🐶' },
    { sessionId: 'english.numbers', titleKey: 'sessions.english.numbers', icon: '🔢' }
  ],
  spanish: [
    { sessionId: 'spanish.synonyms', titleKey: 'sessions.spanish.synonyms', icon: '🔗' },
    { sessionId: 'spanish.antonyms', titleKey: 'sessions.spanish.antonyms', icon: '↔️' }
  ],
  catalan: [
    { sessionId: 'catalan.sinonims', titleKey: 'sessions.catalan.sinonims', icon: '🔗' },
    { sessionId: 'catalan.animals', titleKey: 'sessions.catalan.animals', icon: '🐮' }
  ],
  science: [
    { sessionId: 'science.animals', titleKey: 'sessions.science.animals', icon: '🐘' },
    { sessionId: 'science.body', titleKey: 'sessions.science.body', icon: '🧑' }
  ]
};

/** Asignaturas que muestran el camino de niveles progresivo. */
const SUBJECTS_WITH_LEVEL_MAP: SubjectId[] = ['math', 'english', 'spanish', 'catalan', 'science'];

export function SubjectView() {
  const { id } = useParams<{ id: SubjectId }>();
  const { t } = useTranslation();
  const path = usePath();
  const subject = SUBJECTS.find((s) => s.id === id);
  const topics = id ? TOPICS_BY_SUBJECT[id] : undefined;

  if (!subject) {
    return (
      <div className="max-w-md mx-auto p-6">
        <p>404</p>
        <Link to="/" className="text-brand underline">
          {t('actions.back')}
        </Link>
      </div>
    );
  }

  const useMap = id && topics && SUBJECTS_WITH_LEVEL_MAP.includes(id);
  const mapNodes: LevelNode[] = topics
    ? topics.map((topic) => ({
        sessionId: topic.sessionId,
        titleKey: topic.titleKey,
        icon: topic.icon,
        color: subject.colorVar
      }))
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-24">
      <Link to="/" className="text-inkSoft font-bold">
        ← {t('actions.back')}
      </Link>
      <div className="mt-4 flex items-center gap-3 md:gap-4">
        <div
          aria-hidden="true"
          className="text-4xl md:text-6xl w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl grid place-items-center flex-shrink-0"
          style={{ background: `${subject.colorVar}22` }}
        >
          {subject.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-black text-2xl md:text-3xl leading-tight break-words">{t(subject.nameKey)}</h1>
          <p className="text-inkSoft text-sm md:text-base">{t(subject.taglineKey)}</p>
        </div>
      </div>

      {useMap ? (
        <div className="mt-8">
          <LevelMap nodes={mapNodes} subjectColor={subject.colorVar} />
        </div>
      ) : topics ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const session = SESSIONS[topic.sessionId];
            const to = session?.hasDifficultyLevels
              ? path('start', topic.sessionId)
              : path('play', topic.sessionId);
            return (
              <Link
                key={topic.sessionId}
                to={to}
                className="block rounded-3xl bg-surfaceElevated shadow-card p-6 border-4 hover:shadow-cardHover transition-shadow"
                style={{ borderColor: subject.colorVar }}
              >
                <div className="text-5xl mb-3" aria-hidden="true">
                  {topic.icon}
                </div>
                <div className="font-black text-xl">{t(topic.titleKey)}</div>
                <div className="text-inkSoft mt-1 text-sm">{t('sessions.exercises', { count: 5 })}</div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl bg-surfaceElevated shadow-card p-8 text-center border border-black/5">
          <div className="text-5xl mb-3">🚧</div>
          <p className="font-bold text-xl">{t('status.comingSoon')}</p>
        </div>
      )}
    </div>
  );
}
