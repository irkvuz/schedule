import React from 'react';
import { Link } from 'react-router-dom';
import List from 'antd/lib/list';
import Input from 'antd/lib/input';

const api = require('./api');

/**
 * Used for ListFaculties and ListGroups
 *
 * @param {*} props
 * @returns
 */
class UniversalList extends React.Component {
  state = {
    searchValue: '',
  };
  handleSearch = e => {
    const searchValue = e.target.value;
    this.setState({ searchValue });
  };
  render() {
    const { title, dataSource, loading, fieldNames } = this.props;
    const filtredDataSource = dataSource.filter(i =>
      i[fieldNames.label].match(new RegExp(this.state.searchValue, 'i'))
    );
    return (
      <div>
        <h2>{title}</h2>
        <Input.Search onChange={this.handleSearch} />
        <br />
        <br />
        <List
          dataSource={filtredDataSource}
          loading={loading}
          bordered
          renderItem={i => (
            <List.Item key={i[fieldNames.value]}>
              <Link to={`${i[fieldNames.value]}/`}>{i[fieldNames.label]}</Link>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

class ListFaculties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faculties: [],
      loading: false,
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      let res = await api.getFaculties();
      let faculties = res.data;
      this.setState({ faculties, loading: false });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  };
  render() {
    return (
      <UniversalList
        title="Список факультетов"
        dataSource={this.state.faculties}
        loading={this.state.loading}
        fieldNames={{ label: 'FacultyName', value: 'IdFaculty' }}
      />
    );
  }
}

class ListGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      loading: false,
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      let res = await api.getGroups(this.props.match.params.facultyId);
      let groups = res.data;
      this.setState({ groups, loading: false });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  };
  render() {
    console.log(this.state.groups);
    return (
      <UniversalList
        title="Список групп"
        dataSource={this.state.groups}
        loading={this.state.loading}
        fieldNames={{ label: 'Group', value: 'IdGroup' }}
      />
    );
  }
}

export { ListFaculties, ListGroups };
