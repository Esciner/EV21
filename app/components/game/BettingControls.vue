<template>
  <div class="flex flex-col items-center gap-4 p-4 w-full max-w-md mx-auto">
    <div class="text-lg font-semibold text-white">
      Current Bet: ${{ currentBet }}
    </div>

    <div class="flex flex-wrap justify-center gap-4 mb-4">
      <button
        v-for="chip in chips"
        :key="chip"
        :class="[
          'w-14 h-14 rounded-full border-4 shadow-lg font-bold text-lg flex items-center justify-center transition-transform',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
          'active:scale-95 hover:-translate-y-1',
          currentBet === chip
            ? 'border-yellow-400 focus-visible:ring-yellow-400 scale-110'
            : 'border-white focus-visible:ring-white opacity-80 hover:opacity-100',
          getChipColor(chip)
        ]"
        :aria-label="`Bet $${chip}`"
        :aria-pressed="currentBet === chip"
        :disabled="disabled"
        @click="selectBet(chip)"
      >
        ${{ chip }}
      </button>
    </div>

    <button
      class="w-full py-4 text-xl font-bold bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-xl transition-all active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="disabled || currentBet <= 0"
      aria-label="Deal"
      @click="handleDeal"
    >
      {{ $t ? $t('game.deal') : 'Deal' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  lastBet: {
    type: Number,
    default: 10
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['deal', 'update:bet'])

const chips = [1, 5, 10, 25, 100]
const currentBet = ref(props.lastBet)

function selectBet(amount: number) {
  currentBet.value = amount
  emit('update:bet', amount)
}

function handleDeal() {
  if (currentBet.value > 0) {
    emit('deal', currentBet.value)
  }
}

function getChipColor(amount: number) {
  switch (amount) {
    case 1: return 'bg-gray-200 text-gray-800'
    case 5: return 'bg-red-600 text-white'
    case 10: return 'bg-blue-600 text-white'
    case 25: return 'bg-green-600 text-white'
    case 100: return 'bg-black text-white'
    default: return 'bg-purple-600 text-white'
  }
}
</script>
