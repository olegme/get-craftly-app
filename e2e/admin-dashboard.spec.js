import { test, expect } from '@playwright/test';

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

async function login(page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sign In with Email/Password' }).click();
  await page.getByPlaceholder('Email').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  const signedIn = page.getByText('Signed in as');
  const authError = page.locator('.error-message');
  await Promise.race([
    signedIn.waitFor({ state: 'visible', timeout: 15000 }),
    authError.waitFor({ state: 'visible', timeout: 15000 }),
  ]);
  if (await authError.isVisible()) {
    const message = (await authError.textContent()) || 'Unknown auth error';
    throw new Error(`Login failed: ${message.trim()}`);
  }
  await expect(signedIn).toBeVisible();
}

test.describe('admin dashboard', () => {
  test.skip(!email || !password, 'E2E_EMAIL and E2E_PASSWORD are required to run this test.');

  test('renders dashboard without console errors', async ({ page }) => {
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', err => {
      pageErrors.push(err.message || String(err));
    });

    await login(page);

    const dashboard = page.getByRole('heading', { name: 'Admin Dashboard' });
    await expect(dashboard).toBeVisible();

    const dashboardError = page.getByText('Failed to load admin metrics.');
    await expect(dashboardError).toHaveCount(0, { timeout: 10000 });

    await page.waitForTimeout(2000);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
});
