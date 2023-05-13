/* eslint-disable jest/no-done-callback */
import { test, expect } from '@playwright/test';

test('Full jerney for М-21-1', async ({ page }) => {
  await page.goto('https://bgu.irkvuz.ru/');
  expect(page).toHaveURL('https://bgu.irkvuz.ru/faculties');
  await page.getByTestId('input-search').fill('Институт управления');
  await page.getByRole('link', { name: 'Институт управления и финансов' }).click();
  expect(page).toHaveURL('https://bgu.irkvuz.ru/205/');
  
  await page.getByTestId('input-search').fill('М-');
  await page.getByRole('link', { name: 'М-21-1' }).click();
  expect(page).toHaveURL('https://bgu.irkvuz.ru/205/31019/');
  
  await page.getByTestId('week-parity-switcher').click();
  expect(page.locator('.ant-message-notice-content')).toBeVisible();
  await page.getByRole('tab', { name: 'Понедельник' }).click();
  await page.locator('div').filter({ hasText: /^Вторник$/ }).first().click();
});