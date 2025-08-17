<template>
  <v-app-bar color="transparent" flat height="68" class="app-header">
      <v-app-bar-title class="page-title">
        <img src="@/assets/img/logo.png" alt="">
      </v-app-bar-title>

      <template #append>
  <v-menu offset-y min-width="260" location="bottom end">
    <template #activator="{ props }">
      <div class="user-info" v-bind="props" style="cursor:pointer;">
        <span class="balance-text">{{ profileStore?.totalBalance }} UZS</span>
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
  </v-menu>
</template>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const router = useRouter()
const getInitials = (username?: string) => {
  if (!username) return ''
  return username
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}

</script>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid #e0e0e0;
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




</style>