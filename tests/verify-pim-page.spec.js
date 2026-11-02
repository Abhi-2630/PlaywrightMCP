// @ts-check
import { test, expect } from '@playwright/test';

test('verifies PIM employee information and logs out', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('link', { name: 'PIM' }).click();

  await expect(page.getByRole('heading', { name: 'Employee Information' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();

  await page.locator('.oxd-userdropdown-tab').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();

  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
});
