<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

onMounted(() => {
  const auth = useAuthStore()
  if (auth.isAuthenticated) {
    auth.fetchUser()
  }
})
</script>

<template>
  <v-app>
    <router-view />
  </v-app>
</template>