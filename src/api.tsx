import axios from 'axios';
import {
  ITrimester,
  ILessonOld,
  IFacultyWithGroups,
  IFacultyOld,
  IGroupOld,
} from './constants';

/** Wrapper for `axios.get` that returns `response`.data */
async function get<T = any>(url: string) {
  const response = await axios.get<T>(url);
  return response.data;
}

let api = {
  getFaculties: () => get<IFacultyOld[]>(`/data/faculties.json`),
  getFacultiesWithGroups: () =>
    get<IFacultyWithGroups[]>(`/data/facultiesWithGroups.json`),
  getGroups: (facultyId: string) =>
    get<IGroupOld[]>(`/data/groups/${facultyId}.json`),
  getTrimester: () => get<ITrimester>(`/data/trimesters/current.json`),
  getSchedule: (groupId: string, trimesterId: string | number) =>
    get<ILessonOld[]>(`/data/schedule/${trimesterId}/${groupId}.json`),
};

export default api;
