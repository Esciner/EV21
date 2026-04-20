<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  amount: number
}>()

const show = ref(false)
const chips = ref<{ id: number, delay: number, startX: number, startY: number }[]>([])

onMounted(() => {
  for (let i = 0; i < 5; i++) {
    chips.value.push({
      id: i,
      delay: i * 0.15,
      startX: (Math.random() - 0.5) * 40,
      startY: (Math.random() - 0.5) * 40
    })
  }

  requestAnimationFrame(() => {
    show.value = true
  })
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-[100] flex items-center justify-center overflow-hidden">
    <!-- Center text popping up -->
    <div 
      class="absolute text-gold font-bold text-2xl tracking-widest uppercase drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
      :class="show ? 'animate-bonus-text' : 'opacity-0'"
    >
      +{{ amount }} EV
    </div>

    <!-- Chips flying out -->
    <div 
      v-for="chip in chips" 
      :key="chip.id"
      class="absolute w-8 h-8 rounded-full border-[2px] border-dashed border-gold bg-yellow-600/30 font-bold text-[10px] text-ivory flex items-center justify-center opacity-0 shadow-[0_0_10px_rgba(212,175,55,0.6)]"
      :class="show ? 'animate-fly-chip' : ''"
      :style="{
        '--start-x': `${chip.startX}px`,
        '--start-y': `${chip.startY}px`,
        animationDelay: `${chip.delay}s`
      }"
    >
      EV
    </div>
  </div>
</template>

<style scoped>
.animate-bonus-text {
  animation: popText 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-fly-chip {
  animation: flyChip 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes popText {
  0% { transform: scale(0.5); opacity: 0; }
  20% { transform: scale(1.2); opacity: 1; }
  80% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}

@keyframes flyChip {
  0% {
    transform: translate(var(--start-x), var(--start-y)) scale(0);
    opacity: 0;
  }
  20% {
    transform: translate(var(--start-x), calc(var(--start-y) - 30px)) scale(1.2);
    opacity: 1;
  }
  80% {
    /* Fly upwards towards top center (where balance bar is) */
    transform: translate(0, -40vh) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(0, -45vh) scale(0.5);
    opacity: 0;
  }
}
</style>
