<script setup lang="ts">
import { useEconomyStore } from '~/stores/useEconomyStore'
import { ref, watch, onBeforeUnmount } from 'vue'

const economyStore = useEconomyStore()

const isFlashing = ref(false)
let flashTimer: ReturnType<typeof setTimeout> | null = null

watch(() => economyStore.balance, (newVal, oldVal) => {
  if (newVal > oldVal) {
    if (flashTimer) clearTimeout(flashTimer)
    isFlashing.value = true
    flashTimer = setTimeout(() => {
      isFlashing.value = false
    }, 300)
  }
})

onBeforeUnmount(() => {
  if (flashTimer) clearTimeout(flashTimer)
})
</script>

<template>
  <header class="h-[40px] flex-none w-full flex justify-between items-center px-4 bg-black/60 backdrop-blur z-50 border-b border-white/10">
    <div 
      class="balance-display font-mono text-sm leading-none flex items-center transition-all duration-300"
      :class="[isFlashing ? 'text-gold-light scale-105 drop-shadow-[0_0_8px_rgba(232,212,139,0.8)]' : 'text-gold']"
      :aria-label="$t('game.balance')"
      role="group"
    >
      <span class="sr-only">{{ $t('game.balance') }}</span>
      <ChipStack :balance="economyStore.balance" class="mr-3" />
      <span aria-hidden="true" class="text-base">{{ economyStore.balance.toLocaleString() }}</span>
      <UIcon name="i-heroicons-banknotes" class="ml-1 text-lg" aria-hidden="true" />
    </div>
    
    <div class="level-badge flex items-center">
      <UBadge color="gray" variant="solid" class="font-bold border border-gold/30 uppercase">
        {{ $t('game.level') }} {{ economyStore.level }}
      </UBadge>
    </div>
    
    <div class="flex items-center">
      <UButton 
        class="settings-btn"
        icon="i-heroicons-cog-8-tooth" 
        color="gray" 
        variant="ghost" 
        :aria-label="$t('game.settings')"
      />
    </div>
  </header>
</template>
