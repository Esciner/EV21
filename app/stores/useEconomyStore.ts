import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useEconomyStore = defineStore('economy', {
  state: () => {
    try {
      return {
        balance: useLocalStorage('bmad:balance', 1000),
        currentLevelInLocalStorage: useLocalStorage('bmad:level', 1)
      };
    } catch (e) {
      console.error('Failed to initialize localStorage:', e);
      return {
        balance: 1000,
        currentLevelInLocalStorage: 1
      };
    }
  },

  getters: {
    level: (state): number => {
      const val = state.currentLevelInLocalStorage as any;
      return typeof val === 'object' && val !== null && 'value' in val ? val.value : val;
    }
  },

  actions: {
    addBalance(amount: number) {
      this.balance += amount;
    },
    subtractBalance(amount: number) {
      this.balance = Math.max(0, this.balance - amount);
    },
    setLevel(lvl: 1 | 2) {
      this.currentLevelInLocalStorage = lvl;
    },
    resetBalance() {
      // @ts-ignore - handle potential Ref/number mismatch in mock vs real
      if (this.balance && typeof this.balance === 'object' && 'value' in this.balance) {
        (this.balance as any).value = 1000;
      } else {
        this.balance = 1000;
      }
      
      // @ts-ignore
      if (this.currentLevelInLocalStorage && typeof this.currentLevelInLocalStorage === 'object' && 'value' in this.currentLevelInLocalStorage) {
        (this.currentLevelInLocalStorage as any).value = 1;
      } else {
        this.currentLevelInLocalStorage = 1;
      }
    }
  }
});
