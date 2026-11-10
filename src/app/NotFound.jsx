// Страница «не найдено»: неверный адрес или несуществующая пещера.
import { useEffect } from 'react';
import { useMascot } from '../mascot/MascotContext.jsx';
import { PHRASES } from '../mascot/phrases.js';
import { to } from './useHashRoute.js';
import BloodTitle from '../components/BloodTitle/BloodTitle.jsx';

export default function NotFound() {
  const { say } = useMascot();

  useEffect(() => {
    say(PHRASES.route.lost, 'sad');
  }, [say]);

  return (
    <div className="card stack">
      <BloodTitle>🕸️ Здесь только паутина</BloodTitle>
      <p className="muted">Такой пещеры здесь нет. Может, мыши утащили табличку?</p>
      <a className="btn btn-primary" href={to.map()}>
        На карту пещер
      </a>
    </div>
  );
}
