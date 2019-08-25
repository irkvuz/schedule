import api from './api';

(async function() {
  try {
    let groupId = 17854;
    let prevTrimesterId = 1079;
    let max = 100;

    for (
      let trimesterId = prevTrimesterId + 1;
      trimesterId <= prevTrimesterId + max;
      trimesterId++
    ) {
      let schedule = await api.getSchedule(groupId, trimesterId);
      console.log(trimesterId, schedule.length);
    }
  } catch (error) {
    console.log(error);
  }
})();
