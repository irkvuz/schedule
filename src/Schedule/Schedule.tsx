import React from 'react';
import TabsWeekDays from './TabsWeekDays';
import { message } from 'antd';
import SelectGroup from '../SelectGroup';
import api from '../api';
import { RouteComponentProps } from 'react-router';

export interface MatchParams {
  facultyId: string;
  groupId: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}

export interface State {}
class Schedule extends React.Component<Props, State> {
  state = {
    trimester: undefined,
    schedule: [],
    loading: false,
  };

  loadSchedule = async (facultyId: string, groupId: string) => {
    this.setState({ loading: true });
    try {
      localStorage.setItem('facultyId', facultyId);
      localStorage.setItem('groupId', groupId);

      const trimester = await api.getTrimester();

      const schedule = await api.getSchedule(groupId, trimester.IdTrimester);
      this.setState({
        trimester,
        schedule,
        loading: false,
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
          <TabsWeekDays
            loading={this.state.loading}
            schedule={this.state.schedule}
            trimester={this.state.trimester}
          />
        </div>
      </>
    );
  }
}

export default Schedule;
