<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  balance: {
    type: Number,
    required: true,
    default: 0
  }
})

// Calculate denominations (greedy)
const chipStacks = computed(() => {
  let remaining = props.balance
  
  const black = Math.floor(remaining / 100)
  remaining %= 100
  
  const blue = Math.floor(remaining / 25)
  remaining %= 25
  
  const red = Math.floor(remaining / 5)
  remaining %= 5
  
  const white = Math.floor(remaining)

  return [
    { color: 'black', count: black, cssClass: 'bg-zinc-800 border-zinc-950 text-zinc-300' },
    { color: 'blue', count: blue, cssClass: 'bg-blue-600 border-blue-900 text-blue-100' },
    { color: 'red', count: red, cssClass: 'bg-red-600 border-red-900 text-red-100' },
    { color: 'white', count: white, cssClass: 'bg-slate-100 border-slate-300 text-slate-800' }
  ].filter(stack => stack.count > 0)
})
</script>

<template>
  <div class="flex items-end space-x-3 pb-1">
    <div 
      v-for="stack in chipStacks" 
      :key="stack.color" 
      class="relative w-8"
      :style="{ height: `${12 + (Math.min(stack.count, 20) * 3)}px` }"
    >
      <!-- Cap visual representation to 20 chips per stack for performance and layout -->
      <div 
        v-for="i in Math.min(stack.count, 20)" 
        :key="i"
        class="absolute left-0 w-8 h-4 rounded-[50%] border shadow-[0_1px_1px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300"
        :class="stack.cssClass"
        :style="{ 
          bottom: `${(i - 1) * 3}px`, 
          zIndex: i 
        }"
      >
        <!-- inner border ring for authentic casino chip look -->
        <div class="w-5 h-2.5 rounded-[50%] border opacity-40" :class="stack.color === 'white' ? 'border-slate-400' : 'border-white/50'"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional specific micro-animations could go here */
</style>
