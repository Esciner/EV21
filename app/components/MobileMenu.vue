<script setup lang="ts">
const { t } = useI18n()
const modelValue = defineModel<boolean>()

const links = computed(() => [
  { label: t('landing.cta'), to: '/game', icon: 'i-lucide-play' },
  { label: 'Politique de Confidentialité', icon: 'i-lucide-shield-check' },
  { label: 'À propos', icon: 'i-lucide-info' }
])
</script>

<template>
  <USlideover
    v-model="modelValue"
    title="Menu"
  >
    <template #body>
      <div class="flex flex-col gap-6 p-4">
        <div class="flex items-center gap-4 py-4 border-b border-white/10">
          <AppLogo class="h-8" />
        </div>

        <UNavigationMenu
          orientation="vertical"
          :items="links"
          class="w-full"
        />

        <div class="mt-auto pt-8">
          <UButton
            to="/game"
            size="xl"
            block
            class="bg-gold text-black hover:bg-gold-light font-bold"
            @click="modelValue = false"
          >
            {{ t('landing.cta') }}
          </UButton>
        </div>
      </div>
    </template>
  </USlideover>
</template>
