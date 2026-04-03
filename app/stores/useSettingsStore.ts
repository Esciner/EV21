import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      expertMode: useLocalStorage('bmad:expert-mode', false),
      soundVolume: useLocalStorage('bmad:sound-volume', 0.5),
      showOnboarding: useLocalStorage('bmad:show-onboarding', true)
    }
  },

  actions: {
    toggleExpertMode() {
      this.expertMode = !this.expertMode
    },
    setVolume(vol: number) {
      this.soundVolume = Math.max(0, Math.min(1, vol))
    },
    completeOnboarding() {
      this.showOnboarding = false
    }
  }
})
