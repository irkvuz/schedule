import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Schedule from './Schedule/Schedule';
import { ListFaculties, ListGroups } from './Lists';
import { LocaleProvider, Icon } from 'antd';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import 'moment/locale/ru';

class App extends React.Component {
  render() {
    return (
      <LocaleProvider locale={ru_RU}>
        <Router>
          <>
            <header>
              <Link to="/">
                <Icon type="home" />
              </Link>
            </header>

            <Switch>
              <Route
                path="/:facultyId(\d+)/:groupId(\d+)"
                component={Schedule}
              />
              <Route path="/:facultyId(\d+)" component={ListGroups} />
              <Route path="/" component={ListFaculties} />
            </Switch>

            <footer>© Yury Savin, Irkutsk 2018</footer>
          </>
        </Router>
      </LocaleProvider>
    );
  }
}

export default App;
