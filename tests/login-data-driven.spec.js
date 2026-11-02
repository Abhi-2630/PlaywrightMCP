// @ts-check
import { test, expect } from '@playwright/test';

const loginCases = [
  {
    username: 'Admin',
    password: 'admin123',
    expected: 'dashboard',
  },
  {
    username: 'fakeuser',
    password: 'fakepass',
    expected: 'invalid-credentials',
  },
  {
    username: 'ESSUser1',
    password: 'ess123',
    expected: 'invalid-credentials',
  },
];

for (const { username, password, expected } of loginCases) {
  test(`login for ${username} shows ${expected}`, async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.getByRole('textbox', { name: 'Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    if (expected === 'dashboard') {
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

      await page.locator('.oxd-userdropdown-tab').click();
      await page.getByRole('menuitem', { name: 'Logout' }).click();
      await expect(page).toHaveURL(/\/auth\/login/);
    } else {
      await expect(page.getByText('Invalid credentials', { exact: false })).toBeVisible();
    }
  });
}
