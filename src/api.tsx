import axios from 'axios';

let api = {
  getFaculties: () => axios.get(`/data/faculties.json`),
  getFacultiesWithGroups: () => axios.get(`/data/facultiesWithGroups.json`),
  getGroups: (facultyId: string) => axios.get(`/data/groups/${facultyId}.json`),
  getTrimester: () => axios.get(`/data/trimesters/current.json`),
  getSchedule: (groupId: string, trimesterId: string) =>
    axios.get(`/data/schedule/${trimesterId}/${groupId}.json`),
};

export default api;
