<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      style="position: fixed; top: 0; left: 0; height: 100vh; z-index: 1000"
      permanent
      class="sidebar"
      color="grey-800"
      theme="dark"
      width="240"
      rail-width="60"
    >
      <div class="logo-section" >
        <div class="logo-full">
           <img src="@/assets/img/logo-.svg" alt="logo">
        </div>
      </div>

      <v-divider color="white" opacity="0.1" />

      <v-list nav density="compact" class="pa-2">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          class="mb-1 menu-item"
        >
          <template #prepend>
            <img :src="item.icon" class="menu-icon">
          </template>
          <v-list-item-title v-if="!rail">
            {{item.title}}
          </v-list-item-title>
        </v-list-item>
        <v-divider color="white" opacity="0.1" class="my-2" />
      </v-list>
      <template #append>
        <div class="pa-4 d-flex align-items-center justify-center">
          <v-btn
            variant="text"
            color="white"
            style=" letter-spacing: 0; padding-left: 5px;"
            @click="handleLogout" 
          >
            <img src="@/assets/img/logout.svg" alt="">
            <template v-if="!rail">Выйти</template>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar color="transparent" flat height="68" class="app-header">
      <v-app-bar-title class="page-title">
        {{ currentPageTitle }}
      </v-app-bar-title>

      <template #append>
        <v-menu offset-y min-width="260" location="bottom end">
          <template #activator="{ props }">
            <div class="user-info" v-bind="props" style="cursor:pointer;">
              <v-divider vertical class="mx-4" />
              <div class="user-details">
                <div class="user-name">{{ authStore.user?.merchantName }}</div>
                <div class="user-subtitle">Ваш профиль</div>
              </div>
              <v-avatar size="44" class="ml-3">
                <span class="avatar-text">{{ getInitials(authStore.user?.merchantName) }}</span>  
                <div class="status-indicator" />
              </v-avatar>
            </div>
          </template>
          <el-card class="profile-menu" shadow="always" body-style="padding: 16px;">
            <!-- Header -->
            <div class="profile-menu-header" style="margin-bottom: 12px;">
              <div class="user-name" style="font-weight: 600;">{{ authStore.user?.name }}</div>
              <div class="user-subtitle" style="font-size: 13px; color: #888;">Ваш профиль</div>
            </div>

            <!-- Menu -->
            <el-menu
              class="profile-menu-list"
              router
              default-active="$route.path"
              background-color="transparent"
              active-text-color="#409EFF"
              text-color="#333"
              mode="vertical"
            >
              <el-menu-item index="/profile" style="margin-top: 16px; width: 100%; height: 35px;" class="profile-menu-link">
                Профиль
              </el-menu-item>
              <el-menu-item index="/statistics" style="margin-top: 16px; width: 100%; height: 35px;" class="profile-menu-link">
                Статистика
              </el-menu-item>
            </el-menu>
            <!-- Logout Button -->
            <el-button
              type="primary"
              class="profile-menu-logout"
              round
              style="margin-top: 16px; width: 100%; height: 35px;"
              @click="handleLogout"
            >
              <img src="@/assets/img/logout.svg" alt="" class="mr-2" width="20" height="20">  Выйти
            </el-button>
          </el-card>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const drawer = ref(true)
const rail = ref(false)
const darkMode = ref(true)

const paymentItems = [
  { title: 'Оплата', icon: '/img/sidebar/payment.svg', to: '/payment' },
  { title: 'История транзакций',  icon: '/img/sidebar/transactions.svg', to: '/transactions' },
]

const reportItems = [
  { title: 'Реестр операций', icon: '/img/sidebar/operations-registry.svg', to: '/operations-registry' },
  { title: 'История баланса', icon: '/img/sidebar/balance-history.svg', to: '/balance-history' },
]

