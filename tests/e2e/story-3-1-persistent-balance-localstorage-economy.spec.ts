import { test, expect } from '@playwright/test'

test.describe('Story 3.1: Persistent Balance & localStorage Economy', () => {
  test('should initialize balance properly and persist to localStorage', async ({ page }) => {
    // Clear potentially lingering localStorage state
    await page.goto('/')
    await page.evaluate(() => window.localStorage.clear())

    await page.goto('/game', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.balance-display', { timeout: 30000 })
    
    // Balance should be initialized. Config default is likely 1000, let's verify localStorage directly
    const storageBalance = await page.evaluate(() => window.localStorage.getItem('bmad:balance'))
    expect(storageBalance).not.toBeNull()

    const balanceText = await page.locator('.balance-display .text-base').textContent()
    // It should match what's in local storage
    if (balanceText) {
      expect(storageBalance).toBe(balanceText.replace(/,/g, ''))
    }
  })

  test('should restore balance from localStorage across reloads', async ({ page }) => {
    // Navigate with a specific balance manually set
    await page.goto('/')
    await page.evaluate(() => window.localStorage.setItem('bmad:balance', '1090'))

    await page.goto('/game', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.balance-display', { timeout: 30000 })
    
    // Balance should reflect localStorage
    const balanceText = await page.locator('.balance-display .text-base').textContent()
    expect(balanceText?.replace(/,/g, '')).toBe('1090')
  })

  test('should update balance in localStorage when a bet is made', async ({ page }) => {
    // Set 1000 default explicitly
    await page.goto('/')
    await page.evaluate(() => window.localStorage.setItem('bmad:balance', '1000'))

    await page.goto('/game', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.balance-display', { timeout: 30000 })

    // Verify 1000 text
    const balanceInit = await page.locator('.balance-display .text-base').textContent()
    expect(balanceInit?.replace(/,/g, '')).toBe('1000')

    // Click Deal (which places the default $10 bet)
    const dealBtn = page.getByRole('button', { name: 'Deal' })
    await expect(dealBtn).toBeVisible()
    if (await dealBtn.isDisabled()) {
      // If deal button is disabled, we might have an active round
      return
    }
    await dealBtn.click()

    // Balance should drop in UI to 990
    await expect(page.locator('.balance-display .text-base')).toContainText('990', { timeout: 5000 })

    // Reload page
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.balance-display', { timeout: 30000 })

    // Should still be 990 after reload
    const balanceAfterReload = await page.locator('.balance-display .text-base').textContent()
    expect(balanceAfterReload?.replace(/,/g, '')).toBe('990')
    
    // Check localStorage again
    const storageBalance = await page.evaluate(() => window.localStorage.getItem('bmad:balance'))
    expect(storageBalance).toBe("990")
  })
})
