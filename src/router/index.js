import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import ProjectList from '../pages/ProjectList.vue'
import ProjectCreate from '../pages/ProjectCreate.vue'
import ProjectDetail from '../pages/ProjectDetail.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true },
  },
  {
    path: '/',
    name: 'ProjectList',
    component: ProjectList,
  },
  {
    path: '/projects/create',
    name: 'ProjectCreate',
    component: ProjectCreate,
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: ProjectDetail,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('auth_token')
  if (!to.meta.public && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
