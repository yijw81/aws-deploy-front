<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
    <!-- Top Navbar -->
    <header class="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <span class="text-white font-semibold text-lg tracking-tight">AWS Deploy</span>
            </div>
            <span class="text-gray-600 text-sm hidden sm:block">|</span>
            <span class="text-gray-400 text-sm hidden sm:block">{{ t('nav.console') }}</span>
          </div>

          <!-- Nav links -->
          <nav class="hidden md:flex items-center gap-1">
            <router-link to="/"
              class="px-3 py-2 rounded text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              :class="{ 'text-white bg-gray-800': $route.path === '/' || $route.path.startsWith('/projects') }">
              {{ t('nav.projects') }}
            </router-link>
          </nav>

          <!-- User menu + Language toggle -->
          <div class="flex items-center gap-3">
            <!-- Language toggle -->
            <button
              @click="toggleLocale"
              class="px-2.5 py-1 text-xs font-semibold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-colors tracking-wider"
              :title="locale === 'ko' ? 'Switch to English' : '한국어로 전환'"
            >
              {{ locale === 'ko' ? 'EN' : '한국어' }}
            </button>

            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {{ userInitial }}
              </div>
              <span class="text-sm text-gray-300 hidden sm:block">{{ userEmail }}</span>
            </div>
            <button @click="logout"
              class="px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-colors">
              {{ t('nav.signOut') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Breadcrumbs -->
    <div v-if="breadcrumbs && breadcrumbs.length > 0" class="bg-gray-900 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <nav class="flex items-center gap-1.5 text-sm">
          <template v-for="(crumb, i) in breadcrumbs" :key="i">
            <router-link v-if="crumb.to" :to="crumb.to" class="text-orange-400 hover:text-orange-300 transition-colors">
              {{ crumb.label }}
            </router-link>
            <span v-else class="text-gray-400">{{ crumb.label }}</span>
            <svg v-if="i < breadcrumbs.length - 1" class="w-3.5 h-3.5 text-gray-600" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </template>
        </nav>
      </div>
    </div>

    <!-- Main content -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 border-t border-gray-800 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-600">
        AWS Deploy Management Console &copy; {{ new Date().getFullYear() }}
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
})

const router = useRouter()
const { t, locale } = useI18n()

const userEmail = localStorage.getItem('auth_email') || 'user@example.com'
const userInitial = computed(() => userEmail.charAt(0).toUpperCase())

function toggleLocale() {
  locale.value = locale.value === 'ko' ? 'en' : 'ko'
  localStorage.setItem('locale', locale.value)
}

function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_email')
  router.push('/login')
}
</script>
