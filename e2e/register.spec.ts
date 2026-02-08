import { test, expect } from '@playwright/test';

test('register new account', async ({ page }) => {
  await page.goto('/register');

  const ts = Date.now();
  const email = `e2e-${ts}@test.local`;
  const password = 'password123';

  await page.getByTestId('register-name').fill('E2E User');
  await page.getByTestId('register-email').fill(email);
  await page.getByTestId('register-password').fill(password);
  await page.getByTestId('register-confirmPassword').fill(password);

  await page.getByTestId('register-submit').click();

  await expect(page).toHaveURL('/', { timeout: 10000 });
});
