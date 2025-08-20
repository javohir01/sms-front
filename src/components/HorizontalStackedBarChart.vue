<template>
  <div>
    <div class="header">2025-05-30 00:00:00 - 2025-06-09 23:59:59</div>
    <VChart :option="option" style="height: 200px;" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, GridComponent } from 'echarts/components';
import { useStatisticStore } from '@/stores/statistic';
use([CanvasRenderer, BarChart, TitleComponent, GridComponent]);

const statisticStore = useStatisticStore();
const isLoading = ref(false);
const filter = ref({
  size: 10,
  page: 1,
  phoneNumber: "",
  operator: null,
  status: null,
  merchant: null,
  startDate: null,
  endDate: null
})

const fetchByOperatorChart = async () => {
  isLoading.value = true
  try {
    await statisticStore.fetchByStatusChart()
  } finally {
    isLoading.value = false
  }
}
const option = ref({
  title: {
    text: 'Количество SMS по статусам',
    left: 'left'
  },
  xAxis: {
    type: 'value',
    min: 0,
    max: 1400,
    axisLabel: { show: true }
  },
  yAxis: {
    type: 'category',
    data: [''],
    show: false
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  series: [
    {
      name: 'успешно',
      type: 'bar',
      stack: 'total',
      data: [800],
      label: {
        show: true,
        position: 'inside',
        formatter: '800 успешно'
      },
      itemStyle: {
        color: '#98FB98' // Light green
      }
    },
    {
      name: 'неуспешно',
      type: 'bar',
      stack: 'total',
      data: [120],
      label: {
        show: true,
        position: 'inside',
        formatter: '120 неуспешно'
      },
      itemStyle: {
        color: '#FFC0CB' // Pink
      }
    }
  ]
});

onMounted(() => {
  fetchByOperatorChart()
})
</script>

<style>
.header {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}
</style>