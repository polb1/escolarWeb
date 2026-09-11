import { useParams, Link } from 'react-router-dom';
import { SUBJECTS, type SubjectId } from '@/data/subjects';
import { useTranslation } from 'react-i18next';
import { SESSIONS } from '@/features/exercise-player/sessions';

interface TopicChoice {
  sessionId: string;
  titleKey: string;
  icon: string;
}

const TOPICS_BY_SUBJECT: Partial<Record<SubjectId, TopicChoice[]>> = {
  math: [
    { sessionId: 'math.addition', titleKey: 'sessions.math.addition', icon: '➕' },
    { sessionId: 'math.subtraction', titleKey: 'sessions.math.subtraction', icon: '➖' },
    { sessionId: 'math.multiplication', titleKey: 'sessions.math.multiplication', icon: '✖️' },
    { sessionId: 'math.comparison', titleKey: 'sessions.math.comparison', icon: '⚖️' },
    { sessionId: 'math.ordering', titleKey: 'sessions.math.ordering', icon: '🔢' }
  ],
  english: [
    { sessionId: 'english.colours', titleKey: 'sessions.english.colours', icon: '🎨' },
    { sessionId: 'english.animals', titleKey: 'sessions.english.animals', icon: '🐶' },
    { sessionId: 'english.numbers', titleKey: 'sessions.english.numbers', icon: '🔢' }
  ]
};

export function SubjectView() {
  const { id } = useParams<{ id: SubjectId }>();
  const { t } = useTranslation();
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

  return (
    <div className="mx-auto max-w-3xl px-4 pt-6 pb-24">
      <Link to="/" className="text-inkSoft font-bold">
        ← {t('actions.back')}
      </Link>
      <div className="mt-4 flex items-center gap-4">
        <div
          aria-hidden="true"
          className="text-6xl w-24 h-24 rounded-3xl grid place-items-center"
          style={{ background: `${subject.colorVar}22` }}
        >
          {subject.icon}
        </div>
        <div>
          <h1 className="font-black text-3xl">{t(subject.nameKey)}</h1>
          <p className="text-inkSoft">{t(subject.taglineKey)}</p>
        </div>
      </div>

      {topics ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const session = SESSIONS[topic.sessionId];
            const to = session?.hasDifficultyLevels
              ? `/start/${topic.sessionId}`
              : `/play/${topic.sessionId}`;
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
