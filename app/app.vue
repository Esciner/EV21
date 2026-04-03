<script setup lang="ts">
const { t } = useI18n()
const mobileMenuOpen = ref(false)

useHead({
  title: () => t('landing.metaTitle'),
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'fr'
  }
})

useSeoMeta({
  title: () => t('landing.metaTitle'),
  description: () => t('landing.metaDescription'),
  ogTitle: () => t('landing.metaTitle'),
  ogDescription: () => t('landing.metaDescription'),
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <header class="bg-slate-950/80 backdrop-blur border-b border-gold/10 sticky top-0 z-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between w-full py-4">
        <div class="flex items-center">
          <NuxtLink to="/">
            <AppLogo class="w-auto h-8 shrink-0" />
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4 sm:gap-6">
          <UButton
            to="/game"
            icon="i-lucide-play"
            variant="subtle"
            size="md"
            class="hidden sm:flex font-bold text-gold ring-1 ring-gold/20 hover:bg-gold/10"
          >
            {{ t('landing.cta') }}
          </UButton>

          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
            class="sm:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </div>
    </header>

    <ClientOnly>
      <MobileMenu v-model="mobileMenuOpen" />
    </ClientOnly>

    <UMain class="bg-felt-green min-h-screen">
      <NuxtPage />
    </UMain>

    <footer class="bg-slate-950 border-t border-gold/5 py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-12 sm:gap-8">
        <div class="flex flex-col gap-6">
          <AppLogo class="h-8 opacity-90 transition-opacity hover:opacity-100" />
          <p class="text-sm text-ivory/40 max-w-sm leading-relaxed">
            EV21 est une plateforme d'apprentissage immersive des probabilités. Prenez les meilleures décisions, développez votre instinct et devenez un joueur expert en Blackjack.
          </p>
          <div class="flex gap-4">
            <UButton
              icon="i-simple-icons-github"
              color="neutral"
              variant="ghost"
              size="sm"
              class="text-ivory/40 hover:text-ivory"
            />
            <UButton
              icon="i-simple-icons-x"
              color="neutral"
              variant="ghost"
              size="sm"
              class="text-ivory/40 hover:text-ivory"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-x-16 gap-y-6">
          <div class="flex flex-col gap-4">
            <h4 class="font-bold text-gold text-xs uppercase tracking-widest">
              Plateforme
            </h4>
            <NuxtLink
              to="/"
              class="text-sm text-ivory/50 hover:text-gold transition-colors"
            >Accueil</NuxtLink>
            <NuxtLink
              to="/game"
              class="text-sm text-ivory/50 hover:text-gold transition-colors"
            >Jouer</NuxtLink>
          </div>
          <div class="flex flex-col gap-4">
            <h4 class="font-bold text-gold text-xs uppercase tracking-widest">
              Légal
            </h4>
            <NuxtLink
              to="#"
              class="text-sm text-ivory/50 hover:text-gold transition-colors"
            >Confidentialité</NuxtLink>
            <NuxtLink
              to="#"
              class="text-sm text-ivory/50 hover:text-gold transition-colors"
            >À propos</NuxtLink>
          </div>
        </div>
      </div>

      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-16 pt-8 border-t border-white/5 flex justify-between items-center">
        <p class="text-xs text-ivory/20 font-mono">
          &copy; {{ new Date().getFullYear() }} EV21. Built for Mathematics.
        </p>
        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span class="text-[10px] text-ivory/30 uppercase tracking-widest">System Status: Optimal</span>
        </div>
      </div>
    </footer>
  </UApp>
</template>
