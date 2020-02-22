import moment from 'moment';
import { getWeekNumber } from './getWeekNumber';

describe('getWeekNumber() works', () => {
  moment.locale('ru');

  it('Trimester starts on Friday', () => {
    // Same day
    expect(getWeekNumber('2020-02-21T00:00:00', '2020-02-21')).toEqual(1);
    // Monday next week
    expect(getWeekNumber('2020-02-21T00:00:00', '2020-02-24')).toEqual(2);
  });

  it('Trimester starts on Monday', () => {
    // Sunday same week
    expect(getWeekNumber('2020-02-17T00:00:00', '2020-02-23')).toEqual(1);
    // Monday next week
    expect(getWeekNumber('2020-02-17T00:00:00', '2020-02-24')).toEqual(2);
    // Friday next Week
    expect(getWeekNumber('2020-02-17T00:00:00', '2020-02-28')).toEqual(2);
    // Monday after 2 weeks
    expect(getWeekNumber('2020-02-17T00:00:00', '2020-03-02')).toEqual(3);
  });
});
