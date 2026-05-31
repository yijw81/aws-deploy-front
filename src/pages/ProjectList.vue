<template>
  <AppLayout :breadcrumbs="[{ label: t('nav.projects') }]">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-white">{{ t('projectList.title') }}</h1>
        <p class="text-gray-400 text-sm mt-1">{{ t('projectList.subtitle') }}</p>
      </div>
      <router-link to="/projects/create"
        class="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('projectList.newProject') }}
      </router-link>
    </div>

    <div v-if="projects.length === 0" class="text-center py-20">
      <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <p class="text-gray-400">{{ t('projectList.noProjects') }}</p>
      <router-link to="/projects/create" class="text-orange-400 hover:text-orange-300 text-sm mt-2 inline-block">
        {{ t('projectList.createFirst') }} →
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
              <p class="text-gray-500 text-xs">{{ project.createdAt }}</p>
            </div>
          </div>
          <span :class="statusClass(project.status)" class="px-2 py-0.5 text-xs rounded-full font-medium">
            {{ t(`projectList.status.${project.status}`) || project.status }}
          </span>
        </div>

        <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ project.description }}</p>

        <div class="flex items-center gap-3 text-xs text-gray-500">
          <span v-if="project.frontendEnabled"
            class="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ t('common.frontend') }}
          </span>
          <span v-if="project.backendEnabled"
            class="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
            {{ t('common.backend') }}
          </span>
          <span v-if="project.devServerEnabled"
            class="flex items-center gap-1 bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {{ t('common.devServer') }}
          </span>
        </div>
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppLayout from '../components/AppLayout.vue'
import { useProjectsStore } from '../stores/projects'

const { t } = useI18n()
const store = useProjectsStore()
const { projects } = storeToRefs(store)

function statusClass(status) {
  return {
    active: 'bg-green-500/10 text-green-400',
    deploying: 'bg-yellow-500/10 text-yellow-400',
    inactive: 'bg-gray-700 text-gray-400',
    error: 'bg-red-500/10 text-red-400',
  }[status] || 'bg-gray-700 text-gray-400'
}
</script>
