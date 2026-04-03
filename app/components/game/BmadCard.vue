<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  value: string
  isFaceUp: boolean
}>()

const isRed = computed(() => ['hearts', 'diamonds'].includes(props.suit))
const suitSymbol = computed(() => {
  switch (props.suit) {
    case 'hearts': return '♥'
    case 'diamonds': return '♦'
    case 'clubs': return '♣'
    case 'spades': return '♠'
    default: return ''
  }
})
// 4.5:1 contrast against #FFFDD0 ivory: text-red-800 & text-black
const colorClass = computed(() => isRed.value ? 'text-red-800' : 'text-black')
</script>

<template>
  <Transition name="deal">
    <div class="card-container group [perspective:1000px] w-16 sm:w-24 h-24 sm:h-36 shrink-0 z-10 mx-1">
      <div 
        class="card-inner relative w-full h-full transition-transform duration-400 [transform-style:preserve-3d]"
        :class="{ '[transform:rotateY(180deg)]': props.isFaceUp }"
      >
        <!-- Back of the card -->
        <div class="card-face card-back absolute inset-0 backface-hidden bg-blue-900 border-2 border-white rounded-lg shadow w-full h-full">
          <div class="w-full h-full border-2 border-dashed border-blue-400 rounded-md"></div>
        </div>
        
        <!-- Front of the card (rotated 180deg by default so when card is face up and container rotates 180, it faces forward) -->
        <div 
          class="card-face card-front absolute inset-0 backface-hidden bg-[#FFFDD0] border rounded-lg shadow-lg flex flex-col justify-between p-1 sm:p-2 [transform:rotateY(180deg)]"
          :class="colorClass"
        >
          <div class="text-xs sm:text-base font-bold leading-none">{{ props.value }}</div>
          <div class="text-xl sm:text-3xl text-center flex-grow flex items-center justify-center">{{ suitSymbol }}</div>
          <div class="text-xs sm:text-base font-bold leading-none rotate-180 self-end">{{ props.value }}</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.deal-enter-active {
  transition: transform 400ms ease-out;
}
.deal-enter-from {
  transform: translateY(-200%);
}
.deal-enter-to {
  transform: translateY(0);
}
</style>
