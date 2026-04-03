import { defineStore } from 'pinia'

export interface GameConfig {
  startingBalance: number
  levelEntryFee: number
  levelUpThreshold: number
  evBonusMultiplier: number
  level1AiErrorRate: number
  rehabPayoutCap: number
}

export const useConfigStore = defineStore('config', {
  state: () => ({
    config: null as GameConfig | null,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    async loadConfig() {
      this.isLoading = true
      try {
        const response = await fetch('/config/game-config.json')
        if (!response.ok) throw new Error('Failed to load config')
        const config = await response.json()

        if (!config || typeof config !== 'object') {
          throw new Error('Invalid configuration format')
        }

        const requiredKeys = ['startingBalance', 'levelEntryFee', 'levelUpThreshold', 'evBonusMultiplier', 'level1AiErrorRate', 'rehabPayoutCap']
        const missingKeys = requiredKeys.filter(k => !(k in config))

        if (missingKeys.length > 0) {
          throw new Error(`Missing configuration keys: ${missingKeys.join(', ')}`)
        }

        this.config = config as GameConfig
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : String(err)
        console.error('Config load error:', err)
      } finally {
        this.isLoading = false
      }
    }
  }
})
