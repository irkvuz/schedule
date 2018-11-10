import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import TimeTable from './TimeTable';

const api = require('./api');

class ListFaculties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faculties: [],
    };
  }
  componentDidMount = async () => {
    let res = await api.getFaculties();
    let faculties = res.data;
    // console.log(faculties)
    this.setState({ faculties });
  };
  render() {
    const listItems = this.state.faculties.map(f => (
      <li key={f.IdFaculty}>
        <Link to={`${f.IdFaculty}/`}>{f.FacultyName}</Link>
      </li>
    ));
    return (
      <div>
        <h2>List of faculties</h2>
        <ul>{listItems}</ul>
      </div>
    );
  }
}

class ListGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
    };
  }
  componentDidMount = async () => {
    let res = await api.getGroups(this.props.match.params.facultyId);
    let groups = res.data;
    // console.log(groups)
    this.setState({ groups });
  };
  render() {
    const facultyId = this.props.match.params.facultyId;
    const listItems = this.state.groups.map(f => (
      <li key={f.IdGroup}>
        <Link to={`${f.IdGroup}/`}>{f.Group}</Link>
      </li>
    ));
    return (
      <div>
        <h2>Groups of faculty {facultyId}</h2>
        <ul>{listItems}</ul>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <h1>Title</h1>
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
