import React, { useEffect, useState } from 'react';
import Cascader, {
  CascaderOptionType,
  FilledFieldNamesType,
} from 'antd/lib/cascader';
import api from './api';
import { MatchParams } from './Schedule/Schedule';
import { Spin } from 'antd';

interface IGroup {
  id: string;
  name: string;
}

interface IFaculty extends IGroup {
  fullName: string;
  groups: IGroup[];
}

export interface Props extends MatchParams {
  onChange: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
}

function SelectGroup(props: Props) {
  const [options, setOptions] = useState<IFaculty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    api
      .getFacultiesWithGroups()
      .then(res => {
        setLoading(false);
        let options: IFaculty[] = res.data;
        // TODO Это конечно костыль, но что поделаешь? По крайне мере так работает
        // потому что Cascader ожидает, что id будет строкой
        options = options.map((faculty: IFaculty) => {
          return {
            ...faculty,
            id: faculty.id.toString(),
            groups: faculty.groups.map((group: IGroup) => ({
              ...group,
              id: group.id.toString(),
            })),
          };
        });
        setOptions(options);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const filter = (
    inputValue: string,
    path: CascaderOptionType[],
    names: FilledFieldNamesType
  ) => {
    return path.some(option => option.name.match(new RegExp(inputValue, 'i')));
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
      /**
       * @TODO Need to enable search only for desktop
       * @body On mobile search looks awful and speed down UX
       */
      // showSearch={{ filter: this.filter }}
    />
  );
}

export default SelectGroup;
