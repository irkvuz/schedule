import Input from 'antd/lib/input';
import List from 'antd/lib/list';
import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import api from './api';
import { IItem } from './constants';

/** Name of fields in source data, to take label and value */
type FieldNames = {
  label: string;
  value: string;
};

type UniversalListProps = {
  title: string;
  // @TODO Need to describe types
  items: IItem[];
  loading: boolean;
  fieldNames: FieldNames;
};

/**
 * Used for ListFaculties and ListGroups
 */
function UniversalList(props: UniversalListProps) {
  const { title, items, loading, fieldNames } = props;
  const [searchValue, setSearchValue] = useState('');
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchValue(searchValue);
  };
  const itemsFiltred = items.filter((item: any) =>
    item[fieldNames.label].match(new RegExp(searchValue, 'i'))
  );
  return (
    <>
      <h2>{title}</h2>
      <Input.Search
        onChange={handleSearch}
        placeholder="Начните вводить название..."
      />
      <br />
      <br />
      <List
        dataSource={itemsFiltred}
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

interface ListProps {
  promise: Promise<IItem[]>;
  title: string;
  fieldNames: FieldNames;
}

function MyList(props: ListProps) {
  const [items, setItems] = useState<IItem[]>([]);
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
    <UniversalList
      title={props.title}
      items={items}
      loading={loading}
      fieldNames={props.fieldNames}
    />
  );
}

function ListFaculties() {
  return (
    <MyList
      promise={api.getFaculties()}
      title="Список факультетов"
      fieldNames={{ label: 'FacultyName', value: 'IdFaculty' }}
    />
  );
}

interface MatchParams {
  facultyId: string;
}

function ListGroups(props: RouteComponentProps<MatchParams>) {
  const facultyId = props.match.params.facultyId;
  return (
    <MyList
      promise={api.getGroups(facultyId)}
      title="Список групп"
      fieldNames={{ label: 'Group', value: 'IdGroup' }}
    />
  );
}

export { ListFaculties, ListGroups };
