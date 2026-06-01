import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref([
    {
      id: '1',
      name: 'my-webapp',
      description: 'Full-stack web application with React frontend and Node.js backend',
      status: 'active',
      createdAt: '2025-01-15',
      frontendEnabled: true,
      backendEnabled: true,
      devServerEnabled: true,
      frontend: {
        githubUrl: 'https://github.com/org/my-webapp-frontend',
        s3Bucket: 'my-webapp-frontend-prod',
        cloudfrontName: 'E1234ABCD5678',
        domain: 'mywebapp.com',
      },
      backend: {
        githubUrl: 'https://github.com/org/my-webapp-backend',
        dbName: 'my-webapp-db',
        ecsName: 'my-webapp-service',
        domain: 'api.mywebapp.com',
      },
    },
    {
      id: '2',
      name: 'static-site',
      description: 'Marketing landing page hosted on S3 with CloudFront CDN',
      status: 'active',
      createdAt: '2025-02-20',
      frontendEnabled: true,
      backendEnabled: false,
      devServerEnabled: false,
      frontend: {
        githubUrl: 'https://github.com/org/static-site',
        s3Bucket: 'static-site-prod',
        cloudfrontName: 'E9876ZYXW4321',
        domain: 'staticsite.io',
      },
      backend: {
        githubUrl: '',
        dbName: '',
        ecsName: '',
        domain: '',
      },
    },
    {
      id: '3',
      name: 'api-service',
      description: 'Standalone REST API service running on ECS with RDS backend',
      status: 'deploying',
      createdAt: '2025-03-10',
      frontendEnabled: false,
      backendEnabled: true,
      devServerEnabled: true,
      frontend: {
        githubUrl: '',
        s3Bucket: '',
        cloudfrontName: '',
        domain: '',
      },
      backend: {
        githubUrl: 'https://github.com/org/api-service',
        dbName: 'api-service-db',
        ecsName: 'api-service-task',
        domain: 'api.apiservice.net',
      },
    },
  ])

  function getProject(id) {
    return projects.value.find((p) => p.id === id)
  }

  function addProject(project) {
    const newProject = {
      ...project,
      id: String(Date.now()),
      status: 'inactive',
      createdAt: new Date().toISOString().split('T')[0],
    }
    projects.value.push(newProject)
    return newProject
  }

  function updateProject(id, updates) {
    const idx = projects.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      const current = projects.value[idx]
      projects.value[idx] = {
        ...current,
        ...updates,
        frontend: updates.frontend ? { ...current.frontend, ...updates.frontend } : current.frontend,
        backend: updates.backend ? { ...current.backend, ...updates.backend } : current.backend,
      }
    }
  }

  return { projects, getProject, addProject, updateProject }
})
