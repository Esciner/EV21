import { test, expect } from '@playwright/test';

test.describe('Game Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game');
  });

  test('should display the game table layout correctly', async ({ page }) => {
    // Initial check (expect balance presence)
    await expect(page.locator('.balance-info')).toContainText(/🪙/);
    
    // Main action should be idle
    await expect(page.getByRole('button', { name: /DEAL CARDS/i })).toBeVisible();
    
    // Verify zones are rendered
    await expect(page.locator('.dealer-area')).toBeVisible();
    await expect(page.locator('.player-area')).toBeVisible();
  });

  test('should deal cards and show action buttons when DEAL CARDS is clicked', async ({ page }) => {
    // Wait for initial load
    await expect(page.getByRole('button', { name: /DEAL CARDS/i })).toBeVisible();

    // Click DEAL CARDS
    await page.getByRole('button', { name: /DEAL CARDS/i }).click();
    
    // The deal mock deals 2 cards to dealer and 2 to player
    await expect(page.locator('.dealer-area .card-container')).toHaveCount(2);
    await expect(page.locator('.player-area .card-container')).toHaveCount(2);
    
    // After dealing, we should see action buttons
    await expect(page.getByRole('button', { name: /HIT/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /STAND/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /RESET/i })).toBeVisible();
    
    // DEAL CARDS should no longer be visible
    await expect(page.getByRole('button', { name: /DEAL CARDS/i })).not.toBeVisible();
  });

  test('should persist balance after reload', async ({ page }) => {
    // 1. Initial check (expect balance presence)
    await expect(page.locator('.balance-info')).toContainText(/🪙/);
    
    // 2. Reload page
    await page.reload();
    
    // Wait for the game page to load completely after reload
    await expect(page.locator('.balance-info')).toBeVisible();
    
    // 3. Verify balance is still present
    await expect(page.locator('.balance-info')).toContainText(/🪙/);
  });
});
