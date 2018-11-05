const axios = require('axios')

axios.defaults.baseURL = 'http://192.168.0.200:8080/mobile.bgu.ru/timetableJson.ashx';

module.exports = {
  getFaculties: () => axios.get(`/`),
  getGroups: (facultyId) => axios.get(`/?mode=1&id=${facultyId}`),
  getTrimester: () => axios.get(`/?mode=2`),
  getSchedule: (groupId, trimesterId) => axios.get(`/?mode=3&id=${groupId}&idt=${trimesterId}`)
}

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