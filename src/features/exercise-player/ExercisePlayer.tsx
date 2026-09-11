import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Volume2, X } from 'lucide-react';
import { SESSIONS, buildSession } from './sessions';
import { getRenderer } from '@/engine/registry';
import type { AttemptResult, Difficulty, ExerciseSpec } from '@/engine/types';
import { Mascot } from '@/ui/mascot/Mascot';
import { useProgressStore, loadRecentAttempts } from '@/stores/progress';
import { useStreakStore } from '@/stores/streak';
import { playBeep, speak, stripForSpeech } from '@/lib/audio';
import { useProfileStore } from '@/stores/profile';
import { adjustDifficulty, computeXp } from '@/engine/difficulty';

export function ExercisePlayer() {
  const { t, i18n } = useTranslation();
  const { sessionId = '' } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  /** Dificultad elegida en la pantalla previa; por defecto la más fácil. */
  const requestedDifficulty = parseDifficulty(searchParams.get('d')) ?? 1;
  const profile = useProfileStore((s) => s.profile);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const recordSessionResult = useProgressStore((s) => s.recordSessionResult);
  const awardXp = useProgressStore((s) => s.awardXp);
  const registerStreakActivity = useStreakStore((s) => s.registerActivity);

  const [items, setItems] = useState<ExerciseSpec[] | null>(null);
  const [index, setIndex] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'good' | 'retry'>('idle');
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [correctCount, setCorrectCount] = useState(0);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const session = SESSIONS[sessionId];
  const lang = (profile?.language ?? (i18n.language as 'es' | 'ca')) || 'es';

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      if (!session) return;
      let startFrom = requestedDifficulty;
      if (session.hasDifficultyLevels) {
        // Adaptatividad SOLO cuando el niño ya ha jugado varias veces al topic.
        // Aun así, respetamos la elección del niño como suelo/techo: si eligió Fácil,
        // no le subimos por sorpresa. Si eligió Difícil, sí podemos bajarle si sufre.
        const recent = await loadRecentAttempts(session.topicId, 10);
        const adjusted = adjustDifficulty(requestedDifficulty, recent);
        startFrom = Math.min(adjusted.next, requestedDifficulty) as Difficulty;
      }
      if (cancelled) return;
      const specs = buildSession(session.id, startFrom);
      setItems(specs);
      setStartedAt(Date.now());
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, [session, requestedDifficulty]);

  const current = items?.[index];
  const showHint = hintOpen;

  const forceHelp = attemptCount >= 2;

  const finished = items && index >= items.length;

  const dots = useMemo(() => {
    if (!items) return null;
    return (
      <div className="flex items-center gap-2" aria-label={`${index}/${items.length}`}>
        {items.map((_, i) => (
          <span
            key={i}
            className="h-2 rounded-full transition-all"
            style={{
              width: i === index ? 24 : 10,
              background:
                i < index ? 'var(--color-correct)' : i === index ? 'var(--color-brand)' : 'rgba(0,0,0,0.15)'
            }}
          />
        ))}
      </div>
    );
  }, [items, index]);

  if (!session) {
    return (
      <div className="p-8 text-center">
        <p>Sesión no encontrada</p>
        <Link to="/" className="text-brand underline">
          {t('actions.back')}
        </Link>
      </div>
    );
  }

  async function handleAttempt(result: AttemptResult) {
    if (!current) return;
    const nextAttempts = attemptCount + 1;
    setAttemptCount(nextAttempts);
    if (result.correct) {
      playBeep('good');
      const firstTry = nextAttempts === 1;
      const xp = computeXp({
        difficulty: current.difficulty,
        correct: true,
        firstTry,
        hintsUsed: showHint ? 1 : 0
      });
      setFeedback('good');
      setCorrectCount((c) => c + 1);
      if (firstTry) setFirstTryCount((c) => c + 1);
      setXpEarned((x) => x + xp);
      await recordAttempt({
        exerciseId: current.id,
        topicId: current.topicId,
        subjectId: current.subjectId,
        correct: true,
        timeMs: Date.now() - startedAt,
        hintsUsed: showHint ? 1 : 0
      });
      awardXp(xp);
      setTimeout(advance, 900);
    } else {
      playBeep('bad');
      setFeedback('retry');
      setTimeout(() => setFeedback('idle'), 800);
      if (nextAttempts >= 2) setHintOpen(true);
    }
  }

  function advance() {
    setFeedback('idle');
    setHintOpen(false);
    setAttemptCount(0);
    setStartedAt(Date.now());
    setIndex((i) => i + 1);
  }

  if (!items || !current) {
    if (finished) {
      const total = items!.length;
      const stars = (firstTryCount === total
        ? 3
        : correctCount === total
          ? 2
          : correctCount >= Math.ceil(total * 0.6)
            ? 1
            : 0) as 0 | 1 | 2 | 3;
      // Guardado idempotente: sólo escribe si mejora el récord.
      void recordSessionResult({ sessionId, stars, correct: correctCount, total });
      registerStreakActivity();
      return <SessionResult correct={correctCount} total={total} firstTry={firstTryCount} xp={xpEarned} />;
    }
    return (
      <div className="p-8 text-center text-inkSoft">
        <div className="animate-pulse">…</div>
      </div>
    );
  }

  const Renderer = getRenderer(current.type);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label={t('actions.close')}
          className="rounded-full bg-white shadow-card p-2"
        >
          <X size={20} aria-hidden="true" />
        </button>
        {dots}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHintOpen((h) => !h)}
            aria-label={t('player.hint')}
            className="rounded-full bg-white shadow-card p-2"
            disabled={!current.hint}
          >
            <HelpCircle size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={t('player.audio')}
            className="rounded-full bg-white shadow-card p-2"
            onClick={() => {
              const text = pickSpeechText(current, lang);
              if (text) speak(text, current.subjectId === 'english' ? 'en-GB' : lang === 'ca' ? 'ca-ES' : 'es-ES');
            }}
          >
            <Volume2 size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="flex-1 grid place-items-center px-4 py-8">
        <div className="w-full">
          <Renderer
            key={current.id}
            spec={current as never}
            onAttempt={handleAttempt}
            showHint={showHint || forceHelp}
            lang={lang}
          />
        </div>
      </div>

      <AnimatePresence>
        {feedback !== 'idle' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 px-4 pb-6"
          >
            <div
              className="mx-auto max-w-xl rounded-3xl p-4 flex items-center gap-3 shadow-cardHover"
              style={{
                background: feedback === 'good' ? '#dcfce7' : '#fee2e2',
                color: '#1f2937'
              }}
              role="status"
            >
              <Mascot size={54} mood={feedback === 'good' ? 'cheer' : 'thinking'} />
              <div>
                <div className="font-black text-lg">
                  {feedback === 'good' ? t('feedback.correct') : t('feedback.retry')}
                </div>
                {feedback === 'good' && <div className="text-inkSoft">+{computeXpPreview(current)} ⭐</div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function computeXpPreview(spec: ExerciseSpec): number {
  return computeXp({ difficulty: spec.difficulty, correct: true, firstTry: true, hintsUsed: 0 });
}

function pickSpeechText(spec: ExerciseSpec, lang: 'es' | 'ca'): string | null {
  switch (spec.type) {
    case 'multiple_choice':
      return stripForSpeech(spec.question[lang]);
    case 'image_selection':
      return stripForSpeech(spec.question[lang]);
    case 'matching':
      return stripForSpeech(spec.prompt[lang]);
    case 'ordering':
      return stripForSpeech(spec.prompt[lang]);
    case 'math_operation':
      return spec.render.replace('×', 'por').replace('−', 'menos').replace('+', 'más');
  }
}

function parseDifficulty(raw: string | null): Difficulty | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n as Difficulty;
}

function SessionResult({
  correct,
  total,
  firstTry,
  xp
}: {
  correct: number;
  total: number;
  firstTry: number;
  xp: number;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stars = firstTry === total ? 3 : correct === total ? 2 : correct >= Math.ceil(total * 0.6) ? 1 : 0;
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="max-w-md w-full rounded-3xl bg-surfaceElevated shadow-cardHover p-8 text-center border border-black/5">
        <Mascot size={96} mood="cheer" />
        <h1 className="font-black text-2xl mt-3">{t('player.done')}</h1>
        <div className="text-4xl my-4" aria-label={`${stars} de 3 estrellas`}>
          {'⭐'.repeat(stars)}
          <span className="opacity-20">{'⭐'.repeat(3 - stars)}</span>
        </div>
        <p className="text-inkSoft">
          {correct} / {total} · +{xp} ⭐
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 rounded-2xl px-6 py-3 font-black text-white bg-brand"
        >
          {t('actions.continue')}
        </button>
      </div>
    </div>
  );
}
