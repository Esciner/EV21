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
