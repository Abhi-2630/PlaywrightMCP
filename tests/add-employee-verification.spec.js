// @ts-check
import { test, expect } from '@playwright/test';

test('adds an employee and verifies the profile details', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('link', { name: 'PIM' }).click();
  await page.getByRole('button', { name: 'Add' }).click();

  await page.locator('input[name="firstName"]').fill('Abhishek');
  await page.locator('input[name="middleName"]').fill('Bhimrao');
  await page.locator('input[name="lastName"]').fill('Patil');
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
  await expect(page.locator('input[name="firstName"]')).toHaveValue('Abhishek', { timeout: 15000 });
  await expect(page.locator('input[name="middleName"]')).toHaveValue('Bhimrao');
  await expect(page.locator('input[name="lastName"]')).toHaveValue('Patil');
  await expect(page.getByRole('heading', { name: 'Abhishek Patil' })).toBeVisible();
});
