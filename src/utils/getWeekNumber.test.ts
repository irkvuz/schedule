import { getWeekNumber } from './getWeekNumber';

describe('getWeekNumber() works', () => {
  it('Monday->Monday', () => {
    expect(getWeekNumber('2018-01-01T00:00:00', '2018-01-01')).toEqual(1);
  });
  it('Monday->Friday', () => {
    expect(getWeekNumber('2018-01-01T00:00:00', '2018-01-05')).toEqual(1);
  });
  it('Monday->Sunday', () => {
    expect(getWeekNumber('2018-01-01T00:00:00', '2018-01-07')).toEqual(1);
  });
  it('Monday->Monday+1', () => {
    expect(getWeekNumber('2018-01-01T00:00:00', '2018-01-08')).toEqual(2);
  });
  it('Monday->Sunday+1', () => {
    expect(getWeekNumber('2018-01-01T00:00:00', '2018-01-14')).toEqual(2);
  });
  it('Monday->Monday+2', () => {
    expect(getWeekNumber('2018-01-01T00:00:00', '2018-01-15')).toEqual(3);
  });
  it('Tuesday->Tuesday', () => {
    expect(getWeekNumber('2018-01-02T00:00:00', '2018-01-02')).toEqual(1);
  });
  it('Tuesday->Sunday', () => {
    expect(getWeekNumber('2018-01-02T00:00:00', '2018-01-02')).toEqual(1);
  });
  it('Tuesday->Monday+1', () => {
    expect(getWeekNumber('2018-01-02T00:00:00', '2018-01-08')).toEqual(2);
  });
  it('Friday->Friday', () => {
    expect(getWeekNumber('2018-01-05T00:00:00', '2018-01-05')).toEqual(1);
  });
  it('Friday->Monday+1', () => {
    expect(getWeekNumber('2018-01-05T00:00:00', '2018-01-08')).toEqual(2);
  });

  it('Friday->Friday+1', () => {
    expect(getWeekNumber('2018-01-05T00:00:00', '2018-01-12')).toEqual(2);
  });
});
