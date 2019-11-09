import Menu from 'antd/lib/menu';
import React from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import ym from 'react-yandex-metrika';
import { ListFaculties, ListGroups } from './Lists';
import Schedule from './Schedule/Schedule';

type Props = {
  isProduction: boolean;
};

export const Main: React.FC<Props> = ({ isProduction }) => {
  return (
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
          <Route path="/:facultyId(\d+)/:groupId(\d+)" component={Schedule} />
          <Route path="/:facultyId(\d+)" component={ListGroups} />
          <Route path="/faculties" component={ListFaculties} />
          <Route
            path="/"
            render={(props: any) => {
              const facultyId = localStorage['facultyId'];
              const groupId = localStorage['groupId'];
              const postfix = props.location.search + props.location.hash;
              if (facultyId && groupId) {
                return <Redirect to={`/${facultyId}/${groupId}${postfix}`} />;
              } else return <Redirect to={'/faculties' + postfix} />;
            }}
          />
        </Switch>
      </div>

      <footer>
        Сделано с ❤{' '}
        <a
          href="https://vk.com/irkvuz"
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
  );
};
