import { findNearestDay } from './findNearestDay';

const scheduleExample = require('../../public/data/schedule/1069/15462.json');

describe('Correct calculating nearest day', () => {
  test('(1, 1) => 1', () => {
    expect(
      findNearestDay({ week_number: 1, weekday: 1, schedule: scheduleExample })
    ).toEqual({ minWeekday: 1, parity: false });
  });

  test('(1, 2) => 2', () => {
    expect(
      findNearestDay({ week_number: 1, weekday: 2, schedule: scheduleExample })
    ).toEqual({ minWeekday: 2, parity: false });
  });
});
