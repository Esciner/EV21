import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConfigStore } from './useConfigStore'

// Mock fetch for JSON loading
vi.stubGlobal('fetch', vi.fn())

describe('useConfigStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useConfigStore()
    expect(store.config).toBeNull()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should load config correctly on success', async () => {
    const mockConfig = {
      startingBalance: 1000,
      levelEntryFee: 500,
      levelUpThreshold: 1500,
      evBonusMultiplier: 1.5,
      level1AiErrorRate: 0.4,
      rehabPayoutCap: 500
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockConfig)
    }))

    const store = useConfigStore()
    await store.loadConfig()

    expect(store.config).toEqual(mockConfig)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should handle loading errors for missing keys', async () => {
    const incompleteConfig = {
      startingBalance: 1000
      // missing other fields
    }

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(incompleteConfig)
    }))

    const store = useConfigStore()
    await store.loadConfig()

    expect(store.error).toContain('Missing configuration keys')
    expect(store.isLoading).toBe(false)
  })
})
