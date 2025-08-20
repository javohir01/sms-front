import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/statistics',
          name: 'Статистика',
          component: () => import('@/views/StatisticsView.vue')
        },
        {
          path: '/main',
          name: 'Главная',
          component: () => import('@/views/SmsMain.vue')
        },
        {
          path: '/frames',
          name: 'SMS шаблоны',
          component: () => import('@/views/SmsFrames.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/statistics')
  } else {
    next()
  }
})

export default router