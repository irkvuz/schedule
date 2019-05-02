import { LocaleProvider, Menu } from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import { Action, createBrowserHistory, Location } from 'history';
import 'moment/locale/ru';
import React from 'react';
import { Link, Redirect, Route, Router, Switch } from 'react-router-dom';
import ym, { YMInitializer } from 'react-yandex-metrika';
import { ListFaculties, ListGroups } from './Lists';
import Schedule from './Schedule/Schedule';

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
      <LocaleProvider locale={ru_RU}>
        <Router history={browserHistory}>
          <>
            <header>
              <Menu mode="horizontal" theme="dark">
                <Menu.Item>
                  <Link to="/faculties">Расписание БГУ</Link>
                </Menu.Item>
                {/* <Menu.Item>
                  <Link to="/about">Об авторе</Link>
                </Menu.Item> */}
              </Menu>
            </header>

            <div className="content-wrapper">
              <Switch>
                <Route
                  path="/:facultyId(\d+)/:groupId(\d+)"
                  component={Schedule}
                />
                <Route path="/:facultyId(\d+)" component={ListGroups} />
                <Route path="/faculties" component={ListFaculties} />
                <Route
                  path="/"
                  render={(props: any) => {
                    const facultyId = localStorage['facultyId'];
                    const groupId = localStorage['groupId'];
                    const postfix = props.location.search + props.location.hash;
                    if (facultyId && groupId)
                      return (
                        <Redirect to={`/${facultyId}/${groupId}${postfix}`} />
                      );
                    else return <Redirect to={'/faculties' + postfix} />;
                  }}
                />
              </Switch>
            </div>

            <footer>
              Сделано с ❤{' '}
              <a
                href="https://vk.com/savinyurii"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => {
                  if (isProduction) ym('reachGoal', 'click_vk');
                }}
              >
                в Иркутске
              </a>
            </footer>
          </>
        </Router>
      </LocaleProvider>
    </>
  );
}
