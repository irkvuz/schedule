import React from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import Schedule from './Schedule/Schedule';
import { ListFaculties, ListGroups } from './Lists';
import { LocaleProvider, Icon } from 'antd';
import ym, { YMInitializer } from 'react-yandex-metrika';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import 'moment/locale/ru';

class App extends React.Component {
  render() {
    console.log('App component rendered');

    return (
      <>
        <LocaleProvider locale={ru_RU}>
          <BrowserRouter>
            <>
              <header>
                <Link to="/faculties" title="Изменить группу">
                  <Icon type="home" />
                </Link>
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
                    render={() => {
                      let facultyId = localStorage['facultyId'],
                        groupId = localStorage['groupId'];
                      if (facultyId && groupId)
                        return <Redirect to={`/${facultyId}/${groupId}`} />;
                      else return <Redirect to="/faculties" />;
                    }}
                  />
                </Switch>
              </div>

              <footer>
                Сделано с ❤{' '}
                <a
                  href="https://vk.com/savinyurii"
                  target="_blank"
                  onClick={event => {
                    console.log('VK clicked', event);
                    if (process.env.NODE_ENV === 'production')
                      ym('reachGoal', 'click_vk');
                  }}
                >
                  в Иркутске
                </a>
              </footer>
            </>
          </BrowserRouter>
        </LocaleProvider>
        {process.env.NODE_ENV === 'production' && (
          <YMInitializer
            accounts={[50381566]}
            options={{
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
            }}
            version="2"
          />
        )}
      </>
    );
  }
}

export default App;
