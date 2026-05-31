<template>
  <AppLayout :breadcrumbs="[{ label: 'Projects', to: '/' }, { label: project ? project.name : 'Loading...' }]">
    <!-- Loading -->
    <div v-if="pageLoading" class="text-center py-20">
      <svg class="animate-spin h-8 w-8 text-orange-500 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>

    <!-- Not found -->
    <div v-else-if="!project" class="text-center py-20">
      <h3 class="text-white font-semibold text-lg mb-2">Project not found</h3>
      <router-link to="/" class="text-orange-400 hover:text-orange-300 text-sm">← Back to Projects</router-link>
    </div>

    <div v-else class="max-w-3xl">
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">{{ project.name }}</h1>
            <p class="text-gray-400 text-sm mt-0.5">{{ project.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span :class="statusClass(project.status)" class="text-xs font-medium px-3 py-1 rounded-full">
            {{ project.status }}
          </span>
          <span v-if="isProvisioning" class="text-xs text-gray-500">{{ project.current_step }}</span>
        </div>
      </div>

      <!-- Provisioning progress -->
      <div v-if="isProvisioning" class="bg-blue-950/30 border border-blue-800/50 rounded-xl p-4 mb-6 flex items-center gap-3">
        <svg class="animate-spin h-5 w-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <div>
          <p class="text-blue-300 text-sm font-medium">Provisioning AWS infrastructure...</p>
          <p class="text-blue-500 text-xs mt-0.5">Current step: {{ project.current_step || 'Initializing' }}</p>
        </div>
      </div>

      <!-- Meta info -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Created</p>
          <p class="text-white text-sm font-medium">{{ formatDate(project.created_at) }}</p>
        </div>
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Project ID</p>
          <p class="text-white text-sm font-medium font-mono">{{ project.id.slice(0, 8) }}</p>
        </div>
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Frontend</p>
          <p :class="project.frontend_enabled ? 'text-orange-400' : 'text-gray-500'" class="text-sm font-medium">
            {{ project.frontend_enabled ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Backend</p>
          <p :class="project.backend_enabled ? 'text-blue-400' : 'text-gray-500'" class="text-sm font-medium">
            {{ project.backend_enabled ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
      </div>

      <!-- Backend URL -->
      <div v-if="project.backend_url" class="bg-gray-900 border border-green-800/30 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
        <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-gray-500 text-xs">Backend URL</p>
          <a :href="project.backend_url" target="_blank" class="text-green-400 text-sm hover:text-green-300 font-mono">{{ project.backend_url }}</a>
        </div>
      </div>

      <!-- Frontend Config -->
      <div v-if="project.frontend_enabled" class="bg-gray-900 border border-orange-500/20 rounded-xl p-6 mb-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Frontend
            <span class="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">S3 + CloudFront</span>
          </h2>
          <button
            @click="triggerDeploy('frontend')"
            :disabled="deploying || !isActive"
            class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-900 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <svg v-if="deploying" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ deploying ? 'Deploying...' : 'Deploy' }}
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="GitHub URL" :value="project.frontend_config?.githubUrl" type="url" />
          <InfoField label="S3 Bucket" :value="project.frontend_config?.s3Bucket" />
          <InfoField label="CloudFront" :value="project.frontend_config?.cloudfrontName" />
          <InfoField label="Domain" :value="project.frontend_config?.domain" type="domain" />
        </div>
      </div>

      <!-- Backend Config -->
      <div v-if="project.backend_enabled" class="bg-gray-900 border border-blue-500/20 rounded-xl p-6 mb-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
            Backend
            <span class="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">ECS Fargate + RDS</span>
          </h2>
          <button
            @click="triggerDeploy('backend')"
            :disabled="deploying || !isActive"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <svg v-if="deploying" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ deploying ? 'Deploying...' : 'Deploy' }}
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="GitHub URL" :value="project.backend_config?.githubUrl" type="url" />
          <InfoField label="DB Name" :value="project.backend_config?.dbName" />
          <InfoField label="ECS Name" :value="project.backend_config?.ecsName" />
          <InfoField label="Domain" :value="project.backend_config?.domain" type="domain" />
        </div>

        <!-- Infrastructure -->
        <div v-if="project.infrastructure" class="mt-4 pt-4 border-t border-gray-800">
          <p class="text-gray-500 text-xs uppercase tracking-wider font-medium mb-3">Infrastructure</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoField label="ALB DNS" :value="project.infrastructure.alb_dns" />
            <InfoField label="ECR Repository" :value="project.infrastructure.ecr_repository_uri" />
            <InfoField label="ECS Cluster" :value="project.infrastructure.ecs_cluster_arn" />
            <InfoField label="CodeBuild Project" :value="project.infrastructure.codebuild_project_name" />
          </div>
        </div>
      </div>

      <!-- Deploy error -->
      <div v-if="deployError" class="flex items-center gap-2 bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400 mb-5">
        {{ deployError }}
      </div>

      <!-- Deployments -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 class="text-white font-semibold text-base mb-4">Deployment History</h2>
        <div v-if="deployments.length === 0" class="text-center py-8 text-gray-500 text-sm">
          No deployments yet.
        </div>
        <div v-else class="space-y-2">
          <div v-for="d in deployments" :key="d.id"
            class="flex items-center justify-between py-3 px-4 bg-gray-800/50 rounded-lg">
            <div class="flex items-center gap-3">
              <span :class="deployStatusClass(d.status)" class="w-2 h-2 rounded-full flex-shrink-0"></span>
              <div>
                <p class="text-white text-sm font-mono">{{ d.codebuild_build_id || d.id.slice(0, 12) }}</p>
                <p class="text-gray-500 text-xs">{{ d.branch }} · {{ formatDate(d.started_at) }}</p>
              </div>
            </div>
            <span :class="deployStatusTextClass(d.status)" class="text-xs font-medium">{{ d.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import InfoField from '../components/InfoField.vue'
import { api } from '../api/index'

const route = useRoute()
const project = ref(null)
const deployments = ref([])
const pageLoading = ref(true)
const deploying = ref(false)
const deployError = ref('')
let pollTimer = null

const PROVISIONING_STATUSES = ['PROVISIONING', 'BUILDING', 'DEPLOYING']
const isProvisioning = computed(() => PROVISIONING_STATUSES.includes(project.value?.status))
const isActive = computed(() => project.value?.status === 'ACTIVE')

async function loadProject() {
  try {
    project.value = await api.getProject(route.params.id)
  } catch (e) {
    project.value = null
  }
}

async function loadDeployments() {
  try {
    deployments.value = await api.getDeployments(route.params.id)
  } catch (e) {
    // ignore
  }
}

async function triggerDeploy(type) {
  deployError.value = ''
  deploying.value = true
  try {
    await api.triggerDeploy(route.params.id)
    await Promise.all([loadProject(), loadDeployments()])
  } catch (e) {
    deployError.value = e.message || 'Deployment failed'
  } finally {
    deploying.value = false
  }
}

function startPolling() {
  if (pollTimer) return
  pollTimer = setInterval(async () => {
    await loadProject()
    if (!isProvisioning.value) {
      clearInterval(pollTimer)
      pollTimer = null
      await loadDeployments()
    }
  }, 5000)
}

onMounted(async () => {
  await Promise.all([loadProject(), loadDeployments()])
  pageLoading.value = false
  if (isProvisioning.value) startPolling()
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString()
}

function statusClass(status) {
  const map = {
    ACTIVE: 'bg-green-500/10 text-green-400 border border-green-500/20',
    BUILDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    DEPLOYING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    PROVISIONING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    FAILED: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }
  return map[status] || 'bg-gray-700/50 text-gray-400 border border-gray-600/20'
}

function deployStatusClass(status) {
  const map = { SUCCEEDED: 'bg-green-400', BUILDING: 'bg-yellow-400', FAILED: 'bg-red-400', PENDING: 'bg-gray-400' }
  return map[status] || 'bg-gray-400'
}

function deployStatusTextClass(status) {
  const map = { SUCCEEDED: 'text-green-400', BUILDING: 'text-yellow-400', FAILED: 'text-red-400', PENDING: 'text-gray-400' }
  return map[status] || 'text-gray-400'
}
</script>
