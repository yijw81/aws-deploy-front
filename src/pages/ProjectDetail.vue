<template>
  <AppLayout :breadcrumbs="[{ label: 'Projects', to: '/' }, { label: project?.name || '...' }]">
    <div v-if="!project" class="text-center py-20 text-gray-500">Project not found.</div>

    <div v-else class="max-w-3xl">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h1 class="text-2xl font-semibold text-white">{{ project.name }}</h1>
            <span :class="statusClass(project.status)" class="px-2 py-0.5 text-xs rounded-full font-medium">
              {{ project.status }}
            </span>
          </div>
          <p class="text-gray-400 text-sm">{{ project.description }}</p>
          <p class="text-gray-600 text-xs mt-1">Created: {{ project.createdAt }}</p>
        </div>
        <router-link to="/"
          class="px-3 py-1.5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white text-sm rounded transition-colors">
          ← Back
        </router-link>
      </div>

      <div class="space-y-5">
        <!-- Frontend Section -->
        <div v-if="project.frontendEnabled"
          class="bg-gray-900 border border-blue-500/20 rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
              <h2 class="text-white font-medium">Frontend</h2>
              <span class="text-xs text-gray-500">S3 + CloudFront</span>
            </div>
            <button @click="deploy('frontend')" :disabled="deployState.frontend === 'loading'"
              class="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded transition-colors"
              :class="deployButtonClass('frontend')">
              <svg v-if="deployState.frontend === 'loading'"
                class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else-if="deployState.frontend === 'success'" class="w-3.5 h-3.5" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {{ deployLabel('frontend') }}
            </button>
          </div>
          <div v-if="deployState.frontend === 'success'"
            class="px-5 py-2 bg-green-500/5 border-b border-green-500/10 text-green-400 text-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Deployed successfully
          </div>
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="GitHub URL" :value="project.frontend.githubUrl" link />
            <InfoField label="S3 Bucket" :value="project.frontend.s3Bucket" mono />
            <InfoField label="CloudFront" :value="project.frontend.cloudfrontName" mono />
            <InfoField label="Domain" :value="project.frontend.domain" link :href="`https://${project.frontend.domain}`" />
          </div>
        </div>

        <!-- Backend Section -->
        <div v-if="project.backendEnabled"
          class="bg-gray-900 border border-green-500/20 rounded-lg overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-400 rounded-full"></div>
              <h2 class="text-white font-medium">Backend</h2>
              <span class="text-xs text-gray-500">ECS + RDS</span>
            </div>
            <button @click="deploy('backend')" :disabled="deployState.backend === 'loading'"
              class="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded transition-colors"
              :class="deployButtonClass('backend')">
              <svg v-if="deployState.backend === 'loading'"
                class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else-if="deployState.backend === 'success'" class="w-3.5 h-3.5" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {{ deployLabel('backend') }}
            </button>
          </div>
          <div v-if="deployState.backend === 'success'"
            class="px-5 py-2 bg-green-500/5 border-b border-green-500/10 text-green-400 text-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Deployed successfully
          </div>
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="GitHub URL" :value="project.backend.githubUrl" link />
            <InfoField label="DB Name" :value="project.backend.dbName" mono />
            <InfoField label="ECS Name" :value="project.backend.ecsName" mono />
            <InfoField label="Domain" :value="project.backend.domain" link :href="`https://${project.backend.domain}`" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import InfoField from '../components/InfoField.vue'
import { useProjectsStore } from '../stores/projects'

const route = useRoute()
const store = useProjectsStore()
const project = computed(() => store.getProject(route.params.id))

const deployState = reactive({ frontend: 'idle', backend: 'idle' })

function deploy(type) {
  deployState[type] = 'loading'
  setTimeout(() => {
    deployState[type] = 'success'
    store.updateProject(project.value.id, { status: 'active' })
  }, 2500)
}

function deployButtonClass(type) {
  if (deployState[type] === 'loading') return 'bg-gray-700 text-gray-400 cursor-not-allowed'
  if (deployState[type] === 'success') return 'bg-green-500/10 text-green-400 border border-green-500/20'
  return 'bg-orange-500 hover:bg-orange-600 text-white'
}

function deployLabel(type) {
  return { loading: 'Deploying...', success: 'Deployed', idle: 'Deploy' }[deployState[type]]
}

function statusClass(status) {
  return {
    active: 'bg-green-500/10 text-green-400',
    deploying: 'bg-yellow-500/10 text-yellow-400',
    inactive: 'bg-gray-700 text-gray-400',
    error: 'bg-red-500/10 text-red-400',
  }[status] || 'bg-gray-700 text-gray-400'
}
</script>
