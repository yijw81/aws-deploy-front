<template>
  <AppLayout :breadcrumbs="[{ label: 'Projects', to: '/' }, { label: 'Create Project' }]">
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white">Create New Project</h1>
        <p class="text-gray-400 text-sm mt-1">Configure your AWS deployment project</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Project Information
          </h2>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Project Name <span class="text-red-400">*</span></label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="my-webapp"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Brief description of this project..."
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm resize-none"
            ></textarea>
          </div>
          <!-- Service toggles -->
          <div class="flex flex-wrap gap-6 pt-1">
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input type="checkbox" v-model="form.frontendEnabled" class="sr-only" />
                <div :class="form.frontendEnabled ? 'bg-orange-500' : 'bg-gray-700'" class="w-10 h-6 rounded-full transition-colors"></div>
                <div :class="form.frontendEnabled ? 'translate-x-4' : 'translate-x-0'" class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"></div>
              </div>
              <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Frontend</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input type="checkbox" v-model="form.backendEnabled" class="sr-only" />
                <div :class="form.backendEnabled ? 'bg-blue-500' : 'bg-gray-700'" class="w-10 h-6 rounded-full transition-colors"></div>
                <div :class="form.backendEnabled ? 'translate-x-4' : 'translate-x-0'" class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"></div>
              </div>
              <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Backend</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer group">
              <div class="relative">
                <input type="checkbox" v-model="form.devServerEnabled" class="sr-only" />
                <div :class="form.devServerEnabled ? 'bg-purple-500' : 'bg-gray-700'" class="w-10 h-6 rounded-full transition-colors"></div>
                <div :class="form.devServerEnabled ? 'translate-x-4' : 'translate-x-0'" class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"></div>
              </div>
              <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Dev Server</span>
            </label>
          </div>
        </div>

        <!-- Frontend Section -->
        <div v-if="form.frontendEnabled" class="bg-gray-900 border border-orange-500/20 rounded-xl p-6 space-y-4">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Frontend Configuration
            <span class="ml-auto text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/20">S3 + CloudFront</span>
          </h2>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">GitHub URL</label>
            <input v-model="form.frontend.githubUrl" type="url" placeholder="https://github.com/org/repo"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">S3 Bucket Name</label>
              <input v-model="form.frontend.s3Bucket" type="text" placeholder="my-bucket-prod"
                class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">CloudFront Name</label>
              <input v-model="form.frontend.cloudfrontName" type="text" placeholder="E1234ABCD5678"
                class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">
              Domain Address
              <span class="text-gray-500 font-normal ml-1">(must be registered in Route53)</span>
            </label>
            <input v-model="form.frontend.domain" type="text" placeholder="aaa.com"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm" />
          </div>
        </div>

        <!-- Backend Section -->
        <div v-if="form.backendEnabled" class="bg-gray-900 border border-blue-500/20 rounded-xl p-6 space-y-4">
          <h2 class="text-white font-semibold text-base flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
            </svg>
            Backend Configuration
            <span class="ml-auto text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">ECS + RDS</span>
          </h2>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">GitHub URL</label>
            <input v-model="form.backend.githubUrl" type="url" placeholder="https://github.com/org/repo-backend"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">DB Name</label>
              <input v-model="form.backend.dbName" type="text" placeholder="my-db"
                class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1.5">ECS Name</label>
              <input v-model="form.backend.ecsName" type="text" placeholder="my-service"
                class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1.5">
              Domain Address
              <span class="text-gray-500 font-normal ml-1">(default: api.{frontend-domain})</span>
            </label>
            <input v-model="form.backend.domain" type="text" :placeholder="backendDomainPlaceholder"
              class="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-sm" />
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="flex items-center gap-2 bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <router-link to="/"
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
            <span v-else>Create Project</span>
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useProjectsStore } from '../stores/projects'

const router = useRouter()
const store = useProjectsStore()

const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  description: '',
  frontendEnabled: true,
  backendEnabled: true,
  devServerEnabled: false,
  frontend: {
    githubUrl: '',
    s3Bucket: '',
    cloudfrontName: '',
    domain: '',
  },
  backend: {
    githubUrl: '',
    dbName: '',
    ecsName: '',
    domain: '',
  },
})

const backendDomainPlaceholder = computed(() => {
  const fd = form.value.frontend.domain
  return fd ? `api.${fd}` : 'api.aaa.com'
})

// Auto-fill backend domain when frontend domain changes (if backend domain is empty)
watch(() => form.value.frontend.domain, (newDomain) => {
  if (!form.value.backend.domain && newDomain) {
    form.value.backend.domain = `api.${newDomain}`
  }
})

async function handleSubmit() {
  error.value = ''
  if (!form.value.name.trim()) {
    error.value = 'Project name is required.'
    return
  }
  if (!form.value.frontendEnabled && !form.value.backendEnabled) {
    error.value = 'At least one of Frontend or Backend must be enabled.'
    return
  }

  loading.value = true
  await new Promise((r) => setTimeout(r, 600))

  const newProject = store.addProject({ ...form.value })
  loading.value = false
  router.push(`/projects/${newProject.id}`)
}
</script>
