<script setup lang="ts">
import { GamePhase } from '~/types/game';
const { t } = useI18n();

definePageMeta({
  ssr: false
});

const gameStore = useGameStore();
const economyStore = useEconomyStore();
const configStore = useConfigStore();

onMounted(async () => {
  await configStore.loadConfig();
});
</script>

<template>
  <div class="game-container min-h-screen bg-felt-green text-ivory p-4 font-sans">
    <header class="flex justify-between items-center mb-8">
      <div class="balance-info">
        <span class="text-gold font-bold">{{ t('game.balance') }}:</span> {{ economyStore.balance }} 🪙
      </div>
      <div class="level-info">
        <span class="text-gold font-bold">{{ t('game.level') }}:</span> {{ economyStore.level }}
      </div>
    </header>

    <main class="table-area flex flex-col items-center justify-center py-12 border-2 border-felt-green-light rounded-3xl shadow-inner relative overflow-hidden">
      <!-- Loading Overlay -->
      <div v-if="configStore.isLoading" class="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-4xl text-gold" />
        <span class="ml-4 text-xl">{{ t('game.loading') }}</span>
      </div>

      <div v-else-if="configStore.error" class="text-error p-4 bg-error/10 border border-error rounded">
        {{ t('game.error') }}: {{ configStore.error }}
      </div>

      <div v-else class="text-center">
        <h2 class="text-2xl font-mono mb-4 italic text-gold-light">{{ t('game.tableTitle') }}</h2>
        <p class="mb-8 opacity-75">{{ t('game.readyToPlay') }}</p>
        
        <div class="phase-indicator p-2 bg-black/30 rounded font-mono text-sm mb-8">
          {{ t('game.phase') }}: {{ gameStore.currentPhase }}
        </div>

        <div class="actions flex gap-4">
          <UButton 
            v-if="gameStore.currentPhase === GamePhase.IDLE"
            class="bg-gold text-black hover:bg-gold-light" 
            size="xl" 
            @click="gameStore.setPhase(GamePhase.BETTING)"
          >
            {{ t('game.start') }}
          </UButton>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.game-container {
  background-image: radial-gradient(circle at center, var(--color-felt-green-light) 0%, var(--color-felt-green) 100%);
}
</style>
