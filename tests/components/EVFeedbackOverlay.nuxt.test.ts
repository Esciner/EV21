import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import EVFeedbackOverlay from '~/components/game/EVFeedbackOverlay.vue'

describe('EVFeedbackOverlay', () => {
  const globalOptions = {
    mocks: {
      $t: (msg: string) => msg
    }
  }

  it('renders nothing when not active', async () => {
    const component = await mountSuspended(EVFeedbackOverlay, {
      props: {
        actionType: null,
        message: '',
        explanation: ''
      },
      global: globalOptions
    })
    
    // Should be completely empty or just comment
    expect(component.html()).toContain('<!--v-if-->')
  })

  it('renders optimal feedback', async () => {
    const component = await mountSuspended(EVFeedbackOverlay, {
      props: {
        actionType: 'optimal',
        message: 'ev.positive_feedback',
        explanation: ''
      },
      global: globalOptions
    })

    // Should have gold shimmer class
    expect(component.html()).toContain('gold-shimmer')
    // Should have the message text or i18n key content
    expect(component.html()).toContain('ev.positive_feedback')
  })

  it('renders suboptimal feedback with tooltip', async () => {
    const component = await mountSuspended(EVFeedbackOverlay, {
      props: {
        actionType: 'suboptimal',
        message: '',
        explanation: 'ev.explanation_hit_on_16'
      },
      global: globalOptions
    })

    // Should have red warning glow class
    expect(component.html()).toContain('red-warning-glow')
    // Should have the explanation string
    expect(component.html()).toContain('ev.explanation_hit_on_16')
  })

  it('dismisses tooltip on click (AC 6)', async () => {
    const component = await mountSuspended(EVFeedbackOverlay, {
      props: {
        actionType: 'suboptimal',
        message: '',
        explanation: 'ev.explanation_generic'
      },
      global: globalOptions
    })

    // Tooltip should be visible initially
    expect(component.find('.tooltip').exists()).toBe(true)

    // Click to dismiss
    await component.find('.tooltip').trigger('click')

    // Tooltip should be dismissed
    expect(component.find('.tooltip').exists()).toBe(false)

    // Should have emitted dismiss event
    expect(component.emitted('dismiss-tooltip')).toBeTruthy()
  })
})
