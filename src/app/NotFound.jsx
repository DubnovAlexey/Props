// Страница «не найдено»: неверный адрес или несуществующая пещера.
import { useEffect } from 'react';
import { useMascot } from '../mascot/MascotContext.jsx';

import { to } from './useHashRoute.js';
import BloodTitle from '../components/BloodTitle/BloodTitle.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function NotFound() {
  const { t } = useI18n();
  const { say } = useMascot();

  useEffect(() => {
    say(t('mascot.route.lost'), 'sad');
  }, [say, t]);

  return (
    <div className="card stack">
      <BloodTitle>{t('notFound.title')}</BloodTitle>
      <p className="muted">{t('notFound.text')}</p>
      <a className="btn btn-primary" href={to.map()}>
        {t('common.toMap')}
      </a>
    </div>
  );
}
