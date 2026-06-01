<template>
  <AppLayout :breadcrumbs="[{ label: 'Accounts' }]">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Accounts</h1>
        <p class="text-gray-400 text-sm mt-1">로그인 계정 목록</p>
      </div>
      <router-link
        to="/accounts/create"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-950"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Account
      </router-link>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="이메일 또는 이름으로 검색..."
        class="w-full sm:w-80 px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
      />
    </div>

    <!-- Table -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-800">
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">이름 / 이메일</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">역할</th>
            <th class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">생성일</th>
            <th class="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="text-center text-gray-500 py-12">계정이 없습니다.</td>
          </tr>
          <tr
            v-for="account in filtered"
            :key="account.id"
            class="hover:bg-gray-800/50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {{ (account.name || account.email).charAt(0).toUpperCase() }}
                </div>
                <div>
                  <p class="text-white font-medium">{{ account.name || '(이름 없음)' }}</p>
                  <p class="text-gray-400 text-xs">{{ account.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="account.role === 'admin'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'bg-gray-700/50 text-gray-300 border border-gray-600/20'"
                class="text-xs font-medium px-2.5 py-1 rounded-full">
                {{ account.role === 'admin' ? 'Admin' : 'User' }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-400">{{ account.createdAt }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <router-link
                  :to="`/accounts/${account.id}`"
                  class="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
                >
                  상세
                </router-link>
                <button
                  @click="confirmDelete(account)"
                  class="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 rounded-lg transition-colors"
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete confirm modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div class="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
        <h3 class="text-white font-semibold text-base mb-2">계정 삭제</h3>
        <p class="text-gray-400 text-sm mb-5">
          <span class="text-white">{{ deleteTarget.email }}</span> 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div class="flex gap-3 justify-end">
          <button @click="deleteTarget = null"
            class="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors">
            취소
          </button>
          <button @click="doDelete"
            class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            삭제
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAccountsStore } from '../stores/accounts'

const store = useAccountsStore()
const search = ref('')
const deleteTarget = ref(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return store.accounts
  return store.accounts.filter(
    (a) =>
      a.email.toLowerCase().includes(q) ||
      (a.name || '').toLowerCase().includes(q)
  )
})

function confirmDelete(account) {
  deleteTarget.value = account
}

function doDelete() {
  store.removeAccount(deleteTarget.value.id)
  deleteTarget.value = null
}
</script>
