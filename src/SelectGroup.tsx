import { Cascader, Spin } from 'antd';
import { CascaderOptionType, FilledFieldNamesType } from 'antd/lib/cascader';
import React, { useEffect, useState } from 'react';
import api from './api';
import { IFacultyWithGroups } from './constants';
import { MatchParams } from './Schedule/Schedule';
export interface Props extends MatchParams {
  onChange: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
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
        // TODO Это конечно костыль, но что поделаешь? По крайне мере так работает
        // потому что Cascader ожидает, что id будет строкой
        let convertedFacultiesWithGroups = facultiesWithGroups.map(
          (faculty) => {
            return {
              ...faculty,
              id: faculty.id.toString(),
              groups: faculty.groups.map((group) => ({
                ...group,
                id: group.id.toString(),
              })),
            };
          }
        );
        setOptions(convertedFacultiesWithGroups);
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
