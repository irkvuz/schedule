const axios = require('axios');

// axios.defaults.baseURL = "http://192.168.0.200:8080/mobile.bgu.ru/timetableJson.ashx";

// let apiOriginal = {
//   getFaculties: async () => JSON.parse((await axios.get(`/`)).data.substr(1)),
//   getGroups: async facultyId =>
//     JSON.parse((await axios.get(`/?mode=1&id=${facultyId}`)).data.substr(1)),
//   getTrimester: async () =>
//     JSON.parse((await axios.get(`/?mode=2`)).data.substr(1)),
//   getSchedule: async (groupId, trimesterId) =>
//     JSON.parse(
//       (await axios.get(
//         `/?mode=3&id=${groupId}&idt=${trimesterId}`
//       )).data.substr(1)
//     ),
// };

let apiFake = {
  getFaculties: () => axios.get(`/data/faculties.json`),
  getFacultiesWithGroups: () => axios.get(`/data/facultiesWithGroups.json`),
  getGroups: facultyId => axios.get(`/data/groups/${facultyId}.json`),
  getTrimester: () => axios.get(`/data/trimesters/current.json`),
  getSchedule: (groupId, trimesterId) =>
    axios.get(`/data/schedule/${trimesterId}/${groupId}.json`),
};

module.exports = apiFake;

// simple testing
// if (require.main === module) {
//   (async () => {
//     let api = module.exports;
//     // api.getFaculties().then(res => console.log(res)).catch(err => console.error(err))
//     let res;
//     try {
//       res = await api.getFaculties();
//     } catch (error) {
//       console.error(error);
//     }
//     console.log(JSON.parse(res.data.substr(1)))
//   })();
// }
