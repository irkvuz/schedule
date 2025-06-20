/* eslint-disable jest/no-done-callback */
import { test, expect } from '@playwright/test';

test('Full jerney for ПБД(9)-24-1', async ({ page }) => {
  await page.goto('https://bgu.irkvuz.ru/');
  expect(page).toHaveURL('https://bgu.irkvuz.ru/faculties');
  await page.getByTestId('input-search').fill('Колледж');
  await page.getByRole('link', { name: 'Колледж Байкальского государственного университета' }).click();
  expect(page).toHaveURL('https://bgu.irkvuz.ru/211/');
  
  await page.getByTestId('input-search').fill('БД');
  await page.getByRole('link', { name: 'ПБД(9)-24-1' }).click();
  expect(page).toHaveURL('https://bgu.irkvuz.ru/211/32873/');
  
  await page.getByTestId('week-parity-switcher').click();
  expect(page.locator('.ant-message-notice-content')).toBeVisible();
  await page.getByRole('tab', { name: 'Понедельник' }).click();
  await page.locator('div').filter({ hasText: /^Вторник$/ }).first().click();
});