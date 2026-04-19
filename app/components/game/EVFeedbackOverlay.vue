<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  actionType: 'optimal' | 'suboptimal' | null
  message?: string
  explanation?: string
}>()

const emit = defineEmits<{
  (e: 'dismiss-tooltip'): void
}>()

const showTooltip = ref(false)

watch(() => props.actionType, (newVal) => {
  if (newVal === 'suboptimal' && props.explanation) {
    showTooltip.value = true
  } else {
    showTooltip.value = false
  }
}, { immediate: true })

const dismissTooltip = () => {
  showTooltip.value = false
  emit('dismiss-tooltip')
}

onUnmounted(() => {
})
</script>

<template>
  <div v-if="actionType" class="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
    <!-- Optimal Feedback: Gold Shimmer & Message -->
    <div v-if="actionType === 'optimal'" class="gold-shimmer absolute inset-0 rounded-xl overflow-hidden flex flex-col justify-center items-center">
      <div class="absolute inset-0 bg-gold/20 mix-blend-overlay"></div>
      <!-- Confetti effect can be achieved through pure CSS background -->
      <div class="confetti absolute inset-0"></div>
      
      <span v-if="message" class="text-gold font-bold text-2xl drop-shadow-md pb-12 animate-float">
        {{ $t(message) }}
      </span>
    </div>

    <!-- Suboptimal Feedback: Red Glow & Tooltip -->
    <div v-else-if="actionType === 'suboptimal'" class="red-warning-glow absolute inset-0 rounded-xl pointer-events-auto">
      <div class="absolute inset-0 bg-ev-negative/30 animate-pulse-glow" @click="dismissTooltip"></div>
      
      <Transition name="fade-up">
        <div 
          v-if="showTooltip && explanation" 
          class="absolute bottom-full mb-2 right-4 bg-gray-900 border border-ev-negative text-white p-3 rounded shadow-lg max-w-xs tooltip pointer-events-auto"
          @click.stop="dismissTooltip"
        >
          <div class="font-bold text-ev-negative text-sm mb-1 uppercase tracking-wide">
            {{ $t('ev.suboptimal_move', 'Suboptimal Move') }}
          </div>
          <p class="text-sm">
            {{ $t(explanation) }}
          </p>
          <!-- Tooltip arrow -->
          <div class="absolute -bottom-2 right-8 w-4 h-4 bg-gray-900 border-b border-r border-ev-negative rotate-45 transform"></div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.gold-shimmer {
  animation: shimmer 1s ease-out forwards;
}

@keyframes shimmer {
  0% { opacity: 0; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0; transform: scale(1); }
}

.animate-float {
  animation: floatUp 1.5s ease-out forwards;
}

@keyframes floatUp {
  0% { transform: translateY(20px); opacity: 0; }
  20% { transform: translateY(0); opacity: 1; }
  80% { transform: translateY(-10px); opacity: 1; }
  100% { transform: translateY(-20px); opacity: 0; }
}

.animate-pulse-glow {
  animation: pulseGlow 1s infinite alternate;
}

@keyframes pulseGlow {
  0% { opacity: 0.3; }
  100% { opacity: 0.6; }
}

.confetti {
  background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 4px),
  radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 3px),
  radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 4px);
  background-size: 550px 550px, 350px 350px, 250px 250px;
  background-position: 0 0, 40px 60px, 130px 270px;
  animation: confettiAnimation 1s linear infinite;
  opacity: 0.6;
}

@keyframes confettiAnimation {
  0% { background-position: 0 0, 40px 60px, 130px 270px; }
  100% { background-position: 550px 550px, 390px 410px, 380px 520px; }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
