<template>
  <div v-loading="isLoading">
    <div class="">
      <h1 class="statistic-section-title mr-3">Количество SMS по статусам</h1>
      <el-date-picker
        v-model="dateRange"
        class="filter-date"
        type="daterange"
        range-separator=" - "
        start-placeholder="Начало"
        end-placeholder="Конец"
        size="large"
        format="YYYY-MM-DD"
      />
    </div>
    <VChart :option="option" style="height: 300px;" />
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, GridComponent } from 'echarts/components';
import { useStatisticStore } from '@/stores/statistic';
import { ElDatePicker } from 'element-plus'
import {formatDateToIso} from "@/utils/helpers";

use([CanvasRenderer, BarChart, TitleComponent, GridComponent]);

const statisticStore = useStatisticStore();
const isLoading = ref(false);
const filter = ref({
  startDate: null,
  endDate: null
})
const dateRange = ref('')
let data = reactive(null);
const totalCount = ref(null);
const option = computed(() => {
  let stats = {}
  if(statisticStore?.statuses && statisticStore.statuses.length > 0) {
    data.forEach(i => {
      if(i.status === 'CREATED') {
        stats.successCount += i.count || 0;
      } else {
        stats.unsuccessCount += i.count || 0;
      }
    })
  }
  console.log('statisticStore.statuses')
  console.log(statisticStore.statuses)
  let statusNames = Object.values(statisticStore.statuses);
  return {
    xAxis: {
      type: 'category',
      data: statusNames,
      axisLabel: {
        rotate: 45,
        interval: 0
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 200
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 10, itemStyle: { color: '#ADD8E6' } },
          { value: 15, itemStyle: { color: '#ADD8E6' } },
          { value: 30, itemStyle: { color: '#ADD8E6' } },
          { value: 40, itemStyle: { color: '#ADD8E6' } },
          { value: 50, itemStyle: { color: '#ADD8E6' } },
          { value: 60, itemStyle: { color: '#ADD8E6' } },
          { value: 125, itemStyle: { color: '#0000FF' } }, // Blue highlight
          { value: 70, itemStyle: { color: '#ADD8E6' } },
          { value: 80, itemStyle: { color: '#ADD8E6' } }
        ],
        label: {
          show: true,
          position: 'top',
          formatter: (params) => params.value === 125 ? '125' : ''
        },
        barWidth: '60%'
      }
    ]
  };
});

watch(dateRange, (newVal) => {
  filter.value.startDate = newVal?.[0] ? formatDateToIso(newVal[0]) : null
  filter.value.endDate   = newVal?.[1] ? formatDateToIso(newVal[1]) : null
  fetchByOperatorChart()
})
const fetchByOperatorChart = async () => {
  isLoading.value = true
  try {
    const res = await statisticStore.fetchByStatusWithDetailChart({...filter.value})
    console.log('res?.data')
    if (res?.data) {
      data = res?.byOperatorCount || {}
      totalCount.value = res?.totalCount || 0
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchByOperatorChart()
})
</script>