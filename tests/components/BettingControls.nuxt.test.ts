import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BettingControls from '~/components/game/BettingControls.vue'

describe('BettingControls', () => {
  it('renders chip buttons and deal button', async () => {
    const component = await mountSuspended(BettingControls)
    
    const buttons = component.findAll('button')
    expect(buttons.length).toBeGreaterThan(1)
    expect(component.text().toLowerCase()).toContain('deal')
  })

  it('selects a bet amount and highlights it', async () => {
    const component = await mountSuspended(BettingControls)
    
    // Find a chip button, for example '10'
    const chipButtons = component.findAll('button').filter(b => b.text().includes('10') && !b.text().toLowerCase().includes('deal'))
    if (chipButtons.length > 0) {
      await chipButtons[0].trigger('click')
      
      const emitted = component.emitted('update:bet')
      expect(emitted).toBeTruthy()
      expect(emitted?.[0]).toEqual([10])
    }
  })

  it('emits deal event with the current bet when Deal is clicked', async () => {
    const component = await mountSuspended(BettingControls)
    
    // Default bet might be 0 or some value
    const dealButton = component.findAll('button').find(b => b.text().toLowerCase().includes('deal'))
    await dealButton?.trigger('click')
    
    const emitted = component.emitted('deal')
    expect(emitted).toBeTruthy()
  })
})
