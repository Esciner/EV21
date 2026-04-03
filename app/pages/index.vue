<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('landing.metaTitle'),
  meta: [
    { name: 'description', content: t('landing.metaDescription') }
  ]
})

const features = computed(() => [
  {
    title: t('features.evTitle'),
    description: t('features.evDesc'),
    icon: 'i-lucide-brain'
  },
  {
    title: t('features.riskTitle'),
    description: t('features.riskDesc'),
    icon: 'i-lucide-shield-check'
  },
  {
    title: t('features.guideTitle'),
    description: t('features.guideDesc'),
    icon: 'i-lucide-trending-up'
  }
])
</script>

<template>
  <div class="landing-page min-h-[calc(100vh-140px)] bg-felt-green text-ivory">
    <!-- Hero Section -->
    <section class="relative py-24 px-4 overflow-hidden border-b border-white/5">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-felt-green-light)_0%,_transparent_70%)] opacity-30" />

      <div class="max-w-4xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
          <UIcon name="i-lucide-award" />
          <span>{{ t('landing.metaTitle') }}</span>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold font-mono tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-ivory to-ivory/60">
          {{ t('landing.title') }}
        </h1>

        <p class="text-xl md:text-2xl text-ivory/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          {{ t('landing.description') }}
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <UButton
            to="/game"
            size="xl"
            class="group bg-gold text-black hover:bg-gold-light px-8 py-4 text-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
          >
            {{ t('landing.cta') }}
            <UIcon
              name="i-lucide-arrow-right"
              class="group-hover:translate-x-1 transition-transform"
            />
          </UButton>

          <UButton
            variant="ghost"
            size="xl"
            color="neutral"
            class="text-ivory/80 hover:text-ivory"
          >
            {{ t('features.guideTitle') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="max-w-6xl mx-auto py-24 px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="feature-card group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all duration-300"
        >
          <div class="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <UIcon
              :name="feature.icon"
              class="text-2xl text-gold"
            />
          </div>
          <h3 class="text-xl font-bold mb-3 text-ivory group-hover:text-gold transition-colors">
            {{ feature.title }}
          </h3>
          <p class="text-ivory/60 leading-relaxed">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  background-image: radial-gradient(circle at top right, var(--color-felt-green-light) 0%, var(--color-felt-green) 50%);
}

.feature-card {
  backdrop-filter: blur(10px);
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}
</style>
