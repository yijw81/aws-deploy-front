// const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const BASE_URL = 'https://deploy-api.firsttree.net'

function getHeaders() {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (res.status === 401) {
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

export const api = {
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  register: (email, password) => request('POST', '/auth/register', { email, password }),

  getProjects: () => request('GET', '/projects'),
  createProject: (data) => request('POST', '/projects', data),
  getProject: (id) => request('GET', `/projects/${id}`),
  updateProject: (id, data) => request('PUT', `/projects/${id}`, data),
  deleteProject: (id) => request('DELETE', `/projects/${id}`),

  getDeployments: (projectId) => request('GET', `/projects/${projectId}/deployments`),
  triggerDeploy: (projectId, branch) => request('POST', `/projects/${projectId}/deploy`, { branch }),
}
