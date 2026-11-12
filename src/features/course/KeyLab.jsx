// «Почему индекс — плохой key» — живой опыт, а не пересказ. Два одинаковых списка студентов с полями
// для заметок: слева key={index}, справа key={student.id}. Игрок пишет заметки и удаляет первого студента.
// Слева React сверяет элементы по индексам 0, 1, 2: решает, что исчез последний, и оставляет поля
// (с введённым текстом) на прежних местах — заметки «переезжают» к чужим студентам. Справа всё на месте.
// Поля нарочно неуправляемые (defaultValue): их текст живёт в DOM, как состояние элементов списка.
import { useState } from 'react';
import { RichText } from '../../components/RichText/RichText.jsx';
import { interpolate } from '../../i18n/translate.js';
import styles from './Course.module.css';

const SIZE = 3;

function NoteList({ students, byIndex, placeholder, moved }) {
  return (
    <div className={`${styles.keyColumn} ${byIndex ? styles.keyBad : styles.keyGood} ${moved ? styles.keyMoved : ''}`}>
      <code className={styles.keyTitle}>{byIndex ? 'key={index}' : 'key={student.id}'}</code>
      <ul className={styles.keyList}>
        {students.map((student, index) => (
          // Ключ-индекс здесь — нарочно: это и есть показываемая ошибка
          <li key={byIndex ? index : student.id} className={styles.keyRow}>
            <span className={styles.keyName}>{student.name}</span>
            <input
              className={styles.keyInput}
              defaultValue=""
              placeholder={interpolate(placeholder, { name: student.name.split(' ')[0] })}
              aria-label={interpolate(placeholder, { name: student.name })}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function KeyLab({ lab }) {
  const first = lab.students.slice(0, SIZE);
  const [students, setStudents] = useState(first);
  // Новый «раунд» — новый key у обёртки: React создаёт списки заново, и введённые заметки стираются
  const [round, setRound] = useState(0);
  const removed = students.length < SIZE;

  function reset() {
    setStudents(first);
    setRound((value) => value + 1);
  }

  return (
    <div className={styles.keyLab}>
      <h3>🔑 {lab.keyTitle}</h3>
      <p className="small">{lab.keyIntro}</p>
      <div className={styles.keyGrid} key={round}>
        <NoteList students={students} byIndex placeholder={lab.notePlaceholder} moved={removed} />
        <NoteList students={students} byIndex={false} placeholder={lab.notePlaceholder} moved={removed} />
      </div>
      <div className="row">
        <button
          type="button"
          className="btn btn-small"
          disabled={students.length === 0}
          onClick={() => setStudents((list) => list.slice(1))}
        >
          {lab.removeFirst}
        </button>
        <button type="button" className="btn btn-small btn-ghost" onClick={reset}>
          {lab.reset}
        </button>
      </div>
      {removed && (
        <p className={`${styles.keyVerdict} anim-pop`}>
          <RichText text={lab.keyVerdict} interactive={false} />
        </p>
      )}
    </div>
  );
}
