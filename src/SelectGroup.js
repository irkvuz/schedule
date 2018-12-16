import React from 'react';
import { Cascader } from 'antd';
const api = require('./api');

class SelectGroup extends React.Component {
  state = {
    options: [],
  };

  componentDidMount = async () => {
    try {
      let res = await api.getFacultiesWithGroups();
      let options = res.data;
      this.setState({ options });
    } catch (error) {
      console.log(error);
    }
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
          defaultValue={[parseInt(facultyId), parseInt(groupId)]}
          fieldNames={{ label: 'name', value: 'id', children: 'groups' }}
        />
      )
    );
  }
}

export default SelectGroup;
