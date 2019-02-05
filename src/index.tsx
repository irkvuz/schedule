import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { message, notification } from 'antd';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
const config = {
  onSuccess: (registration: ServiceWorkerRegistration) => {
    message.success('Offline ready', 1);
  },
  onUpdate: (registration: ServiceWorkerRegistration) => {
    notification.success({
      message: 'Доступно обновление',
      description: 'Нажмите на это уведомление, чтобы обновить приложение',
      placement: 'bottomRight',
      onClick: () => window.location.reload(true),
    });
  },
};
serviceWorker.register(config);
