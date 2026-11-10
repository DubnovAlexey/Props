// Страница «не найдено»: неверный адрес или несуществующая пещера.
import { useEffect } from 'react';
import { useMascot } from '../mascot/MascotContext.jsx';
import { PHRASES } from '../mascot/phrases.js';
import { to } from './useHashRoute.js';

export default function NotFound() {
  const { say } = useMascot();

  useEffect(() => {
    say(PHRASES.route.lost, 'sad');
  }, [say]);

  return (
    <div className="card stack">
      <h1>🕸️ Здесь только паутина</h1>
      <p className="muted">Такой пещеры здесь нет. Может, мыши утащили табличку?</p>
      <a className="btn btn-primary" href={to.map()}>
        На карту пещер
      </a>
    </div>
  );
}
