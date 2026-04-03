import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CasinoActionButton from '~/components/game/CasinoActionButton.vue'

describe('CasinoActionButton', () => {
  it('renders a button with correct text', async () => {
    const component = await mountSuspended(CasinoActionButton, {
      props: {
        label: 'Hit',
        action: 'hit'
      }
    })
    
    expect(component.text()).toContain('Hit')
    expect(component.classes()).toContain('min-w-[48px]')
    expect(component.classes()).toContain('min-h-[48px]')
    expect(component.classes()).toContain('active:scale-95')
  })

  it('handles disabled state correctly without layout shift', async () => {
    const component = await mountSuspended(CasinoActionButton, {
      props: {
        label: 'Hit',
        action: 'hit',
        disabled: true
      }
    })
    
    const button = component.find('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.classes()).toContain('opacity-50')
    expect(button.classes()).toContain('cursor-not-allowed')
  })

  it('emits click event when clicked', async () => {
    const component = await mountSuspended(CasinoActionButton, {
      props: {
        label: 'Hit',
        action: 'hit'
      }
    })
    
    await component.trigger('click')
    const emitted = component.emitted('action')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual(['hit'])
  })
})
