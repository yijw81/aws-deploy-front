<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-xl mb-4 shadow-lg shadow-orange-500/20">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">AWS Deploy Console</h1>
        <p class="text-gray-400 mt-1 text-sm">Sign in to manage your deployments</p>
      </div>

      <!-- Card -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="you@company.com"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div v-if="error" class="flex items-center gap-2 bg-red-950 border border-red-800 rounded-lg px-3.5 py-2.5 text-sm text-red-400">
            <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
          Demo: any email + password works
        </div>
      </div>

      <p class="text-center text-xs text-gray-600 mt-6">
        AWS Deployment Management Console v1.0
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = ref({
  email: '',
  password: '',
})

async function handleLogin() {
  error.value = ''
  loading.value = true

  // Simulate API call
  await new Promise((r) => setTimeout(r, 800))

  if (!form.value.email || !form.value.password) {
    error.value = 'Please fill in all fields.'
    loading.value = false
    return
  }

  // Mock auth — accept any credentials
  localStorage.setItem('auth_token', 'mock-token-' + Date.now())
  localStorage.setItem('auth_email', form.value.email)
  loading.value = false
  router.push('/')
}
</script>
