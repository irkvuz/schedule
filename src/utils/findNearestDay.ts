import { ILessonOld } from '../constants/index';

interface Params {
  /** Номер текущей недели с начала семестра */
  week_number: number;
  /** Текущий день недели, 0 - sunday, 1 - monday... */
  weekday: number;
  schedule: ILessonOld[];
}

/**
 * Поиск ближайшего следующего дня для которого есть расписание
 */
export function findNearestDay({ week_number, weekday, schedule }: Params) {
  let parity = week_number % 2 === 0;
  // .map нужен, потому что .reduce может работать только с plain массивами
  let minWeekday = schedule
    .map((v) => v.WeekDay)
    .reduce((min, nextWeekday, i) => {
      const lesson = schedule[i];
      if (lesson.Odd === 0 && nextWeekday < weekday) {
        // пара каждую неделю и на этой неделе этот день уже прошел
        // => пара будет на следующей
        nextWeekday += 7;
      } else if (
        (lesson.Odd === 1 && parity) ||
        (lesson.Odd === 2 && !parity)
      ) {
        // пара не на этой неделе
        nextWeekday += 7;
      } else if (nextWeekday < weekday) {
        // пара на этой неделе, но день уже прошел
        nextWeekday += 14;
      }
      return Math.min(min, nextWeekday);
    }, 15); // здесь минимальным днем передаем максимально невозможное число

  // We need to correct minWeekday value a little bit
  if (minWeekday > 14) {
    minWeekday -= 14;
  } else if (minWeekday > 7) {
    // если пара в день на следующей неделе, надо поменять четность
    minWeekday -= 7;
    parity = !parity;
  }
  return { minWeekday, parity };
}
