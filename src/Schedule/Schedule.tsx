import React from 'react';
import TabsWeekDays, { ILessonOld } from './TabsWeekDays';
import moment from 'moment';
import { Spin } from 'antd';
import SelectGroup from '../SelectGroup';
import api from '../api';
import ym from 'react-yandex-metrika';

type ScheduleProps = any;

interface ScheduleState {}
class Schedule extends React.Component<ScheduleProps, ScheduleState> {
  state = {
    trimester: {},
    schedule: [],
    loading: false,
    week_number: 1,
    week_total: 0,
  };

  constructor(props: ScheduleProps) {
    super(props);
    console.log('Schedule constructor');
  }

  loadSchedule = async () => {
    localStorage.setItem('groupId', this.props.match.params.groupId);
    localStorage.setItem('facultyId', this.props.match.params.facultyId);
    this.setState({ loading: true });
    try {
      let res = await api.getTrimester();
      let trimester = res.data;
      trimester.dateStart = moment(trimester.dateStart);
      trimester.dateFinish = moment(trimester.dateFinish);
      let week_number =
        moment().diff(trimester.dateStart.startOf('week'), 'week') + 1;
      let week_total = trimester.dateFinish.diff(trimester.dateStart, 'week');
      const groupId = this.props.match.params.groupId;
      res = await api.getSchedule(groupId, trimester.IdTrimester);
      let schedule: ILessonOld[] = res.data;
      this.setState({
        trimester,
        schedule,
        loading: false,
        week_number,
        week_total,
      });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  componentDidMount = () => {
    this.loadSchedule();
  };

  handleGroupChange = (value: string[], selectedOptions?: any) => {
    let [facultyId, groupId] = value;
    const url = `/${facultyId}/${groupId}`;
    this.props.history.push(url);
    if (process.env.NODE_ENV === 'production') ym('hit', url);
    this.loadSchedule();
  };

  render() {
    console.log('Component `Schedule` props =', this.props);
    const { groupId, facultyId } = this.props.match.params;
    return (
      <div>
        <SelectGroup
          facultyId={facultyId}
          groupId={groupId}
          onChange={this.handleGroupChange}
        />
        {this.state.loading ? (
          <Spin />
        ) : (
          <TabsWeekDays
            schedule={this.state.schedule}
            week_number={this.state.week_number}
            week_total={this.state.week_total}
          />
        )}
      </div>
    );
  }
}

export default Schedule;
