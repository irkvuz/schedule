import { Cascader, Spin } from 'antd';
import {
  CascaderOptionType,
  FilledFieldNamesType,
  CascaderValueType,
} from 'antd/lib/cascader';
import React, { useEffect, useState } from 'react';
import api from './api';
import { IFacultyWithGroups } from './constants';
import { MatchParams } from './Schedule/Schedule';
export interface Props extends MatchParams {
  onChange: (
    value: CascaderValueType,
    selectedOptions?: CascaderOptionType[]
  ) => void;
}

function SelectGroup(props: Props) {
  const [options, setOptions] = useState<IFacultyWithGroups[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    api
      .getFacultiesWithGroups()
      .then((facultiesWithGroups) => {
        setLoading(false);
        setOptions(facultiesWithGroups);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const filter = (
    inputValue: string,
    path: CascaderOptionType[],
    names: FilledFieldNamesType
  ) => {
    return path.some((option) => {
      return option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    });
  };

  if (loading) return <Spin />;
  if (options.length === 0) return <div>Options empty</div>;
  return (
    <Cascader
      options={options}
      onChange={props.onChange}
      allowClear={false}
      size="large"
      defaultValue={[props.facultyId, props.groupId]}
      fieldNames={{ label: 'name', value: 'id', children: 'groups' }}
      showSearch={{ filter: filter }}
    />
  );
}

export default SelectGroup;