const profileItems = [
  { title: 'Профиль', icon: '/img/sidebar/profile.svg', to: '/profile' },
  { title: 'Статистика', icon: '/img/sidebar/statistics.svg', to: '/statistics' },
]
  const userRoles = computed(() => authStore.user?.roles || [])

const menuItems = computed(() => {
  const items = [
    { title: 'Главная', icon: '/img/sidebar/statistics.svg', to: '/', show: userRoles.value },
    { title: 'SMS Главная', icon: '/img/sidebar/home.svg', to: '/transactions', show: userRoles.value.includes('ROLE_BRANCH') || userRoles.value.includes('ROLE_SERVICE') || userRoles.value.includes('ROLE_ADMIN') },
    { title: 'SMS шаблоны', icon: '/img/sidebar/sms-frame.svg', to: '/operations-registry', show: userRoles.value.includes('ROLE_BRANCH') || userRoles.value.includes('ROLE_SERVICE') || userRoles.value.includes('ROLE_ADMIN') },
  ]
  // ROLE_ADMIN uchun "Оплата" ni yashirish
 
  return items.filter(i => i.show)
})
const currentPageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Сводный отчет',
    '/payment': 'Оплата',
    '/transactions': 'История транзакций',
    '/summary-report': 'Сводный отчет',
    '/operations-registry': 'Реестр операций',
    '/balance-history': 'История баланса',
    '/profile': 'Профиль',
    '/statistics': 'Статистика',
    '/users': 'Пользователи',
  }
  return titles[route.path] || 'Dashboard'
})
const getInitials = (username?: string) => {
  if (!username) return ''
  return username
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  border-radius: 24px 24px 24px 24px !important;
  margin: 16px 0 16px 16px;
  height: calc(100vh - 32px) !important;
  position: fixed;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 15px;
}

.logo-full {
  display: flex;
  align-items: center;
}

.logo-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 24px;
  color: white;
}

.logo-text-mini {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: white;
}

.logo-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
}

.toggle-btn {
  color: white !important;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.dark-mode-item {
  pointer-events: none;
}

.dark-mode-item .v-switch {
  pointer-events: all;
}

.app-header {
  background-color: #f8f9fc!important;
  position: fixed!important;
  padding-left: 25px;
  padding-right: 24px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.page-title {
  font-family: 'Mulish', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #374151;
}

.user-info {
  display: flex;
  align-items: center;
}

.balance-text {
  font-family: 'Mulish', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
}

.user-details {
  text-align: right;
}

.user-name {
  font-family: 'Mulish', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #374151;
  line-height: 1.2;
}

.user-subtitle {
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #9ca3af;
  line-height: 1;
}

.avatar-text {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #2563eb;
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  background-color: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.main-content {
  background-color: #f8f9fc;
  padding-left: 280px;
  padding-top: 68px;
}

.v-avatar {
  position: relative;
  background-color: #ececec;
  border-radius: 12px;
}
.profile-menu {
  border-radius: 20px;
  min-width: 260px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  background: #fff;
}
.profile-menu-header .user-name {
  font-family: 'Mulish', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #374151;
}
.profile-menu-header .user-subtitle {
  font-family: 'Mulish', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #9ca3af;
}
.profile-menu-list {
  padding: 0;
}
.profile-menu-link {
  font-family: 'Mulish', sans-serif;
  color: #1a1a1a !important;
  padding-left: 10px !important;
}
.profile-menu-link:hover {
  background-color: #f3f4f6;
  border-radius: 50px;
}
.profile-menu-logout {
  font-family: 'Mulish', sans-serif;
  font-size: 15px;
  font-weight: 600;
  border-radius: 16px;
  background: #2563eb;
  color: #fff;
  text-transform: none;
}
.profile-menu-logout .v-icon {
  margin-right: 8px;
}
.menu-icon {
  margin-right: 10px;
}
.menu-item {
  border-radius: 10px;
}

</style>

<style>
.v-list-item.v-list-item--active {
  background-color: rgba(37, 99, 235, 1);
}
</style>