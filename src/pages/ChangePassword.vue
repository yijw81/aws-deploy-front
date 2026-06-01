<template>
  <AppLayout :breadcrumbs="[{ label: 'Accounts', to: '/accounts' }, { label: account ? (account.name || account.email) : '...', to: account ? `/accounts/${account.id}` : undefined }, { label: '비밀번호 변경' }]">
    <div v-if="!account" class="text-center py-20">
      <h3 class="text-white font-semibold text-lg mb-2">Account not found</h3>
      <router-link to="/accounts" class="text-orange-400 hover:text-orange-300 text-sm">← Back to Accounts</router-link>
    </div>

    <div v-else class="max-w-md mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">비밀번호 변경</h1>
        <p class="text-gray-400 text-sm mt-1">{{ account.email }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
            {{ (account.name || account.email).charAt(0).toUpperCase() }}
          </div>
          <div>
            <p class="text-white text-sm font-medium">{{ account.name || '(이름 없음)' }}</p>
            <p class="text-gray-400 text-xs">{{ account.email }}</p>
          </div>
        </div>

        <hr class="border-gray-800" />

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1.5">현재 비밀번호 <span class="text-red-400">*</span></label>
          <input
            v-model="form.currentPassword"
            type="password"
            required
            placeholder="현재 비밀번호 입력"
            class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1.5">새 비밀번호 <span class="text-red-400">*</span></label>
          <input
            v-model="form.newPassword"
            type="password"
            required
            placeholder="8자 이상"
            class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
          />
          <!-- strength bar -->
          <div class="mt-2 flex gap-1">
            <div v-for="i in 4" :key="i" :class="[
              'h-1 flex-1 rounded-full transition-colors',
              passwordStrength >= i ? strengthColor : 'bg-gray-700'
            ]" />
          </div>
          <p v-if="form.newPassword" class="text-xs mt-1" :class="strengthTextColor">{{ strengthLabel }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1.5">새 비밀번호 확인 <span class="text-red-400">*</span></label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="새 비밀번호 재입력"
            class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
          />
          <p v-if="form.confirmPassword && form.newPassword !== form.confirmPassword" class="text-xs mt-1 text-red-400">
            비밀번호가 일치하지 않습니다.
          </p>
        </div>

        <div v-if="error" class="flex items-center gap-2 bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>

        <div v-if="success" class="flex items-center gap-2 bg-green-950 border border-green-800 rounded-lg px-4 py-3 text-sm text-green-400">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          비밀번호가 변경되었습니다.
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <router-link :to="`/accounts/${account.id}`"
            class="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors">
            취소
          </router-link>
          <button
            type="submit"
            :disabled="loading || form.newPassword !== form.confirmPassword"
            class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              변경 중...
            </span>
            <span v-else>비밀번호 변경</span>
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useAccountsStore } from '../stores/accounts'

const route = useRoute()
const store = useAccountsStore()

const account = computed(() => store.getAccount(route.params.id))

const form = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

const passwordStrength = computed(() => {
  const p = form.value.newPassword
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthColor = computed(() => {
  return ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][passwordStrength.value]
})

const strengthTextColor = computed(() => {
  return ['', 'text-red-400', 'text-yellow-400', 'text-blue-400', 'text-green-400'][passwordStrength.value]
})

const strengthLabel = computed(() => {
  return ['', '매우 약함', '약함', '보통', '강함'][passwordStrength.value]
})

async function handleSubmit() {
  error.value = ''
  success.value = false

  if (!form.value.currentPassword) {
    error.value = '현재 비밀번호를 입력해주세요.'
    return
  }
  if (form.value.newPassword.length < 8) {
    error.value = '새 비밀번호는 8자 이상이어야 합니다.'
    return
  }
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = '새 비밀번호가 일치하지 않습니다.'
    return
  }

  loading.value = true
  await new Promise((r) => setTimeout(r, 700))
  loading.value = false

  // 실제 API 연동 시 currentPassword 검증 후 처리
  // 현재는 mock: 현재 비밀번호가 "wrong"이면 에러 시뮬레이션
  if (form.value.currentPassword === 'wrong') {
    error.value = '현재 비밀번호가 올바르지 않습니다.'
    return
  }

  success.value = true
  form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}
</script>
