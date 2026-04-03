import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEconomyStore } from './useEconomyStore'

// Mock useLocalStorage from VueUse
vi.mock('@vueuse/core', () => ({
  useLocalStorage: vi.fn((key, defaultValue) => {
    return defaultValue
  })
}))

describe('useEconomyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default balance and level', () => {
    const store = useEconomyStore()
    expect(store.balance).toBe(1000)
    expect(store.level).toBe(1)
  })

  it('should reset balance correctly', () => {
    const store = useEconomyStore()
    store.balance = 5000
    store.setLevel(2)

    store.resetBalance()

    expect(store.balance).toBe(1000)
    expect(store.level).toBe(1)
  })
})
