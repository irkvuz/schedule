/* eslint-disable jest/no-done-callback */
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://bgu.irkvuz.ru/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Расписание БГУ/);
});

test('search faculty', async ({page})=>{
  await page.goto('https://bgu.irkvuz.ru/');

  await page.getByTestId("input-search").fill("Институт");

  await expect(await page.locator(".ant-list-items > li")).toHaveCount(5);

  await page.getByTestId("input-search").fill("Институт управления и финансов");

  await expect(await page.locator(".ant-list-items > li")).toHaveCount(1);
})

