import axios from 'axios';
import { ITrimester, ILessonOld } from './constants';

let api = {
  getFaculties: () => axios.get(`/data/faculties.json`),
  getFacultiesWithGroups: () => axios.get(`/data/facultiesWithGroups.json`),
  getGroups: (facultyId: string) => axios.get(`/data/groups/${facultyId}.json`),
  getTrimester: () =>
    axios
      .get<ITrimester>(`/data/trimesters/current.json`)
      .then(res => res.data),
  getSchedule: (groupId: string, trimesterId: string | number) =>
    axios
      .get<ILessonOld[]>(`/data/schedule/${trimesterId}/${groupId}.json`)
      .then(res => res.data),
};

export default api;
