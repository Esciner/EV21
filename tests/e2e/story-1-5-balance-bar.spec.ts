import { test, expect } from '@playwright/test'

test.describe('Story 1.5: Balance Bar & Game Chrome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.balance-display', { timeout: 30000 })
  })

  test('should display the balance bar container correctly', async ({ page }) => {
    const header = page.locator('.balance-display').locator('..')
    await expect(header).toBeVisible()
    await expect(header).toHaveClass(/bg-black\/60/)
  })

  test('should display current balance with proper formatting', async ({ page }) => {
    const balanceDisplay = page.locator('.balance-display')
    await expect(balanceDisplay).toBeVisible()
    await expect(balanceDisplay).toContainText(/[0-9]+/)
  })

  test('should display the current level', async ({ page }) => {
    const levelBadge = page.locator('.level-badge')
    await expect(levelBadge).toBeVisible()
    await expect(levelBadge).toContainText(/[0-9]+/)
  })

  test('should have a settings button available', async ({ page }) => {
    const settingsBtn = page.locator('.settings-btn')
    await expect(settingsBtn).toBeVisible()
  })

  test('should have the correct text color', async ({ page }) => {
    const balanceDisplay = page.locator('.balance-display')
    await expect(balanceDisplay).toBeVisible()
    await expect(balanceDisplay).toHaveClass(/text-gold|-gold/)
  })
})
