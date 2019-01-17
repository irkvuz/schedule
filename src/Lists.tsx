import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import List from 'antd/lib/list';
import Input from 'antd/lib/input';
import api from './api';

/**
 * Used for ListFaculties and ListGroups
 *
 * @param {*} props
 * @returns
 */
class UniversalList extends React.Component<any, any> {
  state = {
    searchValue: '',
  };
  handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    this.setState({ searchValue });
  };
  render() {
    const { title, dataSource, loading, fieldNames } = this.props;
    const filtredDataSource = dataSource.filter((item: any) =>
      item[fieldNames.label].match(new RegExp(this.state.searchValue, 'i'))
    );
    return (
      <>
        <h2>{title}</h2>
        <Input.Search
          onChange={this.handleSearch}
          placeholder="Начните вводить название..."
        />
        {/* @TODO remove br, use css instead */}
        <br />
        <br />
        <List
          dataSource={filtredDataSource}
          loading={loading}
          bordered
          renderItem={(item: any) => (
            <List.Item key={item[fieldNames.value]}>
              <Link to={`${item[fieldNames.value]}/`}>
                {item[fieldNames.label]}
              </Link>
            </List.Item>
          )}
        />
      </>
    );
  }
}

interface ListProps extends RouteComponentProps {
  type: 'faculties' | 'groups';
}

type ListState = {
  items: any[];
  loading: boolean;
};

class MyList extends React.Component<ListProps, ListState> {
  state = {
    items: [],
    loading: false,
  };
  promise: Promise<any> | null = null;
  title = '';
  fieldNames = { label: '', value: '' };

  // constructor(props: ListProps) {
  //   super(props);
  //   if (this.props.type === 'faculties') {
  //     this.promise = api.getFaculties();
  //     this.title = 'Список факультетов';
  //     this.fieldNames = { label: 'FacultyName', value: 'IdFaculty' };
  //   } else if (this.props.type === 'groups') {
  //     this.promise = api.getGroups(36);
  //     this.title = 'Список групп';
  //     this.fieldNames = { label: 'Group', value: 'IdGroup' };
  //   }
  //   console.log('type=', props.type, this.props.type);
  // }

  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      let res = await this.promise;
      let items = res.data;
      this.setState({ items, loading: false });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <UniversalList
        title={this.title}
        dataSource={this.state.items}
        loading={this.state.loading}
        fieldNames={this.fieldNames}
      />
    );
  }
}

class ListFaculties extends MyList {
  constructor(props: any) {
    super(props);
    this.promise = api.getFaculties();
    this.title = 'Список факультетов';
    this.fieldNames = { label: 'FacultyName', value: 'IdFaculty' };
  }
}

class ListGroups extends MyList {
  constructor(props: any) {
    super(props);
    this.promise = api.getGroups(36);
    this.title = 'Список групп';
    this.fieldNames = { label: 'Group', value: 'IdGroup' };
  }
}

export { ListFaculties, ListGroups, MyList };
