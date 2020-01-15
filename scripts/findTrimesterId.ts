import api from './api';

(async function() {
  try {
    const groups = [30248, 30323];
    const prevTrimesterId = 1117;
    const max = 100;

    for (let groupId of groups) {
      for (
        let trimesterId = prevTrimesterId + 1;
        trimesterId <= prevTrimesterId + max;
        trimesterId++
      ) {
        let schedule = await api.getSchedule(groupId, trimesterId);
        // if (schedule.length <= 1) continue;
        console.log(trimesterId, schedule.length);
      }
    }
  } catch (error) {
    console.log(error);
  }
})();
