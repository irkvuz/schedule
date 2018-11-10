import React from 'react';
import TabsWeekDays from './TabsWeekDays';
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
const api = require('../api');

class TimeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trimester: {},
      schedule: {},
      loading: false,
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      let res = await api.getTrimester();
      let trimester = res.data;
      console.log(trimester);
      const groupId = this.props.match.params.groupId;
      res = await api.getSchedule(groupId, trimester.IdTrimester);
      let schedule = res.data;
      this.setState({ trimester, schedule, loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };
  render() {
    const { groupId, facultyId } = this.props.match.params;
    return (
      <div>
        {this.state.schedule.length > 0 && (
          <TabsWeekDays
            loading={this.state.loading}
            schedule={this.state.schedule}
          />
        )}
      </div>
    );
  }
}

export default TimeTable;
