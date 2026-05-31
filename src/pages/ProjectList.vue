<template>
  <AppLayout :breadcrumbs="[{ label: 'Projects' }]">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-white">Projects</h1>
        <p class="text-gray-400 text-sm mt-1">Manage your AWS deployment projects</p>
      </div>
      <router-link to="/projects/create"
        class="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Project
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="text-center py-20">
      <svg class="animate-spin h-8 w-8 text-orange-500 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="flex items-center gap-2 bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ store.error }}
    </div>

    <div v-else-if="projects.length === 0" class="text-center py-20">
      <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <p class="text-gray-400">No projects yet.</p>
      <router-link to="/projects/create" class="text-orange-400 hover:text-orange-300 text-sm mt-2 inline-block">
        Create your first project →
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link v-for="project in projects" :key="project.id" :to="`/projects/${project.id}`"
        class="block bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-orange-500/50 hover:bg-gray-800/50 transition-all group">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h3 class="text-white font-medium group-hover:text-orange-400 transition-colors">{{ project.name }}</h3>
              <p class="text-gray-500 text-xs">{{ formatDate(project.created_at) }}</p>
            </div>
          </div>
          <span :class="statusClass(project.status)" class="px-2 py-0.5 text-xs rounded-full font-medium">
            {{ project.status }}
          </span>
        </div>

        <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ project.description }}</p>

        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span v-if="project.frontend_enabled"
            class="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">
            Frontend
          </span>
          <span v-if="project.backend_enabled"
            class="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded">
            Backend
          </span>
        </div>
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '../components/AppLayout.vue'
import { useProjectsStore } from '../stores/projects'

const store = useProjectsStore()
const { projects } = storeToRefs(store)

onMounted(() => store.fetchProjects())

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString()
}

function statusClass(status) {
  const map = {
    ACTIVE: 'bg-green-500/10 text-green-400',
    BUILDING: 'bg-yellow-500/10 text-yellow-400',
    DEPLOYING: 'bg-yellow-500/10 text-yellow-400',
    PROVISIONING: 'bg-blue-500/10 text-blue-400',
    FAILED: 'bg-red-500/10 text-red-400',
  }
  return map[status] || 'bg-gray-700 text-gray-400'
}
</script>
