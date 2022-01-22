import { message } from 'antd';
import { CascaderValueType } from 'antd/lib/cascader';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import api from '../api';
import { IFacultyWithGroups, IScheduleOld, ITrimesterOld } from '../constants';
import SelectGroup from '../SelectGroup';
import { reachGoal } from '../utils/customYandexMetrika';
import { getTrimesterInfo } from '../utils/getTrimesterInfo';
import TabsWeekDays from './TabsWeekDays';
import TrimesterInfo from './TrimesterInfo';

export interface MatchParams {
  facultyId: string;
  groupId: string;
}

export interface Props extends RouteComponentProps<MatchParams> {
  today: Date;
}

export default function Schedule(props: Props) {
  const [trimesters, setTrimesters] = useState<ITrimesterOld[]>([]);
  const [trimesterId, setTrimesterId] = useState<number>();
  const [schedule, setSchedule] = useState<IScheduleOld>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [facultiesWithGroups, setFacultiesWithGroups] = useState<
    IFacultyWithGroups[]
  >([]);

  const loadSchedule = async (
    facultyId: string,
    groupId: string,
    trimesterId: number
  ) => {
    setLoading(true);
    try {
      localStorage.setItem('facultyId', facultyId);
      localStorage.setItem('groupId', groupId);

      const schedule = await api.getSchedule(groupId, trimesterId);

      setSchedule(schedule);
      setLoading(false);
    } catch (error: any) {
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

  // for facultiesWithGroups and trimesters
  useEffect(() => {
    api.getFacultiesWithGroups().then((facultiesWithGroups) => {
      setFacultiesWithGroups(facultiesWithGroups);
    });
    api.getTrimesters().then((trimesters) => {
      setTrimesters(trimesters);
    });
  }, []);

  useEffect(() => {
    if (trimesterId) loadSchedule(facultyId, groupId, trimesterId);
  }, [facultyId, groupId, trimesterId]);

  useEffect(() => {
    const faculty = facultiesWithGroups.find((f) => f.id === facultyId);
    const group = faculty?.groups.find((g) => g.id === groupId);
    const trimesterId = group?.trimesterId;
    setTrimesterId(trimesterId);
  }, [facultiesWithGroups, trimesters, facultyId, groupId]);

  const handleGroupChange = (
    value: CascaderValueType,
    selectedOptions?: any
  ) => {
    let [facultyId, groupId] = value;
    const url = `/${facultyId}/${groupId}`;
    props.history.push(url);
    reachGoal('change_group_cascader');
  };

  const trimester = trimesters.find((t) => t.IdTrimester === trimesterId); // TODO
  const trimesterInfo = trimester
    ? getTrimesterInfo(trimester, props.today)
    : undefined;

  return (
    <>
      <div>
        <SelectGroup
          facultiesWithGroups={facultiesWithGroups}
          facultyId={facultyId}
          groupId={groupId}
          onChange={handleGroupChange}
        />
      </div>
      <div>
        {trimesterInfo && (
          <TrimesterInfo trimesterInfo={trimesterInfo} today={props.today} />
        )}
      </div>
      <div>
        <TabsWeekDays
          loading={loading}
          schedule={schedule}
          week_number={trimesterInfo?.weekNumberInSemester || 0}
          today={props.today}
        />
      </div>
    </>
  );
}
