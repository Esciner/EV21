import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { useEconomyStore } from '~/stores/useEconomyStore'
import BalanceBar from '~/components/ui/BalanceBar.vue'

describe('BalanceBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders fixed bar with correct height and structure', async () => {
    const component = await mountSuspended(BalanceBar, {
      global: { mocks: { $t: (msg: string) => msg } }
    })
    
    // Check main container structure
    const header = component.find('header')
    expect(header.exists()).toBe(true)
    expect(header.classes()).toContain('h-[40px]') // Must be exactly 40px
    expect(header.classes()).toContain('flex-none')
  })

  it('renders the core elements: balance, level badge, and settings icon', async () => {
    const component = await mountSuspended(BalanceBar, {
      global: { mocks: { $t: (msg: string) => msg } }
    })
    const economyStore = useEconomyStore()
    
    // Balance
    expect(component.text()).toContain(economyStore.balance.toLocaleString())
    
    // Level Badge
    const badge = component.find('.level-badge')
    expect(component.text().toUpperCase()).toContain('GAME.LEVEL ' + economyStore.level)
    
    // Settings icon
    const settingsButton = component.find('.settings-btn')
    expect(settingsButton.exists()).toBe(true)
  })

  it('triggers flash animation when balance increases', async () => {
    const component = await mountSuspended(BalanceBar, {
      global: { mocks: { $t: (msg: string) => msg } }
    })
    const economyStore = useEconomyStore()
    
    // Check initial state
    const balanceWrapper = component.find('.balance-display')
    expect(balanceWrapper.classes()).not.toContain('animate-pulse') // or our custom flash class
    
    // Increase balance
    economyStore.addBalance(500)
    
    // Wait for Vue watcher
    await component.vm.$nextTick()
    
    // Should have flash class
    expect(balanceWrapper.classes()).toContain('text-gold-light') // We'll add this when flashing
  })
})
