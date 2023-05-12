/* eslint-disable jest/no-done-callback */
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://bgu.irkvuz.ru/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Расписание БГУ/);
});

