// Схемы для «Свитков Графа»: на них ссылаются строки «::scheme имя»
// в разделах руководства (их расставляет scripts/build-library.mjs).
// Формат тот же, что у схем в карточках урока (components/Scheme).
export const LIBRARY_SCHEMES = {
  'prop-path': {
    type: 'steps',
    title: 'Путь пропа · 4 шага',
    steps: [
      { title: 'Родитель пишет JSX', code: '<ProductCard name="Молоко" quantity={2} />' },
      { title: 'React собирает объект props', code: "{ name: 'Молоко', quantity: 2 }" },
      { title: 'Вызывает функцию-компонент', code: 'ProductCard(props)', tone: 'main' },
      { title: 'Карточка появляется на экране', tone: 'good' },
    ],
  },
  'jsx-to-dom': {
    type: 'steps',
    title: 'Путь пропа от JSX до DOM · 5 шагов',
    steps: [
      { title: 'JSX', code: '<ProductCard name="Молоко" quantity={2} />' },
      { title: 'Вызов функции', code: "jsx(ProductCard, { name: 'Молоко', quantity: 2 })" },
      { title: 'React-элемент', code: '{ type: ProductCard, key: null, props: { … } }' },
      { title: 'Рендер', code: 'ProductCard(props)', tone: 'main' },
      { title: 'В DOM — только изменения', tone: 'good' },
    ],
  },
  rerender: {
    type: 'steps',
    title: 'Цикл перерисовки · 5 шагов',
    steps: [
      { title: 'Причина', sub: 'сеттер · рендер родителя · новый контекст', tone: 'gold' },
      { title: 'Рендер', sub: 'React вызывает компонент заново', tone: 'main' },
      { title: 'Новое дерево элементов' },
      { title: 'Согласование', sub: 'сравнение со старым деревом' },
      { title: 'Фиксация', sub: 'в DOM попадает только разница', tone: 'good' },
    ],
  },
  fridge: {
    type: 'tree',
    title: 'Умный холодильник · дерево компонентов',
    root: {
      name: 'App',
      note: 'пользователь, продукты, рецепт, ошибка',
      tone: 'main',
      children: [
        { name: 'Header', down: 'userName, role' },
        { name: 'SearchForm', down: 'isLoading', up: 'onSearch' },
        {
          name: 'ProductList',
          down: 'products, canDelete',
          up: 'onDelete',
          children: [
            {
              name: 'ProductCard',
              down: 'product, canDelete',
              up: 'onDelete(id)',
              children: [{ name: 'ExpiryBadge', down: 'daysLeft' }],
            },
          ],
        },
        { name: 'RecipeResult', down: 'result, isLoading' },
        { name: 'ErrorModal', down: 'isOpen, children', up: 'onClose' },
      ],
    },
  },
  kosmo: {
    type: 'tree',
    title: 'Kosmo, преферанс · от движка до карты',
    root: {
      name: 'Движок игры',
      note: 'знает все карты',
      tone: 'gold',
      children: [
        {
          name: 'playerView',
          note: 'срез для одного игрока',
          children: [
            {
              name: 'GameTable',
              down: 'view',
              up: 'onPlayCard, onBid',
              tone: 'main',
              children: [
                { name: 'OpponentSeat ×2', down: '{...opponent}', note: 'только число карт' },
                { name: 'TrickArea', down: 'trick, trump' },
                { name: 'BiddingPanel', down: 'availableBids', up: 'onBid' },
                {
                  name: 'PlayerHand',
                  down: 'cards, playableIds',
                  up: 'onPlayCard',
                  children: [{ name: 'Card', down: 'card, isPlayable', up: 'onPlay' }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
