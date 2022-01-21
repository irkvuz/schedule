import api from './api';

// @TODO fetch trimesters from bgu.ru instead of brutforcing
// its availabe on page with schedule
// http://bgu.ru/help/timetable/timetable.aspx
// something, like:
// <input type="hidden" name="ctl00$MainContent$HFids" id="MainContent_HFids" value="1079" />
// <input type="hidden" name="ctl00$MainContent$HFids2" id="MainContent_HFids2" value="1108" />
(async function () {
  try {
    // Insert here groups for which there is available schedule on bgu.ru
    const groups = [
      30605, // МЕНрк-20-1
    ];
    const prevTrimesterId = 1282; // second 2021-2022
    const max = 100;
    let result = new Set();

    for (let groupId of groups) {
      for (
        let trimesterId = prevTrimesterId + 1;
        trimesterId <= prevTrimesterId + max;
        trimesterId++
      ) {
        let schedule = await api.getSchedule(groupId, trimesterId);
        // if (schedule.length <= 1) continue;
        console.log(trimesterId, schedule.length);
        if (schedule.length > 1) {
          result.add(trimesterId);
        }
      }
    }
    console.log('RESULT: ', ...result);
  } catch (error) {
    console.log(error);
  }
})();
