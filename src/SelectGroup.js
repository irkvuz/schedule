import React from 'react';
import { Cascader } from 'antd';
const api = require('./api');

class SelectGroup extends React.Component {
  state = {
    options: [],
  };

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  loadData = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    api.getGroups(targetOption.value).then(res => {
      let groups = JSON.parse(res.data.substr(1));
      targetOption.loading = false;
      targetOption.children = groups.map(g => ({
        label: g.Group,
        value: g.IdGroup,
      }));
      this.setState({
        options: [...this.state.options],
      });
    });
  };

  componentDidMount = async () => {
    let res = await api.getFaculties();
    let faculties = JSON.parse(res.data.substr(1));
    // console.log(faculties);
    let options = faculties.map(f => ({
      label: f.FacultyAbbr,
      value: f.IdFaculty,
      fullName: f.FacultyName,
      isLeaf: false,
    }));
    this.setState({ options });
  };

  render() {
    return (
      this.state.options.length > 0 && (
        <Cascader
          options={this.state.options}
          loadData={this.loadData}
          onChange={this.onChange}
          allowClear={false}
          size="large"
        />
      )
    );
  }
}

export default SelectGroup;
