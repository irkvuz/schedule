import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import List from 'antd/lib/list';
import Input from 'antd/lib/input';
import api from './api';
import { IItem } from './constants';

type UniversalListProps = {
  title: string;
  // @TODO Need to describe types
  dataSource: any;
  loading: boolean;
  fieldNames: {
    label: string;
    value: string;
  };
};

/**
 * Used for ListFaculties and ListGroups
 */
function UniversalList(props: UniversalListProps) {
  const { title, dataSource, loading, fieldNames } = props;
  const [searchValue, setSearchValue] = useState('');
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
  };
  const filtredDataSource = dataSource.filter((item: any) =>
    item[fieldNames.label].match(new RegExp(searchValue, 'i'))
  );
  return (
    <>
      <h2>{title}</h2>
      <Input.Search
        onChange={handleSearch}
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
            {item.hasSchedule || !item.hasOwnProperty('hasSchedule') ? (
              <Link to={`${item[fieldNames.value]}/`}>
                {item[fieldNames.label]}
              </Link>
            ) : (
              <span style={{ opacity: 0.5 }}>{item[fieldNames.label]}</span>
            )}
          </List.Item>
        )}
      />
    </>
  );
}

interface MatchParams {
  facultyId: string;
}

interface ListProps extends RouteComponentProps<MatchParams> {
  type?: 'faculties' | 'groups';
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
  promise?: Promise<IItem[]>;
  title = '';
  fieldNames = { label: '', value: '' };

  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      let items = await this.promise;
      if (items) this.setState({ items, loading: false });
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
    const facultyId = this.props.match.params.facultyId;

    this.promise = api.getGroups(facultyId);
    this.title = 'Список групп';
    this.fieldNames = { label: 'Group', value: 'IdGroup' };
  }
}

export { ListFaculties, ListGroups, MyList };
