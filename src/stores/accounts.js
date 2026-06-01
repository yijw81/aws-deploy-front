import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref([
    {
      id: '1',
      email: 'admin@firsttree.net',
      name: 'Admin User',
      role: 'admin',
      createdAt: '2025-01-01',
    },
    {
      id: '2',
      email: 'dev@firsttree.net',
      name: 'Developer',
      role: 'user',
      createdAt: '2025-02-10',
    },
    {
      id: '3',
      email: 'ops@firsttree.net',
      name: 'Ops Engineer',
      role: 'user',
      createdAt: '2025-03-05',
    },
  ])

  function getAccount(id) {
    return accounts.value.find((a) => a.id === id)
  }

  function addAccount(account) {
    const newAccount = {
      ...account,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
    }
    accounts.value.push(newAccount)
    return newAccount
  }

  function updateAccount(id, updates) {
    const idx = accounts.value.findIndex((a) => a.id === id)
    if (idx !== -1) {
      accounts.value[idx] = { ...accounts.value[idx], ...updates }
    }
  }

  function removeAccount(id) {
    const idx = accounts.value.findIndex((a) => a.id === id)
    if (idx !== -1) accounts.value.splice(idx, 1)
  }

  return { accounts, getAccount, addAccount, updateAccount, removeAccount }
})
