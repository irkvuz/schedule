import React from "react";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
const api = require('./api')

function ListFaculties(props) {
  return (
    <div>
      <h2>List of faculties</h2>
      <ul>
        <li>
          <Link to="/1">Faculty 1</Link>
        </li>
        <li>
          <Link to="/2">Faculty 2</Link>
        </li>
      </ul>
    </div>
  );
}

function ListGroups(props) {
  console.log(props.match);
  const facultyId = props.match.params.facultyId;
  return (
    <div>
      <h2>Groups of faculty {facultyId}</h2>
      <ul>
        <li>
          <Link to={`/${facultyId}/10001`}>Group 1001</Link>
        </li>
        <li>
          <Link to={`/${facultyId}/10002`}>Group 1002</Link>
        </li>
      </ul>
    </div>
  );
}
function TimeTable(props) {
  const { groupId, facultyId } = props.match.params;
  return (
    <div>
      There will be timetable of group {groupId} (faculty {facultyId})
    </div>
  );
}

class App extends React.Component {
  componentDidMount = async () => {
    let res = await api.getFaculties();
    console.log(JSON.parse(res.data.substr(1)))
  }
  render() {
    return (
      <Router>
        <div>
          <h1>Title</h1>
          <Link to="/">Home</Link>
          <Switch>
            <Route path="/:facultyId/:groupId" component={TimeTable} />
            <Route path="/:facultyId(\d+)" component={ListGroups} />
            <Route path="/" component={ListFaculties} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
