import { ConfigProvider } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import { Action, createBrowserHistory, Location } from 'history';
import { Main } from 'Main';
import moment from 'moment';
import 'moment/locale/ru';
import React from 'react';
import { Router } from 'react-router-dom';
import ym, { YMInitializer } from 'react-yandex-metrika';

moment.locale('ru');

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
  if (isProduction) ym('reachGoal', 'standalone');
}

const browserHistory = createBrowserHistory();

browserHistory.listen((location: Location, action: Action) => {
  const url = location.pathname + location.search + location.hash;
  if (isProduction) ym('hit', url);
});

export default function App() {
  return (
    <>
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
          <Main isProduction={isProduction} />
        </Router>
      </ConfigProvider>
    </>
  );
}
