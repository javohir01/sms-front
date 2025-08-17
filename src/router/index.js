import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/sms',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: '/sms-frame',
          name: 'OperationsRegistry',
          component: () => import('@/views/OperationsRegistry.vue')
        },
        {
          path: '/statistics',
          name: 'Statistics',
          component: () => import('@/views/StatisticsView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router