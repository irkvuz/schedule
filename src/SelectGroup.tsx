import React from 'react';
import Cascader, {
  CascaderOptionType,
  FilledFieldNamesType,
} from 'antd/lib/cascader';
import api from './api';

interface IGroup {
  id: number;
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
    console.log('SelectGroup props=', this.props);
    const { groupId, facultyId } = this.props;
    return (
      this.state.options.length > 0 && (
        <Cascader
          options={this.state.options}
          onChange={this.props.onChange}
          allowClear={false}
          size="large"
          // @TODO надо как то переделать, чтобы это работало. Сейчас он на вход ожидает строки, а у меня структура предполагает id:number
          defaultValue={[facultyId, groupId]}
          fieldNames={{ label: 'name', value: 'id', children: 'groups' }}
          showSearch={{ filter: this.filter }}
        />
      )
    );
  }
}

export default SelectGroup;
