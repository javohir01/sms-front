<template>
  <v-container fluid class="statistics-container">
    <h1>Statistics</h1>
    <HorizontalStackedBarChart />
    <VerticalBarChart />
    <!-- <div class="d-flex"> -->
      <StatsDoughnutChart />   
      <StatusDoughnutChart />   
    <!-- </div> -->
  </v-container>
</template>
<script setup>
import HorizontalStackedBarChart from '@/components/HorizontalStackedBarChart.vue';
import VerticalBarChart from '@/components/VerticalBarChart.vue';
import StatsDoughnutChart from '@/components/StatsDoughnutChart.vue';
import StatusDoughnutChart from '@/components/StatusDoughnutChart.vue';
</script>
