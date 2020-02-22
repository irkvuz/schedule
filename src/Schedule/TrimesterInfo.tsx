import { Alert } from 'antd';
import { differenceInWeeks, format, getISODay, parseJSON } from 'date-fns';
import React from 'react';
import { ITrimester, WEEK_DAY_NAMES } from '../constants';
import { getWeekNumber } from '../utils/getWeekNumber';

interface Props {
  trimester: ITrimester;
}

export default function TrimesterInfo(props: Props) {
  const today = new Date();
  const dateStart = parseJSON(props.trimester.dateStart);
  const dateFinish = parseJSON(props.trimester.dateFinish);

  const week_number = getWeekNumber(props.trimester.dateStart, today);

  const week_total = differenceInWeeks(dateFinish, dateStart);

  return (
    <>
      <div>
        Сегодня {WEEK_DAY_NAMES[getISODay(today) % 7]},{' '}
        {format(today, 'dd.MM.yyyy')},{' '}
        {/* @TODO I need to do something with weeks and semesters */}
        неделя в семестре {week_number} из {week_total}, неделя в году{' '}
        {week_number + 15} из {week_total + 15} (
        {(week_number + 15) % 2 === 0 ? 'Четная' : 'Нечетная'})
      </div>
      {week_number > week_total && (
        <Alert
          type="warning"
          showIcon
          message="Учебный семестр закончился. Сейчас отображается расписание прошедшего семестра."
        />
      )}
    </>
  );
}
