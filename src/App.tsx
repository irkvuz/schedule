import { ConfigProvider } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { Action, createBrowserHistory, Location } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import ym, { YMInitializer } from 'react-yandex-metrika';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Main } from './Main';
import { reachGoal } from './utils/customYandexMetrika';

const isProduction = process.env.NODE_ENV === 'production';

/** Detects if device is on iOS */
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
};
/** Detects if device is in standalone mode */
const isInStandaloneMode = (): boolean => {
  const nav: any = window.navigator;
  return nav.standalone;
};

if (isIos() && isInStandaloneMode()) {
  setTimeout(()=>{
     reachGoal('standalone');
  }, 5*1000);
}

const browserHistory = createBrowserHistory();

browserHistory.listen((location: Location, action: Action) => {
  const url = location.pathname + location.search + location.hash;
  if (isProduction) ym('hit', url);
});

export default function App() {
  return (
    <ErrorBoundary>
      {/* счетчик нужно инициализировать в начале а не в конце, иначе возникает ошибка при редиректе */}
      {isProduction && (
        <YMInitializer
          accounts={[50381566]}
          options={{
            clickmap: true,
            trackLinks: true,
            webvisor: true,
          }}
          version="2"
        />
      )}
      <ConfigProvider locale={ru_RU}>
        <Router history={browserHistory}>
          <Main />
        </Router>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
