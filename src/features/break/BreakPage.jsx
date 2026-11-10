// Отдельная страница перемены: можно зайти в любой момент,
// когда голова «кипит» и нужно переключиться.
import { useEffect } from 'react';
import BatCatcher from './BatCatcher.jsx';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { PHRASES } from '../../mascot/phrases.js';
import { useProgress } from '../../state/ProgressContext.jsx';

export default function BreakPage() {
  const { say } = useMascot();
  const { progress, dispatch } = useProgress();

  useEffect(() => {
    say(PHRASES.route.break, 'wave');
  }, [say]);

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Перемена</span>
        <h1>Поймай мышей</h1>
        <p className="muted">20 секунд игры — и мозг снова готов учиться. Лучший результат: {progress.breakBest}.</p>
      </div>
      <BatCatcher duration={20} onFinish={(score) => dispatch({ type: 'break', score })} finishLabel="Записать результат" />
      <p className="muted small">Совет Графа: после 25 минут учёбы делай перерыв на 5 минут — встань, пройдись, посмотри вдаль.</p>
    </div>
  );
}
