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
    <VChart :option="option" class="mb-5" style="height: 200px;" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
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
const data = ref(null);
const option = computed(() => {
  const stats = data.value || { successCount: 0, unsuccessCount: 0 };
  const total = data.value?.all ?? 0;
  return {
    xAxis: {
      type: 'value',
      min: 0,
      max: total > 0 ? total + 200 : 1400, // Dinamik max qiymat
      axisLabel: { show: true },
    },
    yAxis: {
      type: 'category',
      data: ['SMS Status'],
      show: false,
    },
    grid: {
      top: '0%',
      left: '-3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    series: [
      {
        name: 'успешно',
        type: 'bar',
        stack: 'total',
        data: [stats.successCount || 0],
        label: {
          show: true,
          position: 'inside',
          formatter: `${stats.successCount || 0} успешно`,
        },
        itemStyle: {
          color: '#98FB98',
        },
      },
      {
        name: 'неуспешно',
        type: 'bar',
        stack: 'total',
        data: [stats.unsuccessCount || 0],
        label: {
          show: true,
          position: 'inside',
          formatter: `${stats.unsuccessCount || 0} неуспешно`,
        },
        itemStyle: {
          color: '#FFC0CB',
        },
      },
    ],
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
    const res = await statisticStore.fetchByStatusChart({...filter.value})
    if (res?.data) {
      data.value = res.data || {}
    }
  } finally {
    isLoading.value = false
  }
}

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
.header.el-date-editor.el-input__wrapper {
  width: 60% !important;
}
.statistic-section-title{
  color: #212121;
  font-size: 18px;
  font-weight: 700;
  display: inline-block;
}
.filter-date{
  border-radius: 10px;
  border: none!important;
  box-shadow: none !important;
  margin-left: 25px;
}
</style>