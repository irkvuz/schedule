import { message } from 'antd';
import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import api from '../api';
import { ILessonOld, ITrimester } from '../constants';
import SelectGroup from '../SelectGroup';
import TabsWeekDays from './TabsWeekDays';
import TrimesterInfo from './TrimesterInfo';

export interface MatchParams {
  facultyId: string;
  groupId: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}

export interface State {
  loading: boolean;
  trimester?: ITrimester;
  schedule: ILessonOld[];
  week_number: number;
}
class Schedule extends React.Component<Props, State> {
  state: State = {
    trimester: undefined,
    schedule: [],
    loading: false,
    week_number: 0,
  };

  loadSchedule = async (facultyId: string, groupId: string) => {
    this.setState({ loading: true });
    try {
      localStorage.setItem('facultyId', facultyId);
      localStorage.setItem('groupId', groupId);

      const trimester = await api.getTrimester();

      const schedule = await api.getSchedule(groupId, trimester.IdTrimester);

      const week_number =
        moment().diff(moment(trimester.dateStart).startOf('week'), 'week') + 1;

      this.setState({
        trimester,
        schedule,
        loading: false,
        week_number,
      });
    } catch (error) {
      this.setState({ loading: false, schedule: [] });
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        message.error('Нет соединения');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
  };

  componentDidMount = () => {
    const facultyId = this.props.match.params.facultyId;
    const groupId = this.props.match.params.groupId;

    this.loadSchedule(facultyId, groupId);
  };

  componentWillReceiveProps = () => {
    // это нужно чтобы расписание обновилось, когда изменится группа чрез каскадер
    // т.к. компонент при этом не перемонтируется и componentDidMount не вызывается
    const facultyId = this.props.match.params.facultyId;
    const groupId = this.props.match.params.groupId;

    this.loadSchedule(facultyId, groupId);
  };

  handleGroupChange = (value: string[], selectedOptions?: any) => {
    let [facultyId, groupId] = value;
    const url = `/${facultyId}/${groupId}`;
    this.props.history.push(url);
  };

  render() {
    // console.log('Component `Schedule` props =', this.props);
    const { groupId, facultyId } = this.props.match.params;

    return (
      <>
        <div>
          <SelectGroup
            facultyId={facultyId}
            groupId={groupId}
            onChange={this.handleGroupChange}
          />
        </div>
        <div>
          {this.state.trimester && (
            <TrimesterInfo trimester={this.state.trimester} />
          )}
        </div>
        <div>
          <TabsWeekDays
            loading={this.state.loading}
            schedule={this.state.schedule}
            week_number={this.state.week_number}
          />
        </div>
      </>
    );
  }
}

export default Schedule;
