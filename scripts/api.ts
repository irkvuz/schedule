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
  getTrimesters: async (): Promise<ITrimesterOld[]> => {
    const originalTrimesters: ITrimesterOld[] = JSON.parse(
      (await axios.get(`/?mode=2`)).data.substr(1)
    );
    const sortedTrimesters = originalTrimesters.sort((a, b) =>
      a.IdTrimester > b.IdTrimester ? 1 : b.IdTrimester > a.IdTrimester ? -1 : 0
    );
    const niceTrimesters = sortedTrimesters.map((trimester) => {
      delete trimester.week;
      delete trimester.Error;
      return trimester;
    });
    return niceTrimesters;
  },
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
