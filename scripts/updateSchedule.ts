/**
 * This script download api response and for all methods and save it to the ./public/data/*.json files
 */

import fs from 'fs';
import ProgressBar from 'progress';
import { IScheduleOld, ITrimesterOld } from '../src/constants';
import api from './api';
import { Faculty, Group } from './types';

const VERBOSE = true;

const json2file = (path: string, obj: any) => {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + '\n');
};

/**
 * Removes duplicates in array of objects
 * @param objects Array of objects
 * @param uniqueKey key that is used for filtration
 * @returns array of unique objects
 */
export const uniqueBy = <T>(objects: T[], uniqueKey: keyof T): T[] => {
  const ids = objects.map((object) => object[uniqueKey]);
  return objects.filter(
    (object, index) => !ids.includes(object[uniqueKey], index + 1)
  );
};

function getCurrentTrimesters(trimesters:ITrimesterOld[], today = new Date().toISOString()) {
  const currentTrimesters = trimesters.filter((t) => {
    return today >= t.dateStart && today <= t.dateFinish;
  });
  return currentTrimesters;
}

async function updateTrimesters() {
  const trimestersFromApi = await api.getTrimesters();
  if (!trimestersFromApi.length) throw new Error('No trimesters returned');

  const existingTrimesters: ITrimesterOld[] = JSON.parse(
    fs.readFileSync(`./public/data/Trimesters.json`, 'utf-8')
  );
  const allTrimesters = uniqueBy(
    [...existingTrimesters, ...trimestersFromApi],
    'IdTrimester'
  );
  const allTrimestersSorted = allTrimesters.sort((a, b) =>
    a.IdTrimester > b.IdTrimester ? 1 : b.IdTrimester > a.IdTrimester ? -1 : 0
  );

  json2file(`./public/data/trimesters.json`, allTrimestersSorted);

  const currTrimesters = getCurrentTrimesters(allTrimestersSorted);
  const trimesterIds = currTrimesters.map((t) => t.IdTrimester);
  return trimesterIds;
}

(async () => {
  try {
    console.log('Start downloading');

    const trimesterIds = await updateTrimesters();
    if(VERBOSE) {
      console.log('Current trimester ids:', trimesterIds.toString());
    }    
    
    // we are going to use first trimesterId as identifier for folder
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
        // to avoid multiple useless requests
        if (
          groups[i].trimesterId &&
          trimesterIds.includes(groups[i].trimesterId)
        ) {
          schedule = await api.getSchedule(
            groups[i].IdGroup,
            groups[i].trimesterId
          );
          if (schedule.length > 1) {
            groups[i].hasSchedule = true;
          } else {
            groups[i].trimesterId = undefined;
          }
        } else {
          for (let trimesterId of trimesterIds) {
            schedule = await api.getSchedule(groups[i].IdGroup, trimesterId);
            if (schedule.length > 1) {
              groups[i].hasSchedule = true;
              groups[i].trimesterId = trimesterId;
              break;
            }
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
            const file = fs.readFileSync(pathToScheduleFile, 'utf-8');
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
    throw new Error(error);
  }
})();
