import React from "react";
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
const api = require('./api');


class TimeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trimester: {},
      schedule: {}
    }
  }
  componentDidMount = async () => {
    let res = await api.getTrimester();
    let trimester = JSON.parse(res.data.substr(1))[0];
    console.log(trimester);
    res = await api.getSchedule(this.props.match.params.groupId, trimester.IdTrimester);
    let schedule = JSON.parse(res.data.substr(1));
    this.setState({ trimester, schedule });
  }
  render() {
    const { groupId, facultyId } = this.props.match.params;
    return (
      <div>
        There will be timetable of group {groupId} (faculty {facultyId})
        for {this.state.trimester.uYear}
        <div>
          <pre>{JSON.stringify(this.state.schedule, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

export default TimeTable;