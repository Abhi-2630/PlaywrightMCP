// @ts-check
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const csvPath = path.resolve(__dirname, '..', 'test-data', 'loginData.csv');
const [headerLine, ...dataLines] = readFileSync(csvPath, 'utf8')
  .trim()
  .split(/\r?\n/);
const headers = headerLine.split(',').map((header) => header.trim());

if (headers.join(',') !== 'username,password,Expected') {
  throw new Error(`Unexpected CSV columns in ${csvPath}: ${headerLine}`);
}

const loginCases = dataLines.map((line, index) => {
  const [username, password, expected, ...extraColumns] = line
    .split(',')
    .map((value) => value.trim());

  if (!username || !password || !expected || extraColumns.length > 0) {
    throw new Error(`Invalid login data on CSV line ${index + 2}: ${line}`);
  }

  return { username, password, expected };
});

test.describe('Data-driven OrangeHRM login validation', () => {
  for (const { username, password, expected } of loginCases) {
    test(`${username} expects ${expected}`, async ({ page }) => {
      try {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await page.getByRole('textbox', { name: 'Username' }).fill(username);
        await page.getByRole('textbox', { name: 'Password' }).fill(password);
        await page.getByRole('button', { name: 'Login' }).click();

        if (expected === 'Dashboard') {
          await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        } else if (expected === 'Invalid credentials') {
          await expect(page.getByText('Invalid credentials', { exact: false })).toBeVisible();
        } else {
          throw new Error(`Unsupported expected result for ${username}: ${expected}`);
        }

        console.log(`[PASS] ${username}: ${expected}`);
      } catch (error) {
        console.error(`[FAIL] ${username}: expected ${expected}`);
        throw error;
      }
    });
  }
});
