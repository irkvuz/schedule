import { Alert } from 'antd';
import { format, getISODay } from 'date-fns';
import React from 'react';
import { ITrimesterInfo } from '../utils/getTrimesterInfo';
import { WEEK_DAY_NAMES } from '../constants';

interface Props {
  trimesterInfo: ITrimesterInfo;
  today: Date;
}

export default function TrimesterInfo(props: Props) {
  const {
    weekNumberInSemester,
    weekNumberInYear,
    weeksInSemester,
    weeksInYear,
    dateStartString,
    dateFinishString,
  } = props.trimesterInfo;

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
        Семестр: {dateStartString} - {dateFinishString}
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
