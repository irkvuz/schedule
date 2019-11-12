// import { message, notification } from 'antd';
import * as Sentry from '@sentry/browser';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://d8656cdb1f434597aecff05537459326@sentry.io/1537635',
    release: process.env.REACT_APP_VERSION,
  });
}

ReactDOM.render(<App />, document.getElementById('root'));

// const config = {
//   onSuccess: (registration: ServiceWorkerRegistration) => {
//     message.success('Offline ready', 1);
//   },
//   onUpdate: (registration: ServiceWorkerRegistration) => {
//     notification.success({
//       message: 'Доступно обновление',
//       description: 'Нажмите на это уведомление, чтобы обновить приложение',
//       placement: 'bottomRight',
//       onClick: () => window.location.reload(true),
//     });
//   },
// };
// serviceWorker.register(config);
serviceWorker.unregister();
