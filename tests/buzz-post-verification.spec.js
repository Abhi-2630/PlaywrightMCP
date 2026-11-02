// @ts-check
import { test, expect } from '@playwright/test';

test('creates a Buzz post and verifies it appears in the recent feed', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.getByRole('link', { name: 'Buzz' }).click();

  await expect(page.getByText('Buzz Newsfeed')).toBeVisible();
  await expect(page.getByRole('button', { name: /Most Recent Posts/ })).toBeVisible();

  const postMessage = 'Excited for Testing!';
  await expect(page.getByPlaceholder("What's on your mind?")).toBeVisible();
  await page.getByPlaceholder("What's on your mind?").fill(postMessage);
  await page.getByRole('button', { name: 'Post', exact: true }).click();

  await expect(page.locator('.orangehrm-buzz-post-body-text').first()).toHaveText(postMessage);
});
