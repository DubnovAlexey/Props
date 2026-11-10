// «Методика»: какие психологические приёмы встроены в игру и почему.
// Знать, КАК ты учишься (метапознание), — само по себе ускоряет обучение.
import { useEffect } from 'react';
import { METHODS, STUDY_PLAN } from '../../content/methods.js';
import { useMascot } from '../../mascot/MascotContext.jsx';
import { PHRASES } from '../../mascot/phrases.js';
import styles from './Methods.module.css';
import BloodTitle from '../../components/BloodTitle/BloodTitle.jsx';

export default function MethodsPage() {
  const { say } = useMascot();

  useEffect(() => {
    say(PHRASES.route.methods, 'talk');
  }, [say]);

  return (
    <div className="stack">
      <div>
        <span className="eyebrow">Секреты вампирской памяти</span>
        <BloodTitle>Как устроено обучение</BloodTitle>
        <p className="muted">
          Каждая механика в пещерах опирается на исследования памяти и внимания. Вот что работает на тебя — и как пользоваться этим за
          пределами игры.
        </p>
      </div>

      <section className="card">
        <h2>План на одно занятие</h2>
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
              <b>Что это:</b> {method.what}
            </p>
            <p>
              <b>В игре:</b> {method.inGame}
            </p>
            <p className="muted">
              <b>Сам:</b> {method.tip}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
