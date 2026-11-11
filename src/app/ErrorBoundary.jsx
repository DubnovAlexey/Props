// Предохранитель («граница ошибок»): ловит ошибку отрисовки ниже по дереву
// и показывает запасной экран вместо пустой белой страницы.
// Без него любая ошибка в одном компоненте «роняет» всё приложение целиком.
// Это единственный класс в проекте: границу ошибок в React пока можно описать
// только классом — у хуков нет аналога getDerivedStateFromError.
//   resetKey — когда он меняется (перешли на другую страницу), пробуем снова.
import { Component } from 'react';
import { to } from './useHashRoute.js';
import BloodTitle from '../components/BloodTitle/BloodTitle.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';

/**
 * Запасной экран. Он вынесен в отдельную функцию-компонент, потому что в классе
 * нельзя вызывать хуки, а перевод строк берётся хуком useI18n.
 *   onRetry — попробовать отрисовать страницу ещё раз.
 */
function ErrorScreen({ onRetry }) {
  const { t } = useI18n();

  return (
    <div className="card stack" role="alert">
      <BloodTitle>{t('error.title')}</BloodTitle>
      <p>{t('error.text')}</p>
      <p className="muted small">{t('error.hint')}</p>
      <div className="row">
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          {t('error.reload')}
        </button>
        <button type="button" className="btn" onClick={onRetry}>
          {t('error.retry')}
        </button>
        <a className="btn btn-ghost" href={to.map()}>
          {t('common.toMap')}
        </a>
      </div>
    </div>
  );
}

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
    return <ErrorScreen onRetry={() => this.setState({ error: null })} />;
  }
}
