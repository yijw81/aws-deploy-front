<template>
  <AppLayout :breadcrumbs="[{ label: 'Accounts', to: '/accounts' }, { label: account ? (account.name || account.email) : 'Loading...' }]">
    <div v-if="!account" class="text-center py-20">
      <h3 class="text-white font-semibold text-lg mb-2">Account not found</h3>
      <router-link to="/accounts" class="text-orange-400 hover:text-orange-300 text-sm">← Back to Accounts</router-link>
    </div>

    <div v-else class="max-w-2xl">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {{ (account.name || account.email).charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">{{ account.name || '(이름 없음)' }}</h1>
          <p class="text-gray-400 text-sm mt-0.5">{{ account.email }}</p>
        </div>
        <span :class="account.role === 'admin'
          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
          : 'bg-gray-700/50 text-gray-300 border border-gray-600/20'"
          class="ml-auto text-xs font-medium px-3 py-1 rounded-full">
          {{ account.role === 'admin' ? 'Admin' : 'User' }}
        </span>
      </div>

      <!-- Edit Form -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-5">
        <h2 class="text-white font-semibold text-base mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          계정 정보
        </h2>

        <form @submit.prevent="handleSave" class="space-y-4">
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

          <div v-if="saveError" class="flex items-center gap-2 bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
            {{ saveError }}
          </div>
          <div v-if="saveSuccess" class="flex items-center gap-2 bg-green-950 border border-green-800 rounded-lg px-4 py-3 text-sm text-green-400">
            저장되었습니다.
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <router-link to="/accounts"
              class="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors">
              취소
            </router-link>
            <button type="submit" :disabled="saving"
              class="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white text-sm font-semibold rounded-lg transition-colors">
              {{ saving ? '저장 중...' : '저장' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Meta -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-5">
        <h2 class="text-white font-semibold text-base mb-4">계정 정보</h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">Account ID</p>
            <p class="text-white font-mono">{{ account.id }}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs uppercase tracking-wider mb-1">생성일</p>
            <p class="text-white">{{ account.createdAt }}</p>
          </div>
        </div>
      </div>

      <!-- Change Password link -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-white font-semibold text-base">비밀번호 변경</h2>
            <p class="text-gray-400 text-sm mt-0.5">본인 계정의 비밀번호를 변경합니다.</p>
          </div>
          <router-link
            :to="`/accounts/${account.id}/change-password`"
            class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
          >
            비밀번호 변경
          </router-link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useAccountsStore } from '../stores/accounts'

const route = useRoute()
const store = useAccountsStore()

const account = computed(() => store.getAccount(route.params.id))

const form = ref({ name: '', email: '', role: 'user' })
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

watch(account, (a) => {
  if (a) {
    form.value = { name: a.name || '', email: a.email, role: a.role || 'user' }
  }
}, { immediate: true })

async function handleSave() {
  saveError.value = ''
  saveSuccess.value = false
  if (!form.value.email.trim()) {
    saveError.value = '이메일은 필수입니다.'
    return
  }
  saving.value = true
  await new Promise((r) => setTimeout(r, 500))
  store.updateAccount(account.value.id, { ...form.value })
  saving.value = false
  saveSuccess.value = true
  setTimeout(() => { saveSuccess.value = false }, 3000)
}
</script>
