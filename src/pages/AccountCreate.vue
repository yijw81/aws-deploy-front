<template>
  <AppLayout :breadcrumbs="[{ label: 'Accounts', to: '/accounts' }, { label: 'Create Account' }]">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">Create Account</h1>
        <p class="text-gray-400 text-sm mt-1">새 로그인 계정을 생성합니다.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            계정 정보
          </h2>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">이름</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="홍길동"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">이메일 <span class="text-red-400">*</span></label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="user@example.com"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">비밀번호 <span class="text-red-400">*</span></label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="8자 이상"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">비밀번호 확인 <span class="text-red-400">*</span></label>
            <input
              v-model="form.passwordConfirm"
              type="password"
              required
              placeholder="비밀번호 재입력"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">역할</label>
            <select
              v-model="form.role"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div v-if="error" class="flex items-center gap-2 bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <router-link to="/accounts"
            class="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors">
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-950"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating...
            </span>
            <span v-else>Create Account</span>
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useAccountsStore } from '../stores/accounts'

const router = useRouter()
const store = useAccountsStore()

const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: 'user',
})

async function handleSubmit() {
  error.value = ''
  if (!form.value.email.trim()) {
    error.value = '이메일은 필수입니다.'
    return
  }
  if (form.value.password.length < 8) {
    error.value = '비밀번호는 8자 이상이어야 합니다.'
    return
  }
  if (form.value.password !== form.value.passwordConfirm) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  loading.value = true
  await new Promise((r) => setTimeout(r, 600))
  const newAccount = store.addAccount({
    email: form.value.email,
    name: form.value.name,
    role: form.value.role,
  })
  loading.value = false
  router.push(`/accounts/${newAccount.id}`)
}
</script>
