import { Alert, Progress } from 'antd';
import moment from 'moment';
import React from 'react';
import { ITrimester, WEEK_DAY_NAMES } from '../constants';

interface Props {
  trimester: ITrimester;
}

export default function TrimesterInfo(props: Props) {
  const today = moment();
  const dateStart = moment(props.trimester.dateStart);
  const dateFinish = moment(props.trimester.dateFinish);

  // clone fixes problem with mutability (https://stackoverflow.com/a/30979325/5700024)
  const week_number = today.diff(dateStart.clone().startOf('week'), 'week') + 1;

  const week_total = dateFinish.diff(dateStart, 'week');

  /** Short for dates */
  const d = {
    today: today.valueOf(),
    start: dateStart.valueOf(),
    finish: dateFinish.valueOf(),
  };
  const trimesterProgress = Math.round(
    ((d.today - d.start) / (d.finish - d.start)) * 100
  );

  return (
    <>
      <div>
        Сегодня {WEEK_DAY_NAMES[today.isoWeekday() % 7]}, {today.format('LL')}{' '}
        {/* @TODO I need to do something with weeks and semesters */}
        неделя в семестре {week_number} из {week_total} (
        {week_number % 2 === 0 ? 'Четная' : 'Нечетная'})
      </div>
      <div>
        Прогресс семестра ({dateStart.format('L')} - {dateFinish.format('L')}):
      </div>
      <Progress percent={trimesterProgress} />
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
