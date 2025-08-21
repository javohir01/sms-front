<template>
  <v-container fluid class="statistics-container">
    <ByStatusChart />
    <!-- <ByStatusChartWithDetail /> -->
    <ByOperatorsChart />
  </v-container>
</template>
<script setup>
import ByStatusChart from '@/components/ByStatusChart.vue';
import ByStatusChartWithDetail from '@/components/ByStatusChartWithDetail.vue';
import ByOperatorsChart from '@/components/ByOperatorsChart.vue';
</script>
