import { Cascader } from 'antd';
import {
  CascaderOptionType, CascaderValueType, FilledFieldNamesType
} from 'antd/lib/cascader';
import React from 'react';
import { IFacultyWithGroups } from './constants';
import { MatchParams } from './Schedule/Schedule';
export interface Props extends MatchParams {
  facultiesWithGroups: IFacultyWithGroups[],
  onChange: (
    value: CascaderValueType,
    selectedOptions?: CascaderOptionType[]
  ) => void;
}

function SelectGroup(props: Props) {

  const filter = (
    inputValue: string,
    path: CascaderOptionType[],
    names: FilledFieldNamesType
  ) => {
    return path.some((option) => {
      return option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
    });
  };

  return (
    <Cascader
      options={props.facultiesWithGroups}
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
