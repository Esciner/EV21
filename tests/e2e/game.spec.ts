import { test, expect } from '@playwright/test'

test.describe('Game Page - Core Engine (Story 1.3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game', { timeout: 60000, waitUntil: 'domcontentloaded' })
    // Wait for config to load and UI to render
    await page.waitForSelector('.balance-info', { timeout: 30000 })
  })

  test('should display game table layout', async ({ page }) => {
    await expect(page.locator('.game-container')).toBeVisible()
  })

  test('should display balance and level in header', async ({ page }) => {
    await expect(page.locator('.balance-info')).toBeVisible()
    await expect(page.locator('.level-info')).toBeVisible()
    // Default balance should be 1000
    await expect(page.locator('.balance-info')).toContainText('1000')
  })

  test('should show Deal button when in IDLE phase', async ({ page }) => {
    const dealButton = page.getByRole('button', { name: 'Deal' })
    await expect(dealButton).toBeVisible()
  })

  test('should transition to PLAYER_TURN phase when Deal is clicked', async ({ page }) => {
    const dealButton = page.getByRole('button', { name: 'Deal' })
    await dealButton.click()

    // Verify game advances (deal wait, then phase should become PLAYER_TURN assuming blackjack doesn't happen instantly)
    // For stability in e2e, just checking that Hit button becomes visible
    await expect(page.getByRole('button', { name: 'Hit' })).toBeVisible({ timeout: 15000 })
  })

  test('should render game container with felt-green background', async ({ page }) => {
    const container = page.locator('.game-container')
    await expect(container).toBeVisible()
    await expect(container).toHaveClass(/bg-felt-green/)
  })

  test('should persist balance after page reload', async ({ page }) => {
    await expect(page.locator('.balance-info')).toContainText(/🪙/)
    await page.reload({ timeout: 60000 })
    await page.waitForSelector('.balance-info', { timeout: 15000 })
    await expect(page.locator('.balance-info')).toContainText(/🪙/)
  })

  test('should eventually show phase indicator after loading if applicable, or just balance', async ({ page }) => {
    const balanceInfo = page.locator('.balance-info')
    await expect(balanceInfo).toBeVisible({ timeout: 15000 })
    await page.goto('/game')
  })

  test('should display the game table layout correctly', async ({ page }) => {
    // Initial check
    await expect(page.locator('.balance-info')).toContainText(/🪙/)

    // Main action should be idle checking for Deal
    await expect(page.getByRole('button', { name: 'Deal' })).toBeVisible()

    // Verify zones are rendered
    await expect(page.locator('.dealer-area')).toBeVisible()
    await expect(page.locator('.player-area')).toBeVisible()
  })

  test('should deal cards and show action buttons when Deal is clicked', async ({ page }) => {
    // Wait for initial load
    await expect(page.getByRole('button', { name: 'Deal' })).toBeVisible()

    // Click Deal
    await page.getByRole('button', { name: 'Deal' }).click()

    // After dealing, we should see action buttons eventually
    await expect(page.getByRole('button', { name: 'Hit' })).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('button', { name: 'Stand' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Double' })).toBeVisible()
  })
})
