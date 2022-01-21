import axios from 'axios';
import {
  IGroupOld,
  IFacultyOld,
  ILessonOld,
  ITrimesterOld,
} from '../src/constants';

const DEBUG = false;
if (DEBUG) {
  axios.interceptors.request.use((request) => {
    console.log('Starting Request', request.url);
    return request;
  });

  axios.interceptors.response.use((response) => {
    console.log(
      'Response:',
      response.status,
      response.statusText,
      response.config.url
    );
    return response;
  });
}

axios.defaults.baseURL = 'http://mobile.bgu.ru/timetableJson.ashx';
const methods = {
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
      (
        await axios.get(`/?mode=3&id=${groupId}&idt=${trimesterId}`)
      ).data.substr(1)
    ),
};

export default methods;