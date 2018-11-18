import React from 'react';
import TabsWeekDays from './TabsWeekDays';
import moment from 'moment';
import { Spin } from 'antd';
// import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
const api = require('../api');

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trimester: {},
      schedule: {},
      loading: false,
      week_n: 1,
      week_t: 0,
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      let res = await api.getTrimester();
      let trimester = res.data;
      trimester.dateStart = moment(trimester.dateStart);
      trimester.dateFinish = moment(trimester.dateFinish);
      let week_n = moment().diff(trimester.dateStart, 'week') + 1;
      let week_t = trimester.dateFinish.diff(trimester.dateStart, 'week');
      const groupId = this.props.match.params.groupId;
      res = await api.getSchedule(groupId, trimester.IdTrimester);
      let schedule = res.data;
      this.setState({ trimester, schedule, loading: false, week_n, week_t });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };
  render() {
    console.log('Component `Schedule` props =', this.props);
    // const { groupId, facultyId } = this.props.match.params;
    return (
      <div>
        {this.state.schedule.length > 0 ? (
          <TabsWeekDays
            schedule={this.state.schedule}
            week_n={this.state.week_n}
            week_t={this.state.week_t}
          />
        ) : (
          <Spin />
        )}
      </div>
    );
  }
}

export default Schedule;
