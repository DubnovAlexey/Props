// Прокрутка страницы «сразу», без плавной анимации.
//
// В общих стилях включена плавная прокрутка (html { scroll-behavior: smooth }): она приятна,
// когда игрок сам переходит по ссылке внутри страницы. Но при смене страницы, шага пещеры или
// карточки она вредит: браузер начинает плавно ехать вверх, в то же мгновение React меняет
// содержимое, и прокрутка обрывается на полпути — новый экран открывается с середины
// (на iPhone так было почти всегда, в Chrome — на шаге «Практика»).
// Поэтому при таких переходах прокручиваем мгновенно: behavior: 'instant' сильнее стиля smooth.
// Проверено замером по кадрам: выключить плавность строчным стилем (style.scrollBehavior = 'auto')
// не получается — браузер всё равно едет плавно; работает только 'instant'.

/** Показать страницу с самого начала */
export function scrollToTop() {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } catch {
    // очень старый браузер не знает слова 'instant' — прокрутит, как умеет
    window.scrollTo(0, 0);
  }
}

/**
 * Показать элемент. block — где он окажется: 'start' — у верхнего края (место под шапку
 * оставляет scroll-padding-top из общих стилей), 'center' — посередине экрана.
 */
export function scrollToElement(element, block = 'start') {
  if (!element) return;
  try {
    element.scrollIntoView({ block, behavior: 'instant' });
  } catch {
    element.scrollIntoView(block === 'start');
  }
}
