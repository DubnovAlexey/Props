// Раунды мини-игры «Поймай мышей». good — верные надписи, bad — ловушки.
// Надписи короткие: их нужно успеть прочитать, пока мышь летит.
export const BREAK_ROUNDS = {
  hooks: {
    id: 'hooks',
    title: 'Лови настоящие хуки React',
    good: ['useState', 'useEffect', 'useContext', 'useMemo', 'useCallback', 'useRef', 'useReducer', 'useId', 'use', 'useTransition'],
    bad: ['useProps', 'useChildren', 'useParent', 'useBat', 'useDOM', 'useRender', 'useKey', 'useCape'],
  },
  truths: {
    id: 'truths',
    title: 'Лови только правду о пропсах',
    good: [
      'Пропсы только для чтения',
      'Данные текут вниз',
      'key не попадает в пропсы',
      'children — это проп',
      'memo сравнивает ссылки',
      'ref — проп в React 19',
      'Колбэк — функция в пропсе',
    ],
    bad: [
      'Ребёнок меняет пропсы',
      'props.key доступен',
      'propTypes нужны в React 19',
      'memo сравнивает глубоко',
      'Пропсы текут вверх',
      '{} === {} — это true',
    ],
  },
  attrs: {
    id: 'attrs',
    title: 'Лови правильные JSX-атрибуты',
    good: ['className', 'htmlFor', 'onClick', 'tabIndex', 'aria-label', 'data-id', 'readOnly', 'defaultValue', 'onChange'],
    bad: ['class', 'for', 'onclick', 'tabindex', 'readonly', 'ariaLabel', 'onchange'],
  },
};
