import React from 'react';
import * as Sentry from '@sentry/browser';

type Props = {};
type State = {
  error: any;
  errorInfo: any;
};

export class ErrorBoundary extends React.Component<Props> {
  state: State = {
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error: any, errorInfo: any) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
    Sentry.captureException(error);
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Что-то пошло не так...</h2>
          <p>
            Пожалуйста, сообщи об ошибке{' '}
            <a href="https://vk.com/savinyurii">мне в ВК</a> или{' '}
            <a href="https://tele.click/savinyurii">в Telegram</a>, я сделаю всё
            от меня зависящее чтобы исправить :)
          </p>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
