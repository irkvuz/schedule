import { Alert } from 'antd';
import { differenceInWeeks, format, getISODay, parseJSON } from 'date-fns';
import React from 'react';
import { ITrimester, WEEK_DAY_NAMES } from '../constants';
import { getWeekNumber } from '../utils/getWeekNumber';

interface Props {
  trimester: ITrimester;
  today: Date;
}

export default function TrimesterInfo(props: Props) {
  const dateStart = parseJSON(props.trimester.dateStart);
  const dateFinish = parseJSON(props.trimester.dateFinish);

  const weekNumberInSemester = getWeekNumber(
    props.trimester.dateStart,
    props.today
  );
  const weeksInSemester = differenceInWeeks(dateFinish, dateStart) + 1;
  /**
   * In second semestr it shoud be equal to number of weeks in prev simester
   */
  const weeksInPrevSemester = 0;
  const weekNumberInYear = weekNumberInSemester + weeksInPrevSemester;
  const weeksInYear = weeksInSemester + weeksInPrevSemester;

  return (
    <>
      <div>
        Сегодня {WEEK_DAY_NAMES[getISODay(props.today) % 7]},{' '}
        {format(props.today, 'dd.MM.yyyy')},{' '}
        {/* @TODO I need to do something with weeks and semesters */}
        {weekNumberInSemester >= 1 && (
          <>
            неделя в {weeksInYear === weeksInSemester ? 'семестре' : 'году'}{' '}
            {weekNumberInYear} из {weeksInYear} (
            {weekNumberInYear % 2 === 0 ? 'Четная' : 'Нечетная'})
          </>
        )}
        {weekNumberInSemester < 1 && (
          <>семестр еще не начался, первая неделя будет нечетная</>
        )}
      </div>
      <div>
        Семестр: {format(dateStart, 'dd.MM.yyyy')} -{' '}
        {format(dateFinish, 'dd.MM.yyyy')}
      </div>
      {weekNumberInSemester > weeksInSemester && (
        <Alert
          type="warning"
          showIcon
          message="Учебный семестр закончился. Сейчас отображается расписание прошедшего семестра."
        />
      )}
    </>
  );
}
