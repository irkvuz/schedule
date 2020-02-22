import { differenceInCalendarISOWeeks, parseJSON } from 'date-fns';
/**
 * Returns current week number in trimester, from `dateStart`
 * @param sDateStart strart of trimester, e.g. `2018-09-01T00:00:00`
 * @param sToday only for testing
 */
export function getWeekNumber(sDateStart: string, today: Date): number {
  const dateStart = parseJSON(sDateStart);
  // this function assume that first day of week is 1 - Monday
  const diff = differenceInCalendarISOWeeks(today, dateStart);

  // +1, becouse if difference is 0, it means that it's first week
  return diff + 1;
}
