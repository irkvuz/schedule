import React from 'react';
import Cascader, {
  CascaderOptionType,
  FilledFieldNamesType,
} from 'antd/lib/cascader';
import api from './api';

interface IGroup {
  id: string;
  name: string;
}

interface IFaculty extends IGroup {
  fullName: string;
  groups: IGroup[];
}

interface SelectGroupState {
  options: IFaculty[];
}

class SelectGroup extends React.Component<any, SelectGroupState> {
  state = {
    options: [],
  };

  componentDidMount = async () => {
    try {
      let res = await api.getFacultiesWithGroups();
      let options: IFaculty[] = res.data;
      // TODO Это конечно костыль, но что поделаешь? По крайне мере так работает
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
      this.setState({ options });
    } catch (error) {
      console.log(error);
    }
  };

  filter = (
    inputValue: string,
    path: CascaderOptionType[],
    names: FilledFieldNamesType
  ) => {
    return path.some(option => option.name.match(new RegExp(inputValue, 'i')));
  };

  render() {
    // console.log('SelectGroup props=', this.props);
    const { groupId, facultyId } = this.props;
    return (
      this.state.options.length > 0 && (
        <Cascader
          options={this.state.options}
          onChange={this.props.onChange}
          allowClear={false}
          size="large"
          defaultValue={[facultyId, groupId]}
          fieldNames={{ label: 'name', value: 'id', children: 'groups' }}
          /**
           * @TODO Need to enable search only for desktop
           * @body On mobile search looks awful and speed down UX
           */
          // showSearch={{ filter: this.filter }}
        />
      )
    );
  }
}

export default SelectGroup;
