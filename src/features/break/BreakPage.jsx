// Отдельная страница перемены: можно зайти в любой момент,
// когда голова «кипит» и нужно переключиться.
import { useEffect } from 'react';
import BatCatcher from './BatCatcher.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';

import { useProgress } from '../../state/ProgressContext.jsx';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function BreakPage() {
  const { t } = useI18n();
  const { say } = useMascot();
  const { progress, dispatch } = useProgress();

  useEffect(() => {
    say(t('mascot.route.break'), 'wave');
  }, [say, t]);

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">{t('break.pageEyebrow')}</span>
        <BloodTitle>{t('break.title')}</BloodTitle>
        <p className="muted">{t('break.intro', { best: progress.breakBest })}</p>
      </div>
      {/* Рекорд записывается сам, когда время вышло: отдельная кнопка для этого не нужна */}
      <BatCatcher duration={20} onScore={(score) => dispatch({ type: 'break', score })} />
      <p className="muted small">{t('break.tip')}</p>
    </div>
  );
}
