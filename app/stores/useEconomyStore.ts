import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useToast, useI18n } from '#imports'
import gameConfig from '../../public/config/game-config.json'

export const useEconomyStore = defineStore('economy', () => {
  // Track if we already showed the toast so we don't spam it for every key
  let toastShown = false

  const initializeKey = (key: string, defaultValue: number) => {
    return useLocalStorage(key, defaultValue, {
      onError: (e) => {
        console.error(`Failed to handle localStorage for ${key}:`, e)
        try {
          if (!toastShown) {
            const toast = useToast()
            const { t } = useI18n()
            toast.add({
              title: t('economy.storage_error_title'),
              description: t('economy.storage_error_desc'),
              color: 'red'
            })
            toastShown = true
          }
        } catch (toastErr) {
          console.error('Failed to show toast', toastErr)
        }
      }
    })
  }

  const balance = initializeKey('bmad:balance', gameConfig.startingBalance || 1000)
  const currentLevelInLocalStorage = initializeKey('bmad:level', 1)

  const level = computed(() => Number(currentLevelInLocalStorage.value))

  function addBalance(amount: number) {
    if (amount > 0) balance.value += amount
  }

  function subtractBalance(amount: number) {
    if (amount > 0) balance.value = Math.max(0, balance.value - amount)
  }

  function setLevel(lvl: 1 | 2) {
    currentLevelInLocalStorage.value = lvl
  }

  function resetBalance() {
    balance.value = gameConfig.startingBalance || 1000
    currentLevelInLocalStorage.value = 1
  }

  return {
    balance,
    currentLevelInLocalStorage,
    level,
    addBalance,
    subtractBalance,
    setLevel,
    resetBalance
  }
})
