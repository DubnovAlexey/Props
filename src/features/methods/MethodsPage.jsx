// «Методика»: какие психологические приёмы встроены в игру и почему.
// Знать, КАК ты учишься (метапознание), — само по себе ускоряет обучение.
import { useEffect } from 'react';
import { METHODS, STUDY_PLAN } from '../../content/methods.js';
import { useMascot } from '../../mascot/MascotContext.jsx';

import styles from './Methods.module.css';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';
import { useI18n } from '../../i18n/I18nContext.jsx';

export default function MethodsPage() {
  const { t } = useI18n();
  const { say } = useMascot();

  useEffect(() => {
    say(t('mascot.route.methods'), 'talk');
  }, [say, t]);

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">{t('methods.eyebrow')}</span>
        <BloodTitle>{t('methods.title')}</BloodTitle>
        <p className="muted">{t('methods.intro')}</p>
      </div>

      <section className="card">
        <h2>{t('methods.plan')}</h2>
        <ol className={styles.plan}>
          {STUDY_PLAN.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <div className={styles.grid}>
        {METHODS.map((method) => (
          <article key={method.id} className={`card ${styles.method}`}>
            <div className={styles.icon} aria-hidden="true">
              {method.icon}
            </div>
            <h2 className={styles.name}>{method.name}</h2>
            <p>
              <b>{t('methods.what')}</b> {method.what}
            </p>
            <p>
              <b>{t('methods.inGame')}</b> {method.inGame}
            </p>
            <p className="muted">
              <b>{t('methods.self')}</b> {method.tip}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
