<template>
  <button
    :class="[
      'min-w-[48px] min-h-[48px] px-4 py-2 rounded-lg font-bold transition-transform duration-75',
      'flex items-center justify-center',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      disabled
        ? 'opacity-50 cursor-not-allowed bg-gray-600 text-gray-300'
        : 'active:scale-95 hover:brightness-110 cursor-pointer',
      variantClasses
    ]"
    :disabled="disabled"
    :aria-label="label"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  }
})

const emit = defineEmits(['action'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'bg-red-600 text-white focus-visible:ring-red-500'
    case 'success':
      return 'bg-green-600 text-white focus-visible:ring-green-500'
    case 'secondary':
      return 'bg-gray-700 text-white focus-visible:ring-gray-500'
    case 'primary':
    default:
      return 'bg-blue-600 text-white focus-visible:ring-blue-500'
  }
})

function handleClick() {
  if (!props.disabled) {
    emit('action', props.action)
  }
}
</script>
