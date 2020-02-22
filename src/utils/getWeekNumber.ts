import moment from 'moment';
/**
 * Returns current week number in trimester, from `dateStart`
 * @param sDateStart strart of trimester, e.g. `2018-09-01T00:00:00`
 * @param sToday only for testing
 */
export function getWeekNumber(sDateStart: string, sToday?: string): number {
  const dateStart = moment(sDateStart);
  const today = sToday ? moment(sToday) : moment();

  const startOfWeek = dateStart.startOf('week');
  return moment(today).diff(startOfWeek, 'week') + 1;
}
