import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../api/index'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProjects() {
    loading.value = true
    error.value = null
    try {
      projects.value = await api.getProjects()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  function getProject(id) {
    return projects.value.find((p) => p.id === id)
  }

  async function addProject(data) {
    const project = await api.createProject(data)
    projects.value.unshift(project)
    return project
  }

  async function refreshProject(id) {
    const project = await api.getProject(id)
    const idx = projects.value.findIndex((p) => p.id === id)
    if (idx !== -1) projects.value[idx] = project
    else projects.value.unshift(project)
    return project
  }

  return { projects, loading, error, fetchProjects, getProject, addProject, refreshProject }
})
