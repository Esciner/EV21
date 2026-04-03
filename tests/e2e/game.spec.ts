import { test, expect } from '@playwright/test';

test.describe('Game Page - Core Engine (Story 1.3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game', { timeout: 60000, waitUntil: 'domcontentloaded' });
    // Wait for config to load and UI to render
    await page.waitForSelector('.phase-indicator', { timeout: 30000 });
  });

  test('should display game table with phase indicator in IDLE state', async ({ page }) => {
    await expect(page.locator('h2')).toContainText(/Table/i);
    await expect(page.locator('.phase-indicator')).toContainText('IDLE');
  });

  test('should display balance and level in header', async ({ page }) => {
    await expect(page.locator('.balance-info')).toBeVisible();
    await expect(page.locator('.level-info')).toBeVisible();
    // Default balance should be 1000
    await expect(page.locator('.balance-info')).toContainText('1000');
  });

  test('should show Start button when in IDLE phase', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /COMMENCER/i });
    await expect(startButton).toBeVisible();
  });

  test('should transition to BETTING phase when Start is clicked', async ({ page }) => {
    const startButton = page.getByRole('button', { name: /COMMENCER/i });
    await startButton.click();

    // Button should disappear after clicking (it's only visible in IDLE)
    await expect(startButton).not.toBeVisible();
    // Phase indicator should show BETTING
    await expect(page.locator('.phase-indicator')).toContainText('BETTING');
  });

  test('should render game container with felt-green background', async ({ page }) => {
    const container = page.locator('.game-container');
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/bg-felt-green/);
  });

  test('should persist balance after page reload', async ({ page }) => {
    await expect(page.locator('.balance-info')).toContainText('1000');
    await page.reload({ timeout: 60000 });
    await page.waitForSelector('.phase-indicator', { timeout: 15000 });
    await expect(page.locator('.balance-info')).toContainText('1000');
  });

  test('should eventually show phase indicator after loading', async ({ page }) => {
    // The page should show the phase indicator once config is loaded
    // This validates the loading -> ready transition completes
    const phaseIndicator = page.locator('.phase-indicator');
    await expect(phaseIndicator).toBeVisible({ timeout: 15000 });
    await expect(phaseIndicator).toContainText('IDLE');
  });
});
