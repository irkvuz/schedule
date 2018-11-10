import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import TimeTable from './TimeTable/TimeTable';
import { ListFaculties, ListGroups } from './Lists';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <h1>Schedule of Baikal State University</h1>
          <Link to="/bgu/">Home</Link>
          <Switch>
            <Route
              path="/bgu/:facultyId(\d+)/:groupId(\d+)"
              component={TimeTable}
            />
            <Route path="/bgu/:facultyId(\d+)" component={ListGroups} />
            <Route path="/bgu/" component={ListFaculties} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
