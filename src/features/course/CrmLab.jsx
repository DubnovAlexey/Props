// Мастерская-опыт: слева — данные (массив students), справа — экран, который React рисует из них.
// Игрок меняет данные — включает и выключает isActive, двигает возраст, удаляет студентов — и сразу
// видит, как работают props, тернарный оператор, &&, ранний return при пустом списке и map с key.
// Под экраном — «что сейчас сработало»: какая строка кода отвечает за то, что видно.
// Тексты — в content/course.js (COURSE.lab); здесь только отображение и состояние мастерской.
import { useState } from 'react';
import CodeBlock from '../../components/CodeBlock/CodeBlock.jsx';
import { RichText } from '../../components/RichText/RichText.jsx';
import { interpolate } from '../../i18n/translate.js';
import KeyLab from './KeyLab.jsx';
import styles from './Course.module.css';

/** Что сейчас «пришло» в карточку: тот же JSX, что пишут в StudentList */
function passedCode(student) {
  const { id, name, age, group, isActive } = student;
  return `<StudentCard\n  key={${id}}\n  student={{ id: ${id}, name: '${name}', age: ${age}, group: '${group}', isActive: ${isActive} }}\n/>`;
}

/** Бейдж статуса — как StatusBadge из задания: тернарный оператор выбирает подпись */
function StatusBadge({ isActive, lab }) {
  return (
    <span className={`${styles.badge} ${isActive ? styles.badgeOn : styles.badgeOff}`}>{isActive ? lab.activeBadge : lab.pausedBadge}</span>
  );
}

/** Карточка студента — как StudentCard из задания */
function StudentCard({ student, lab, picked }) {
  const { name, age, group, isActive } = student;
  return (
    <article className={`${styles.studentCard} ${isActive ? '' : styles.studentPaused} ${picked ? styles.studentPicked : ''}`}>
      <div className={styles.studentHead}>
        <b>{name}</b>
        {/* key по статусу: бейдж создаётся заново и переворачивается, когда isActive меняется */}
        <StatusBadge key={String(isActive)} isActive={isActive} lab={lab} />
      </div>
      <span>{interpolate(lab.ageLine, { age })}</span>
      <span>{interpolate(lab.groupLine, { group })}</span>
      {age < 18 && <span className={styles.minor}>{lab.minor}</span>}
    </article>
  );
}

export default function CrmLab({ lab }) {
  const [students, setStudents] = useState(lab.students);
  const [pickedId, setPickedId] = useState(lab.students[0].id);
  const picked = students.find((student) => student.id === pickedId) ?? students[0];

  // Новые объекты вместо правки старых — как велит пещера неизменяемости
  function change(id, patch) {
    setStudents((list) => list.map((student) => (student.id === id ? { ...student, ...patch } : student)));
    setPickedId(id);
  }

  function remove(id) {
    setStudents((list) => list.filter((student) => student.id !== id));
  }

  const notes =
    students.length === 0
      ? [lab.notes.empty]
      : [
          interpolate(lab.notes.list, { n: students.length }),
          ...(picked && !picked.isActive ? [interpolate(lab.notes.paused, { name: picked.name })] : []),
          ...(picked && picked.age < 18 ? [interpolate(lab.notes.minor, { name: picked.name, age: picked.age })] : []),
        ];

  return (
    <section className={`card stack ${styles.lab}`}>
      <h2>🧪 {lab.title}</h2>
      <p>
        <RichText text={lab.intro} />
      </p>

      <div className={styles.labGrid}>
        <div className={styles.labData}>
          <h3 className={styles.labTitle}>{lab.dataTitle}</h3>
          <ul className={styles.rows}>
            {students.map((student) => (
              <li key={student.id} className={`${styles.row} ${student.id === pickedId ? styles.rowPicked : ''}`}>
                <button type="button" className={styles.rowName} onClick={() => setPickedId(student.id)}>
                  {student.name}
                </button>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={student.isActive}
                    onChange={(event) => change(student.id, { isActive: event.target.checked })}
                  />
                  <code>isActive</code>
                </label>
                <span className={styles.age}>
                  <button
                    type="button"
                    className={styles.ageButton}
                    aria-label={interpolate(lab.younger, { name: student.name })}
                    disabled={student.age <= 14}
                    onClick={() => change(student.id, { age: student.age - 1 })}
                  >
                    −
                  </button>
                  <code>age: {student.age}</code>
                  <button
                    type="button"
                    className={styles.ageButton}
                    aria-label={interpolate(lab.older, { name: student.name })}
                    disabled={student.age >= 99}
                    onClick={() => change(student.id, { age: student.age + 1 })}
                  >
                    +
                  </button>
                </span>
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={interpolate(lab.remove, { name: student.name })}
                  onClick={() => remove(student.id)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="row">
            <button type="button" className="btn btn-small" disabled={students.length === 0} onClick={() => setStudents([])}>
              {lab.clear}
            </button>
            <button type="button" className="btn btn-small btn-ghost" onClick={() => setStudents(lab.students)}>
              {lab.restore}
            </button>
          </div>
        </div>

        <div className={styles.labView}>
          <h3 className={styles.labTitle}>
            <code>{lab.viewTitle}</code>
          </h3>
          <div className={styles.screen}>
            <b className={styles.screenTitle}>{lab.screenTitle}</b>
            {students.length === 0 ? (
              <p className={styles.empty}>{lab.empty}</p>
            ) : (
              <>
                <span className={styles.total}>{interpolate(lab.total, { n: students.length })}</span>
                {students.map((student) => (
                  <StudentCard key={student.id} student={student} lab={lab} picked={student.id === pickedId} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.notes} aria-live="polite">
        <b>{lab.notesTitle}</b>
        <ul>
          {notes.map((note) => (
            <li key={note}>
              <RichText text={note} interactive={false} />
            </li>
          ))}
        </ul>
        {picked && students.length > 0 && (
          <>
            <p className="muted small">{interpolate(lab.passed, { name: picked.name })}</p>
            <CodeBlock code={passedCode(picked)} />
          </>
        )}
      </div>

      <KeyLab lab={lab} />
    </section>
  );
}
