/**
 * This script download api response and for all methods and save it to the ./public/data/*.json files
 */

import fs from 'fs';
import ProgressBar from 'progress';
import { IScheduleOld } from '../src/constants';
import api from './api';
import { Faculty, Group } from './types';

const VERBOSE = true;

// @TODO store trimesterds in data folder
const TRIMESTER_ID_1 = 1236;
const TRIMESTER_ID_2 = 1259;

const trimesterIds = [TRIMESTER_ID_1, TRIMESTER_ID_2];

const json2file = (path: string, obj: any) => {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + '\n');
};

(async () => {
  try {
    console.log('Start downloading');
    // let trimesters = await api.getTrimesters();
    // let trimesterId = trimesters[0].IdTrimester;
    // json2file(`./public/data/trimesters/${trimesterId}.json`, trimesters[0]);
    // json2file(`./public/data/trimesters/current.json`, trimesters[0]);
    let dirSchedule = `./public/data/schedule/${trimesterIds[0]}`;
    if (!fs.existsSync(dirSchedule)) fs.mkdirSync(dirSchedule);

    if (VERBOSE) console.log('Getting faculties');
    let faculties = await api.getFaculties();
    json2file(`./public/data/faculties.json`, faculties);

    const file: any = fs.readFileSync(`./public/data/lastUpdate.json`);
    const lastUpdate = JSON.parse(file);

    let facultiesWithGroups: Faculty[] = [];
    for (let f of faculties) {
      if (VERBOSE) {
        console.log('Getting groups for', f.IdFaculty, f.FacultyAbbr);
      }
      let groups = await api.getGroups(f.IdFaculty);
      let newFaculty = new Faculty(f);
      let bar = new ProgressBar(
        `${newFaculty.name} [:bar] :current/:total :percent :etas`,
        {
          width: 20,
          total: groups.length,
        }
      );
      for (let i = 0; i < groups.length; i++) {
        bar.tick();
        groups[i].hasSchedule = false;
        let schedule: IScheduleOld;
        for (let trimesterId of trimesterIds) {
          schedule = await api.getSchedule(groups[i].IdGroup, trimesterId);
          if (schedule.length > 1) {
            groups[i].hasSchedule = true;
            groups[i].trimesterId = trimesterId;
            break;
          }
        }
        if (groups[i].hasSchedule) {
          schedule = schedule.map((lesson) => {
            lesson.Lesson = lesson.Lesson.replace(
              /(Физическая культура).*/,
              '$1'
            );
            return lesson;
          });
          const pathToScheduleFile = `${dirSchedule}/${groups[i].IdGroup}.json`;
          if (fs.existsSync(pathToScheduleFile)) {
            const file: any = fs.readFileSync(pathToScheduleFile);
            const oldSchedule = JSON.parse(file);
            if (JSON.stringify(schedule) !== JSON.stringify(oldSchedule)) {
              lastUpdate[groups[i].IdGroup] = new Date();
            }
          } else {
            lastUpdate[groups[i].IdGroup] = new Date();
          }
          json2file(pathToScheduleFile, schedule);
          newFaculty.groups.push(new Group(groups[i]));
        }
      }
      if (newFaculty.groups.length > 0) facultiesWithGroups.push(newFaculty);
      json2file(`./public/data/groups/${f.IdFaculty}.json`, groups);
    }
    json2file(`./public/data/facultiesWithGroups.json`, facultiesWithGroups);
    json2file(`./public/data/lastUpdate.json`, lastUpdate);
  } catch (error) {
    console.error(error);
    if (error.status) console.log('error.status', error.status);
    if (error.code) console.log('error.code', error.code);
    if (error.config?.url) console.log('error.config.url', error.config.url);
  }
})();
