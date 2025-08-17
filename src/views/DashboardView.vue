<template>
  <div class="dashboard-view">
    <router-view name="SummaryReport" />
  </div>
</template>

<script setup lang="ts">
// Dashboard redirects to summary report
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/statistics')
})
</script>