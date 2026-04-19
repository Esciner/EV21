import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // The application serves French at the root by default
    await page.goto('/')
  })

  test('should display the main title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/Blackjack/i)
  })

  test('should navigate to the game page', async ({ page }) => {
    // Pick the first Play/Jouer button
    await page.getByRole('link', { name: /Jouer|Play/i }).first().click()
    await expect(page).toHaveURL(/.*\/game/)
  })
})
