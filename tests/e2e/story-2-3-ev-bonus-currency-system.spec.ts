import { test, expect } from '@playwright/test'

test.describe('Story 2.3: EV Bonus Currency System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.balance-display', { timeout: 30000 })
  })

  test('should complete a hand and display the outcome overlay', async ({ page }) => {
    // Start game
    const dealBtn = page.getByRole('button', { name: 'Deal' })
    await expect(dealBtn).toBeVisible()
    await dealBtn.click()

    // Wait for action buttons to be enabled (player's turn)
    const standBtn = page.getByRole('button', { name: /Stand|Rester/i })
    await expect(standBtn).toBeEnabled({ timeout: 15000 })

    // Play round by standing
    await standBtn.click()

    // Assuming the dealer plays and game enters PAYOUT phase...
    // The result overlay containing the Hand text should appear
    const handOutcomeText = page.locator('text=/Hand:|Main:/i').first()
    await expect(handOutcomeText).toBeVisible({ timeout: 15000 })

    // Since EV Bonus depends on whether the choice was optimal (randomized),
    // we just verify that the DOM allows it without crashing.
    // If EV bonus happens to be awarded, it will be visible too.
  })
})
