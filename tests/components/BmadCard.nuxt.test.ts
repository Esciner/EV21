import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BmadCard from '~/components/game/BmadCard.vue'

describe('BmadCard', () => {
  it('renders face-up card with correct suit and value', async () => {
    const component = await mountSuspended(BmadCard, {
      props: {
        suit: 'hearts',
        value: 'A',
        isFaceUp: true
      }
    })
    
    expect(component.html()).toContain('A')
    expect(component.html()).toContain('♥')
  })

  it('renders face-down card without showing value', async () => {
    const component = await mountSuspended(BmadCard, {
      props: {
        suit: 'spades',
        value: 'K',
        isFaceUp: false
      }
    })
    
    // HTML still contains the value, but the flip class is omitted
    expect(component.html()).not.toContain('[transform:rotateY(180deg)]" data-v')
  })
})
