import axios from 'axios';
import { IGroupOld, IFacultyOld } from '../src/constants';
import { ITrimesterOld, ILessonOld } from './types';

axios.defaults.baseURL = 'http://mobile.bgu.ru/timetableJson.ashx';
export default {
  // substr(1) is needed because response from api contains `@` signn as a first symbol
  getFaculties: async (): Promise<IFacultyOld[]> =>
    JSON.parse((await axios.get(`/`)).data.substr(1)),
  getGroups: async (facultyId: number): Promise<IGroupOld[]> =>
    JSON.parse((await axios.get(`/?mode=1&id=${facultyId}`)).data.substr(1)),
  getTrimesters: async (): Promise<ITrimesterOld[]> =>
    JSON.parse((await axios.get(`/?mode=2`)).data.substr(1)),
  getSchedule: async (
    groupId: number,
    trimesterId: number
  ): Promise<ILessonOld[]> =>
    JSON.parse(
      (await axios.get(
        `/?mode=3&id=${groupId}&idt=${trimesterId}`
      )).data.substr(1)
    ),
};
