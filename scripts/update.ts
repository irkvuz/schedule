/**
 * This script download api response and for all methods and save it to the ./public/data/*.json files
 */

const axios = require('axios');
const fs = require('fs');
const ProgressBar = require('progress');

interface IGroupOld {
  IdGroup: number;
  Group: string;
  Course: number;
  Error: string;
}

interface IFacultyOld {
  IdFaculty: number;
  FacultyName: string;
  FacultyAbbr: string;
  Error: string;
}

interface ITrimesterOld {
  IdTrimester: number;
  uYear: string;
  dateStart: Date;
  dateFinish: Date;
  week: number;
  Error: string;
}

interface ILessonOld {
  WeekDay: number;
  StartTime: string;
  Odd: number;
  Lesson: string;
  LessonType: string;
  Room: string;
  FIO: string;
  FIOshort: string;
  Error: string;
}

class Group {
  public id: number;
  public name: string;
  constructor(obj: IGroupOld) {
    this.id = obj.IdGroup;
    this.name = obj.Group;
  }
}

class Faculty {
  public id: number;
  public name: string;
  public fullName: string;
  public groups: Group[];
  constructor(obj: IFacultyOld) {
    this.id = obj.IdFaculty;
    this.name = obj.FacultyAbbr;
    this.fullName = obj.FacultyName;
    this.groups = [];
  }
}
axios.defaults.baseURL = 'http://mobile.bgu.ru/timetableJson.ashx';
// substr(1) is needed because response from api contains `@` signn as a first symbol
let api = {
  getFaculties: async (): Promise<IFacultyOld[]> =>
    JSON.parse((await axios.get(`/`)).data.substr(1)),
  getGroups: async (facultyId: number): Promise<IGroupOld[]> =>
    JSON.parse((await axios.get(`/?mode=1&id=${facultyId}`)).data.substr(1)),
  getTrimester: async (): Promise<ITrimesterOld[]> =>
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

let json2file = (path: string, obj: any) => {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2));
};

(async () => {
  try {
    console.log('Start downloading');
    let trimesters = await api.getTrimester();
    let trimesterId = trimesters[0].IdTrimester;
    json2file(`./public/data/trimesters/${trimesterId}.json`, trimesters[0]);
    json2file(`./public/data/trimesters/current.json`, trimesters[0]);
    let dirSchedule = `./public/data/schedule/${trimesterId}`;
    if (!fs.existsSync(dirSchedule)) fs.mkdirSync(dirSchedule);

    let faculties = await api.getFaculties();
    json2file(`./public/data/faculties.json`, faculties);
    let facultiesWithGroups: Faculty[] = [];
    for (let f of faculties) {
      let groups = await api.getGroups(f.IdFaculty);
      json2file(`./public/data/groups/${f.IdFaculty}.json`, groups);
      let newFaculty = new Faculty(f);
      let bar = new ProgressBar(
        `${newFaculty.name} [:bar] :current/:total :percent :etas`,
        {
          width: 20,
          total: groups.length,
        }
      );
      for (let i = 0; i < groups.length; i++) {
        let g = groups[i];
        let schedule = await api.getSchedule(g.IdGroup, trimesterId);
        json2file(`${dirSchedule}/${g.IdGroup}.json`, schedule);
        newFaculty.groups.push(new Group(g));
        bar.tick();
      }
      facultiesWithGroups.push(newFaculty);
    }
    json2file(`./public/data/facultiesWithGroups.json`, facultiesWithGroups);
  } catch (error) {
    console.error(error);
  }
})();
