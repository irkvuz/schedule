/**
 * This script download api response and for all methods and save it to the ./public/data/*.json files
 */

const axios = require('axios');
const fs = require('fs');

axios.defaults.baseURL = 'http://mobile.bgu.ru/timetableJson.ashx';

// substr(1) is needed because response from api contains `@` signn as a first symbol
let api = {
  getFaculties: async () => JSON.parse((await axios.get(`/`)).data.substr(1)),
  getGroups: async facultyId =>
    JSON.parse((await axios.get(`/?mode=1&id=${facultyId}`)).data.substr(1)),
  getTrimester: async () =>
    JSON.parse((await axios.get(`/?mode=2`)).data.substr(1)),
  getSchedule: async (groupId, trimesterId) =>
    JSON.parse(
      (await axios.get(
        `/?mode=3&id=${groupId}&idt=${trimesterId}`
      )).data.substr(1)
    ),
};

let json2file = (path, obj) => {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2));
};

(async () => {
  console.log('Start downloading');
  let trimesters = await api.getTrimester();
  let trimesterId = trimesters[0].IdTrimester;
  json2file(`./public/data/trimesters/${trimesterId}.json`, trimesters[0]);
  json2file(`./public/data/trimesters/current.json`, trimesters[0]);
  let dirSchedule = `./public/data/schedule/${trimesterId}`;
  if (!fs.existsSync(dirSchedule)) fs.mkdirSync(dirSchedule);

  let faculties = await api.getFaculties();
  json2file(`./public/data/faculties.json`, faculties);
  let facultiesWithGroups = [];
  for (let f of faculties) {
    console.log(f.IdFaculty);
    let groups = await api.getGroups(f.IdFaculty);
    json2file(`./public/data/groups/${f.IdFaculty}.json`, groups);
    f.groups = groups;
    facultiesWithGroups.push(f);
    for (let g of groups) {
      console.log('\t', g.IdGroup);
      let schedule = await api.getSchedule(g.IdGroup, trimesterId);
      json2file(`${dirSchedule}/${g.IdGroup}.json`, schedule);
    }
  }
  json2file(`./public/data/facultiesWithGroups.json`, facultiesWithGroups);
})();
