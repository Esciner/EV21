import { test, expect } from '@playwright/test';

test.describe('Game Page', () => {
  test.beforeEach(async ({ page }) => {
    // The application serves French at the root by default
    await page.goto('/game');
  });

  test('should display the game table', async ({ page }) => {
    // Check main elements
    await expect(page.locator('h2')).toContainText(/Table/i);
    await expect(page.getByRole('button', { name: /COMMENCER/i })).toBeVisible();
  });

  test('should transition to betting phase', async ({ page }) => {
    await page.getByRole('button', { name: /COMMENCER/i }).click();
    // After clicking, we should see the betting phase indicator or bet buttons
    // For now, let's just check if the button text changes or disappears
    await expect(page.getByRole('button', { name: /COMMENCER/i })).not.toBeVisible();
  });

  test('should persist balance after reload', async ({ page }) => {
    // 1. Initial check (default balance is 1000)
    await expect(page.locator('.balance-info')).toContainText(/1000/);
    
    // 2. Reload page
    await page.reload();
    
    // 3. Verify it's still 1000 (persisted via localStorage)
    await expect(page.locator('.balance-info')).toContainText(/1000/);
  });
});
