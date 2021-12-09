import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import TabsWeekDays from './TabsWeekDays';

afterEach(cleanup);

describe('<TabsWeekDays/>', () => {
  const today = new Date('2021-12-09');
  test('Return spinner if `loading` is true', () => {
    const wrapper = render(
      <TabsWeekDays
        loading={true}
        schedule={[]}
        week_number={1}
        today={today}
      />
    );
    const loadingSpinner = wrapper.getByTestId('loading-spinner');
    expect(loadingSpinner.className).toContain('ant-spin');
  });

  test('Parity switcher switch parity between `odd` and `even`', () => {
    const schedule = require('../../public/data/schedule/1069/17854.json');
    const wrapper = render(
      <TabsWeekDays
        loading={false}
        schedule={schedule}
        week_number={1}
        today={today}
      />
    );
    // wrapper.debug();
    const weekParitySwitcher = wrapper.getByTestId('week-parity-switcher');
    const textBeforeClick = weekParitySwitcher.textContent;
    fireEvent.click(weekParitySwitcher);
    expect(weekParitySwitcher.textContent).not.toBe(textBeforeClick);
  });
});
