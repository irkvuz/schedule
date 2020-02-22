import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import api from '../api';
import { IScheduleOld, ITrimester } from '../constants';
import SelectGroup from '../SelectGroup';
import { getWeekNumber } from './getWeekNumber';
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

  const loadSchedule = async (
    facultyId: string,
    groupId: string,
    trimester: ITrimester
  ) => {
    setLoading(true);
    try {
      localStorage.setItem('facultyId', facultyId);
      localStorage.setItem('groupId', groupId);

      const schedule = await api.getSchedule(groupId, trimester.IdTrimester);

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

  // Триместр загружаетс только один раз при componentDidMount
  useEffect(() => {
    async function loadTrimester() {
      try {
        const t = await api.getTrimester();
        if (t) {
          setTrimester(t);
          setWeekNumber(getWeekNumber(t.dateStart));
        }
      } catch (error) {}
    }
    loadTrimester();
  }, []);

  useEffect(() => {
    if (trimester) loadSchedule(facultyId, groupId, trimester);
  }, [facultyId, groupId, trimester]);

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
