import { Input, List } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import api from './api';
import { IFacultyOld, IGroupOld } from './constants';

/** Name of fields in source data, to take label and value */
type Item = IFacultyOld | IGroupOld;
type Items = Item[];

type UniversalListProps = {
  title: string;
  items: Items;
  loading: boolean;
};

/**
 * Used for ListFaculties and ListGroups
 */
function UniversalListPL(props: UniversalListProps) {
  const { title, items, loading } = props;
  const [searchValue, setSearchValue] = useState('');
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
  };
  const itemsFiltred = items.filter((item) => {
    if ('Group' in item) return item.Group.match(new RegExp(searchValue, 'i'));
    if ('FacultyName' in item) {
      return item.FacultyName.match(new RegExp(searchValue, 'i'));
    }
    throw new Error('Unknown data format (ot IGroupOld nor IFacultyOld)');
  });
  return (
    <>
      <h2>{title}</h2>
      <Input.Search
        data-testid="input-search"
        onChange={handleSearch}
        placeholder="Начните вводить название..."
      />
      <br />
      <br />
      <List<Item>
        dataSource={itemsFiltred}
        loading={loading}
        bordered
        renderItem={(item) => {
          if ('Group' in item) {
            return (
              <List.Item key={item.IdGroup}>
                {item.hasSchedule || !item.hasOwnProperty('hasSchedule') ? (
                  <Link to={`${item.IdGroup}/`}>{item.Group}</Link>
                ) : (
                  <span style={{ opacity: 0.5 }}>{item.Group}</span>
                )}
              </List.Item>
            );
          } else if ('FacultyName' in item) {
            return (
              <List.Item key={item.IdFaculty}>
                <Link to={`${item.IdFaculty}/`}>{item.FacultyName}</Link>
              </List.Item>
            );
          } else {
            throw new Error(
              'Unknown data format (ot IGroupOld nor IFacultyOld)'
            );
          }
        }}
      />
    </>
  );
}

interface UniversalListContainerProps {
  promise: Promise<Items>;
  title: string;
}

function UniversalListContainer(props: UniversalListContainerProps) {
  const [items, setItems] = useState<Items>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    async function loadItems() {
      try {
        let items = await props.promise;
        setItems(items);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    loadItems();
  }, [props.promise]);

  return (
    <UniversalListPL title={props.title} items={items} loading={loading} />
  );
}

function ListFaculties() {
  if (document.location.search === '?throwError') {
    throw new Error('ListFaculties throw some error!!1');
  }

  return (
    <UniversalListContainer
      promise={api.getFaculties()}
      title="Список факультетов"
    />
  );
}

interface MatchParams {
  facultyId: string;
}

function ListGroups(props: RouteComponentProps<MatchParams>) {
  const facultyId = props.match.params.facultyId;
  return (
    <UniversalListContainer
      promise={api.getGroups(facultyId)}
      title="Список групп"
    />
  );
}

export { ListFaculties, ListGroups, UniversalListPL };
