import React from 'react';
import { Link } from 'react-router-dom';
import List from 'antd/lib/list';

const api = require('./api');

class ListFaculties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faculties: [],
    };
  }
  componentDidMount = async () => {
    let res = await api['getFaculties']();
    let faculties = res.data;
    this.setState({ faculties });
  };
  render() {
    return (
      <div>
        <h2>List of faculties</h2>
        <List
          dataSource={this.state.faculties}
          bordered
          renderItem={f => (
            <List.Item key={f.IdFaculty}>
              <Link to={`${f.IdFaculty}/`}>{f.FacultyName}</Link>
            </List.Item>
          )}
        />
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
    this.setState({ groups });
  };
  render() {
    console.log(this.state.groups);
    return (
      <div>
        <h2>List of groups</h2>
        <List
          dataSource={this.state.groups}
          bordered
          renderItem={g => (
            <List.Item key={g.IdGroup}>
              <Link to={`${g.IdGroup}/`}>{g.Group}</Link>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export { ListFaculties, ListGroups };
