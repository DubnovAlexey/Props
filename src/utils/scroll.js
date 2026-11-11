// Прокрутка страницы «сразу», без плавной анимации.
//
// В общих стилях включена плавная прокрутка (html { scroll-behavior: smooth }): она приятна,
// когда игрок сам переходит по ссылке внутри страницы. Но при смене страницы, шага пещеры или
// карточки она вредит: браузер начинает плавно ехать вверх, в то же мгновение React меняет
// содержимое, и на iPhone прокрутка обрывается на полпути — новый экран открывается с середины.
// Поэтому при таких переходах прокручиваем мгновенно: на один вызов выключаем плавность.

function instantly(scroll) {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  scroll();
  root.style.scrollBehavior = previous;
}

/** Показать страницу с самого начала */
export function scrollToTop() {
  instantly(() => window.scrollTo(0, 0));
}

/**
 * Показать элемент. block — где он окажется: 'start' — у верхнего края (место под шапку
 * оставляет scroll-padding-top из общих стилей), 'center' — посередине экрана.
 */
export function scrollToElement(element, block = 'start') {
  if (!element) return;
  instantly(() => element.scrollIntoView({ block }));
}
