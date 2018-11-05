const axios = require('axios')

axios.defaults.baseURL = 'http://mobile.bgu.ru/timetableJson.ashx';

module.exports = {
  getFaculties: () => axios.get(`/`)
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