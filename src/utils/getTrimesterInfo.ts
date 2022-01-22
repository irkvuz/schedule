import { differenceInWeeks, format, parseJSON } from 'date-fns';
import { ITrimesterOld } from '../constants';
import { getWeekNumber } from './getWeekNumber';

export interface ITrimesterInfo {
  weekNumberInSemester: number;
  weekNumberInYear: number;
  weeksInSemester: number;
  weeksInYear: number;
  dateStartString: string;
  dateFinishString: string;
}

export function getTrimesterInfo(
  trimester: ITrimesterOld,
  today: Date
): ITrimesterInfo {
  const dateStart = parseJSON(trimester.dateStart);
  const dateFinish = parseJSON(trimester.dateFinish);

  const weekNumberInSemester = getWeekNumber(
    trimester.dateStart,
    today
  );
  const weeksInSemester = differenceInWeeks(dateFinish, dateStart) + 1;
  /**
   * In second semestr it shoud be equal to number of weeks in prev simester
   */
  const weeksInPrevSemester = 15;
  const weekNumberInYear = weekNumberInSemester + weeksInPrevSemester;
  const weeksInYear = weeksInSemester + weeksInPrevSemester;

  const dateStartString= format(dateStart, 'dd.MM.yyyy');
  const dateFinishString = format(dateFinish, 'dd.MM.yyyy');

  return {
    weekNumberInSemester,
    weekNumberInYear,
    weeksInSemester,
    weeksInYear,
    dateStartString,
    dateFinishString,
  };
}
