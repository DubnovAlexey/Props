// Предохранитель («граница ошибок»): ловит ошибку отрисовки ниже по дереву
// и показывает запасной экран вместо пустой белой страницы.
// Без него любая ошибка в одном компоненте «роняет» всё приложение целиком.
// Это единственный класс в проекте: границу ошибок в React пока можно описать
// только классом — у хуков нет аналога getDerivedStateFromError.
//   resetKey — когда он меняется (перешли на другую страницу), пробуем снова.
import { Component } from 'react';
import { to } from './useHashRoute.js';

export default class ErrorBoundary extends Component {
  state = { error: null };

  /** React вызывает это при ошибке в дочернем компоненте: запоминаем её в состоянии */
  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Текст ошибки — в консоль браузера (F12): пригодится, чтобы найти причину
    console.error('Ошибка при отрисовке страницы:', error, info.componentStack);
  }

  componentDidUpdate(previousProps) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="card stack" role="alert">
        <h1>🪨 Обвал в пещере</h1>
        <p>Эта страница не смогла открыться. Прогресс не пострадал — он хранится отдельно.</p>
        <p className="muted small">
          Чаще всего так бывает, когда пропал интернет или игра обновилась, пока была открыта. Обновление страницы обычно помогает.
        </p>
        <div className="row">
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Обновить страницу
          </button>
          <button type="button" className="btn" onClick={() => this.setState({ error: null })}>
            Попробовать ещё раз
          </button>
          <a className="btn btn-ghost" href={to.map()}>
            На карту пещер
          </a>
        </div>
      </div>
    );
  }
}
