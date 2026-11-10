// Контекст Графа. Разделён на два, чтобы не было лишних перерисовок:
//  • MascotActions — стабильные функции say/pointAt/release. Их берут страницы.
//  • MascotState   — что Граф говорит сейчас. Его читает только MascotDock.
// Если бы всё лежало в одном контексте, каждая реплика Графа
// перерисовывала бы все страницы, которые просто хотят вызвать say().
import { createContext, use, useCallback, useMemo, useState } from 'react';

const MascotActions = createContext(null);
const MascotState = createContext(null);

export function MascotProvider({ children }) {
  const [speech, setSpeech] = useState({ id: 0, text: '', mood: 'idle' });
  const [focus, setFocus] = useState(null); // { el, text } — ключевой момент, на который указывает Граф
  const [hidden, setHidden] = useState(false); // Граф улетает, например, на время мини-игры

  const say = useCallback((text, mood = 'talk') => {
    setSpeech((previous) => ({ id: previous.id + 1, text, mood }));
  }, []);

  const pointAt = useCallback((el, text) => setFocus({ el, text }), []);

  // Отпускаем фокус, только если он всё ещё указывает на этот элемент
  const release = useCallback((el) => setFocus((current) => (current?.el === el ? null : current)), []);

  const hide = useCallback(() => setHidden(true), []);
  const show = useCallback(() => setHidden(false), []);

  const actions = useMemo(() => ({ say, pointAt, release, hide, show }), [say, pointAt, release, hide, show]);
  const state = useMemo(() => ({ speech, focus, hidden }), [speech, focus, hidden]);

  return (
    <MascotActions value={actions}>
      <MascotState value={state}>{children}</MascotState>
    </MascotActions>
  );
}

export function useMascot() {
  const actions = use(MascotActions);
  if (!actions) throw new Error('useMascot нужно вызывать внутри <MascotProvider>');
  return actions;
}

export function useMascotState() {
  return use(MascotState);
}
