import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Subject } from '@/data/subjects';

interface Props {
  subject: Subject;
}

export function SubjectCard({ subject }: Props) {
  const { t } = useTranslation();
  const disabled = subject.status === 'coming_soon';

  const body = (
    <>
      <div
        aria-hidden="true"
        className="text-4xl md:text-6xl mb-2 md:mb-3"
        style={{ filter: disabled ? 'grayscale(0.4)' : 'none' }}
      >
        {subject.icon}
      </div>
      <div className="font-black text-lg md:text-2xl text-ink leading-tight">{t(subject.nameKey)}</div>
      <div className="text-inkSoft text-xs md:text-base mt-1">{t(subject.taglineKey)}</div>
      {disabled && (
        <div
          className="absolute top-3 right-3 text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-white/80 text-ink"
          style={{ color: subject.colorVar }}
        >
          {t('status.comingSoon')}
        </div>
      )}
    </>
  );

  const className =
    'relative block w-full text-left rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-card transition-transform bg-surfaceElevated border-4 focus-visible:outline-none';
  const style = {
    borderColor: subject.colorVar,
    minHeight: 140
  } as const;

  if (disabled) {
    return (
      <div className={className} style={{ ...style, opacity: 0.65, cursor: 'not-allowed' }}>
        {body}
      </div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Link to={`/subject/${subject.id}`} className={className} style={style}>
        {body}
      </Link>
    </motion.div>
  );
}
