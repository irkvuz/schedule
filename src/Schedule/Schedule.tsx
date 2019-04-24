import { message } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import api from '../api';
import { ITrimester, IScheduleOld } from '../constants';
import SelectGroup from '../SelectGroup';
import TabsWeekDays from './TabsWeekDays';
import TrimesterInfo from './TrimesterInfo';

export interface MatchParams {
  facultyId: string;
  groupId: string;
}

export interface Props extends RouteComponentProps<MatchParams> {}

export default function Schedule(props: Props) {
  const [trimester, setTrimester] = useState<ITrimester | undefined>(undefined);
  const [schedule, setSchedule] = useState<IScheduleOld>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [weekNumber, setWeekNumber] = useState<number>(0);

  const loadSchedule = async (facultyId: string, groupId: string) => {
    setLoading(true);
    try {
      localStorage.setItem('facultyId', facultyId);
      localStorage.setItem('groupId', groupId);

      const trimester = await api.getTrimester();

      const schedule = await api.getSchedule(groupId, trimester.IdTrimester);

      const week_number =
        moment().diff(moment(trimester.dateStart).startOf('week'), 'week') + 1;

      setWeekNumber(week_number);
      setTrimester(trimester);
      setSchedule(schedule);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSchedule([]);
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

  const { groupId, facultyId } = props.match.params;

  useEffect(() => {
    loadSchedule(facultyId, groupId);
  }, [facultyId, groupId]);

  const handleGroupChange = (value: string[], selectedOptions?: any) => {
    let [facultyId, groupId] = value;
    const url = `/${facultyId}/${groupId}`;
    props.history.push(url);
  };

  return (
    <>
      <div>
        <SelectGroup
          facultyId={facultyId}
          groupId={groupId}
          onChange={handleGroupChange}
        />
      </div>
      <div>{trimester && <TrimesterInfo trimester={trimester} />}</div>
      <div>
        <TabsWeekDays
          loading={loading}
          schedule={schedule}
          week_number={weekNumber}
        />
      </div>
    </>
  );
}
