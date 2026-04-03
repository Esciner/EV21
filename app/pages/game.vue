<script setup lang="ts">
import { ref } from 'vue'
import { GamePhase } from '~/types/game';
import BmadCard from '~/components/game/BmadCard.vue'

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

// Mock state for the UI story
const dealerCards = ref<{suit: 'hearts' | 'diamonds' | 'clubs' | 'spades', value: string, isFaceUp: boolean}[]>([])
const playerCards = ref<{suit: 'hearts' | 'diamonds' | 'clubs' | 'spades', value: string, isFaceUp: boolean}[]>([])

const dealMockCards = () => {
  dealerCards.value = [
    { suit: 'spades', value: 'hidden', isFaceUp: false },
    { suit: 'hearts', value: 'K', isFaceUp: true }
  ];
  playerCards.value = [
    { suit: 'diamonds', value: '10', isFaceUp: true },
    { suit: 'clubs', value: 'A', isFaceUp: true }
  ];
  gameStore.setPhase(GamePhase.PLAYER_TURN)
}
</script>

<template>
  <!-- Background specifically for desktop App-in-a-Box -->
  <div class="min-h-screen bg-black lg:bg-casino-pattern lg:p-8 flex items-center justify-center">
    
    <!-- App Container -->
    <div class="game-container w-full h-screen lg:h-[850px] sm:max-w-[600px] mx-auto bg-felt-green text-ivory flex flex-col font-sans lg:rounded-3xl lg:shadow-2xl lg:border-4 lg:border-[#2a4522] overflow-hidden backdrop-blur-md relative">
      
      <!-- Loading Overlay -->
      <div v-if="configStore.isLoading" class="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-4xl text-gold" />
        <span class="ml-4 text-xl">{{ t('game.loading') }}</span>
      </div>
      <div v-else-if="configStore.error" class="text-error p-4 bg-error/10 border border-error rounded absolute top-0 w-full z-50">
        {{ t('game.error') }}: {{ configStore.error }}
      </div>

      <!-- Zone 1: Balance Bar (40px approx via p-2) -->
      <header class="flex justify-between items-center p-2 min-h-[40px] bg-black/40">
        <div class="balance-info text-sm">
          <span class="text-gold font-bold">{{ t('game.balance') }}:</span> {{ economyStore.balance }} 🪙
        </div>
        <div class="level-info text-sm">
          <span class="text-gold font-bold">{{ t('game.level') }}:</span> {{ economyStore.level }}
        </div>
      </header>

      <!-- Table Area container spanning remaining height -->
      <main class="flex-grow flex flex-col relative px-4">
        
        <!-- Zone 2: Dealer Area (120px) fixed height to prevent layout shift -->
        <div class="dealer-area w-full min-h-[140px] flex justify-center items-center py-4">
          <TransitionGroup name="deal" tag="div" class="flex justify-center -space-x-8">
            <BmadCard 
              v-for="(card, idx) in dealerCards" 
              :key="'dealer-'+idx" 
              :suit="card.suit" 
              :value="card.value" 
              :isFaceUp="card.isFaceUp" 
            />
          </TransitionGroup>
        </div>

        <!-- Zone 3: EV Feedback Zone (60px) fixed height -->
        <div class="ev-feedback-zone w-full min-h-[60px] flex items-center justify-center">
          <div v-if="gameStore.currentPhase === GamePhase.PLAYER_TURN" class="bg-black/50 px-4 py-2 rounded-full text-sm font-mono text-gold-light border border-gold/30">
            Current EV: --
          </div>
        </div>

        <!-- Zone 4: Player Area (120px) fixed height -->
        <div class="player-area w-full min-h-[140px] flex justify-center items-center py-4">
          <TransitionGroup name="deal" tag="div" class="flex justify-center -space-x-8">
            <BmadCard 
              v-for="(card, idx) in playerCards" 
              :key="'player-'+idx" 
              :suit="card.suit" 
              :value="card.value" 
              :isFaceUp="card.isFaceUp" 
            />
          </TransitionGroup>
        </div>

      </main>

      <!-- Footer Action & Betting Controls -->
      <div class="footer-area bg-black/60 pt-4 pb-6 px-4">
        <!-- Zone 5: Action Buttons (80px) -->
        <div class="action-buttons w-full min-h-[80px] flex items-center justify-center gap-4">
          <template v-if="gameStore.currentPhase === GamePhase.IDLE">
            <UButton class="bg-gold text-black hover:bg-gold-light font-bold" size="xl" @click="dealMockCards">
              DEAL CARDS
            </UButton>
          </template>
          <template v-else>
            <UButton class="bg-blue-600 text-white" size="lg">HIT</UButton>
            <UButton class="bg-red-600 text-white" size="lg">STAND</UButton>
            <UButton class="bg-gray-600 text-white" size="lg">RESET</UButton>
          </template>
        </div>

        <!-- Zone 6: Betting Controls (60px) -->
        <div class="betting-controls w-full min-h-[60px] flex justify-center items-center mt-2 opacity-50">
          <div class="text-xs">Betting controls placeholder</div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.game-container {
  background-image: radial-gradient(circle at center, var(--color-felt-green-light, #2e7d32) 0%, var(--color-felt-green, #1b5e20) 100%);
}

.deal-enter-active {
  transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
.deal-enter-from {
  opacity: 0;
  transform: translateY(-200%) scale(0.5);
}
</style>
