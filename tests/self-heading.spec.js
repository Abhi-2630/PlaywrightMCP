// @ts-check
import { test, expect } from '@playwright/test';

async function findVisibleLocator(candidates, description) {
  let visibleIndex = -1;
  await expect
    .poll(
      async () => {
        for (let index = 0; index < candidates.length; index += 1) {
          if (await candidates[index].first().isVisible()) {
            visibleIndex = index;
            return true;
          }
        }
        return false;
      },
      { message: `Waiting for a visible ${description}`, timeout: 30_000 },
    )
    .toBe(true);

  return candidates[visibleIndex].first();
}

test('logs in, verifies the dashboard, and logs out', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  const username = await findVisibleLocator([
    page.getByRole('textbox', { name: 'Username' }),
    page.getByPlaceholder('Username'),
    page.getByLabel('Username'),
    page.locator('input[name="username"]'),
    page.locator('input[type="text"]').first(),
  ], 'username field');
  const password = await findVisibleLocator([
    page.getByRole('textbox', { name: 'Password' }),
    page.getByPlaceholder('Password'),
    page.getByLabel('Password'),
    page.locator('input[name="password"]'),
    page.locator('input[type="password"]'),
  ], 'password field');

  await username.fill('Admin');
  await password.fill('admin123');

  const loginButton = await findVisibleLocator([
    page.getByRole('button', { name: 'Login' }),
    page.getByText('Login', { exact: true }),
    page.locator('button[type="submit"]'),
  ], 'login button');
  await loginButton.click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  const userMenu = await findVisibleLocator([
    page.locator('.oxd-userdropdown-tab'),
    page.getByRole('button', { name: /user/i }),
    page.getByText(/admin/i, { exact: true }),
  ], 'user menu');
  await userMenu.click();

  const logoutOption = await findVisibleLocator([
    page.getByRole('menuitem', { name: /logout/i }),
    page.getByRole('link', { name: /logout/i }),
    page.getByText('Logout', { exact: true }),
  ], 'logout option');
  await logoutOption.click();

  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});
