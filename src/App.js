import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import TimeTable from './TimeTable/TimeTable';
import { ListFaculties, ListGroups } from './Lists';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Link to="/">Home</Link>
          <Switch>
            <Route
              path="/:facultyId(\d+)/:groupId(\d+)"
              component={TimeTable}
            />
            <Route path="/:facultyId(\d+)" component={ListGroups} />
            <Route path="/" component={ListFaculties} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
