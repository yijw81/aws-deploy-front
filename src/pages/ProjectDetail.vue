<template>
  <AppLayout :breadcrumbs="[{ label: 'Projects', to: '/' }, { label: project ? project.name : 'Loading...' }]">
    <!-- Not found -->
    <div v-if="!project" class="text-center py-20">
      <div class="w-16 h-16 bg-gray-800 rounded-xl mx-auto flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-white font-semibold text-lg mb-2">Project not found</h3>
      <p class="text-gray-500 text-sm mb-6">The project you're looking for doesn't exist.</p>
      <router-link to="/" class="text-orange-400 hover:text-orange-300 text-sm">← Back to Projects</router-link>
    </div>

    <div v-else class="max-w-3xl">
      <!-- Project Header -->
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
        <span :class="statusClass(project.status)" class="text-xs font-medium px-3 py-1 rounded-full">
          {{ project.status }}
        </span>
      </div>

      <!-- GitHub URL 미설정 안내 배너 -->
      <div v-if="isPendingGithub" class="mb-6 flex items-start gap-3 bg-yellow-950 border border-yellow-700 rounded-xl px-5 py-4 text-sm text-yellow-300">
        <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="font-semibold mb-0.5">GitHub URL이 설정되지 않았습니다</p>
          <p class="text-yellow-400/80">아래 섹션에서 GitHub URL을 입력하고 저장하면 배포가 시작됩니다.</p>
        </div>
      </div>

      <!-- Meta info -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Created</p>
          <p class="text-white text-sm font-medium">{{ project.createdAt }}</p>
        </div>
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Project ID</p>
          <p class="text-white text-sm font-medium font-mono">#{{ project.id }}</p>
        </div>
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Frontend</p>
          <p :class="project.frontendEnabled ? 'text-orange-400' : 'text-gray-500'" class="text-sm font-medium">
            {{ project.frontendEnabled ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Backend</p>
          <p :class="project.backendEnabled ? 'text-blue-400' : 'text-gray-500'" class="text-sm font-medium">
            {{ project.backendEnabled ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
        <div class="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <p class="text-gray-500 text-xs mb-1">Dev Server</p>
          <p :class="project.devServerEnabled ? 'text-purple-400' : 'text-gray-500'" class="text-sm font-medium">
            {{ project.devServerEnabled ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
      </div>

      <!-- Frontend Section -->
      <div v-if="project.frontendEnabled" class="bg-gray-900 border border-orange-500/20 rounded-xl p-6 mb-5">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Frontend Deployment
            <span class="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">S3 + CloudFront</span>
          </h2>
          <button
            v-if="!isPendingGithub"
            @click="deployFrontend"
            :disabled="deployingFrontend || frontendDeployed"
            :class="frontendDeployed
              ? 'bg-green-600 cursor-default'
              : 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed'"
            class="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <template v-if="frontendDeployed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Deployed!
            </template>
            <template v-else-if="deployingFrontend">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Deploying...
            </template>
            <template v-else>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Deploy Frontend
            </template>
          </button>
        </div>

        <!-- Success banner -->
        <div v-if="frontendDeployed" class="mb-4 flex items-center gap-2 bg-green-950 border border-green-800 rounded-lg px-4 py-3 text-sm text-green-400">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Frontend deployed successfully! CloudFront distribution updated.
        </div>

        <!-- GitHub URL 편집 영역 -->
        <div class="mb-4">
          <p class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1.5">GitHub URL</p>
          <div v-if="editingFrontendGithub" class="flex gap-2">
            <input
              v-model="frontendGithubInput"
              type="url"
              placeholder="https://github.com/org/repo"
              class="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
            <button @click="saveFrontendGithub" :disabled="savingFrontendGithub"
              class="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white text-sm font-semibold rounded-lg transition-colors">
              {{ savingFrontendGithub ? '저장 중...' : '저장' }}
            </button>
            <button @click="cancelFrontendGithub"
              class="px-3 py-2 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg text-sm transition-colors">
              취소
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
            <a v-if="project.frontend.githubUrl" :href="project.frontend.githubUrl" target="_blank" rel="noopener"
              class="text-blue-400 hover:text-blue-300 text-sm truncate transition-colors">{{ project.frontend.githubUrl }}</a>
            <span v-else class="text-gray-600 text-sm italic">Not configured</span>
            <button @click="startEditFrontendGithub"
              class="ml-1 text-gray-500 hover:text-orange-400 transition-colors flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoField label="S3 Bucket" :value="project.frontend.s3Bucket" icon="bucket" />
          <InfoField label="CloudFront Name" :value="project.frontend.cloudfrontName" />
          <InfoField label="Domain" :value="project.frontend.domain" type="domain" />
        </div>
      </div>

      <!-- Backend Section -->
      <div v-if="project.backendEnabled" class="bg-gray-900 border border-blue-500/20 rounded-xl p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
            Backend Deployment
            <span class="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">ECS + RDS</span>
          </h2>
          <button
            v-if="!isPendingGithub"
            @click="deployBackend"
            :disabled="deployingBackend || backendDeployed"
            :class="backendDeployed
              ? 'bg-green-600 cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed'"
            class="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <template v-if="backendDeployed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Deployed!
            </template>
            <template v-else-if="deployingBackend">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Deploying...
            </template>
            <template v-else>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Deploy Backend
            </template>
          </button>
        </div>

        <!-- Success banner -->
        <div v-if="backendDeployed" class="mb-4 flex items-center gap-2 bg-green-950 border border-green-800 rounded-lg px-4 py-3 text-sm text-green-400">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Backend deployed successfully! ECS service updated and running.
        </div>

        <!-- GitHub URL 편집 영역 -->
        <div class="mb-4">
          <p class="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1.5">GitHub URL</p>
          <div v-if="editingBackendGithub" class="flex gap-2">
            <input
              v-model="backendGithubInput"
              type="url"
              placeholder="https://github.com/org/repo-backend"
              class="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button @click="saveBackendGithub" :disabled="savingBackendGithub"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors">
              {{ savingBackendGithub ? '저장 중...' : '저장' }}
            </button>
            <button @click="cancelBackendGithub"
              class="px-3 py-2 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg text-sm transition-colors">
              취소
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
            <a v-if="project.backend.githubUrl" :href="project.backend.githubUrl" target="_blank" rel="noopener"
              class="text-blue-400 hover:text-blue-300 text-sm truncate transition-colors">{{ project.backend.githubUrl }}</a>
            <span v-else class="text-gray-600 text-sm italic">Not configured</span>
            <button @click="startEditBackendGithub"
              class="ml-1 text-gray-500 hover:text-blue-400 transition-colors flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InfoField label="DB Name" :value="project.backend.dbName" />
          <InfoField label="ECS Name" :value="project.backend.ecsName" />
          <InfoField label="Domain" :value="project.backend.domain" type="domain" />
        </div>

        <!-- Webhook 설정 -->
        <div class="pt-4 border-t border-gray-800">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-white">GitHub Webhook 자동 빌드</p>
              <p class="text-xs text-gray-500 mt-0.5">main 브랜치 push 시 CodeBuild 자동 실행</p>
            </div>
            <div class="flex items-center gap-3">
              <span v-if="savingWebhook" class="text-xs text-gray-400">저장 중...</span>
              <button @click="toggleWebhook" :disabled="savingWebhook" class="relative flex-shrink-0">
                <div :class="project.backend.webhookEnabled ? 'bg-blue-500' : 'bg-gray-700'"
                  class="w-10 h-6 rounded-full transition-colors"></div>
                <div :class="project.backend.webhookEnabled ? 'translate-x-4' : 'translate-x-0'"
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"></div>
              </button>
            </div>
          </div>
          <p v-if="project.backend.webhookEnabled" class="text-xs text-blue-400 mt-2 flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Webhook 활성화됨 — push 이벤트 시 자동 빌드
          </p>
        </div>
      </div>
      <!-- Dev Server Section -->
      <div v-if="project.devServerEnabled" class="bg-gray-900 border border-purple-500/20 rounded-xl p-6 mt-5">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Dev Server
            <span class="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">Development</span>
          </h2>
          <button
            @click="deployDev"
            :disabled="deployingDev || devDeployed"
            :class="devDeployed
              ? 'bg-green-600 cursor-default'
              : 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed'"
            class="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <template v-if="devDeployed">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Deployed!
            </template>
            <template v-else-if="deployingDev">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Deploying...
            </template>
            <template v-else>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Deploy Dev
            </template>
          </button>
        </div>

        <!-- Success banner -->
        <div v-if="devDeployed" class="mb-4 flex items-center gap-2 bg-green-950 border border-green-800 rounded-lg px-4 py-3 text-sm text-green-400">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Dev server deployed successfully! Development environment is ready.
        </div>

        <p class="text-gray-500 text-sm">
          개발 서버가 활성화되어 있습니다. 프로덕션 배포 전에 개발 환경에서 먼저 테스트할 수 있습니다.
        </p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useProjectsStore } from '../stores/projects'

const InfoField = {
  props: ['label', 'value', 'type'],
  template: `
    <div class="space-y-1">
      <p class="text-xs text-gray-500 uppercase tracking-wider font-medium">{{ label }}</p>
      <p v-if="!value" class="text-gray-600 text-sm italic">Not configured</p>
      <a v-else-if="type === 'url'" :href="value" target="_blank" rel="noopener"
        class="text-blue-400 hover:text-blue-300 text-sm truncate block transition-colors">{{ value }}</a>
      <p v-else-if="type === 'domain'" class="text-green-400 text-sm font-mono">{{ value }}</p>
      <p v-else class="text-white text-sm font-mono">{{ value }}</p>
    </div>
  `,
}

const route = useRoute()
const store = useProjectsStore()

const project = computed(() => store.getProject(route.params.id))

const isPendingGithub = computed(() => project.value?.status === 'PENDING_GITHUB')

const deployingFrontend = ref(false)
const frontendDeployed = ref(false)
const deployingBackend = ref(false)
const backendDeployed = ref(false)
const deployingDev = ref(false)
const devDeployed = ref(false)

// Frontend GitHub URL 편집
const editingFrontendGithub = ref(false)
const frontendGithubInput = ref('')
const savingFrontendGithub = ref(false)

function startEditFrontendGithub() {
  frontendGithubInput.value = project.value.frontend.githubUrl || ''
  editingFrontendGithub.value = true
}

function cancelFrontendGithub() {
  editingFrontendGithub.value = false
}

async function saveFrontendGithub() {
  savingFrontendGithub.value = true
  await new Promise((r) => setTimeout(r, 400))
  store.updateProject(project.value.id, {
    frontend: { ...project.value.frontend, githubUrl: frontendGithubInput.value },
  })
  // GitHub URL이 새로 추가되고 pending 상태였으면 상태 변경
  if (isPendingGithub.value && frontendGithubInput.value) {
    store.updateProject(project.value.id, { status: 'inactive' })
  }
  savingFrontendGithub.value = false
  editingFrontendGithub.value = false
}

// Backend GitHub URL 편집
const editingBackendGithub = ref(false)
const backendGithubInput = ref('')
const savingBackendGithub = ref(false)

function startEditBackendGithub() {
  backendGithubInput.value = project.value.backend.githubUrl || ''
  editingBackendGithub.value = true
}

function cancelBackendGithub() {
  editingBackendGithub.value = false
}

async function saveBackendGithub() {
  savingBackendGithub.value = true
  await new Promise((r) => setTimeout(r, 400))
  store.updateProject(project.value.id, {
    backend: { ...project.value.backend, githubUrl: backendGithubInput.value },
  })
  if (isPendingGithub.value && backendGithubInput.value) {
    store.updateProject(project.value.id, { status: 'inactive' })
  }
  savingBackendGithub.value = false
  editingBackendGithub.value = false
}

// Webhook 토글
const savingWebhook = ref(false)

async function toggleWebhook() {
  savingWebhook.value = true
  await new Promise((r) => setTimeout(r, 500))
  store.updateProject(project.value.id, {
    backend: { ...project.value.backend, webhookEnabled: !project.value.backend.webhookEnabled },
  })
  savingWebhook.value = false
}

async function deployFrontend() {
  deployingFrontend.value = true
  await new Promise((r) => setTimeout(r, 2000))
  deployingFrontend.value = false
  frontendDeployed.value = true
  store.updateProject(project.value.id, { status: 'active' })
}

async function deployBackend() {
  deployingBackend.value = true
  await new Promise((r) => setTimeout(r, 2500))
  deployingBackend.value = false
  backendDeployed.value = true
  store.updateProject(project.value.id, { status: 'active' })
}

async function deployDev() {
  deployingDev.value = true
  await new Promise((r) => setTimeout(r, 1500))
  deployingDev.value = false
  devDeployed.value = true
}

function statusClass(status) {
  return {
    active: 'bg-green-500/10 text-green-400 border border-green-500/20',
    deploying: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    inactive: 'bg-gray-700/50 text-gray-400 border border-gray-600/20',
    error: 'bg-red-500/10 text-red-400 border border-red-500/20',
    PENDING_GITHUB: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  }[status] || 'bg-gray-700/50 text-gray-400 border border-gray-600/20'
}
</script>
