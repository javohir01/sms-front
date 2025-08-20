<template>
  <div v-loading="isLoading" >
    <div class="">
      <h1 class="statistic-section-title mr-3">Статистика отправленных SMS</h1>
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
import {onMounted, ref, reactive, computed, watch} from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import {useStatisticStore} from "@/stores/statistic.js";
import {formatDateToIso} from "@/utils/helpers.js";
import {ElDatePicker} from "element-plus";

use([CanvasRenderer, PieChart, TitleComponent, LegendComponent, TooltipComponent]);

const statisticStore = useStatisticStore();
const isLoading = ref(false);
const filter = ref({
  startDate: null,
  endDate: null
})
const dateRange = ref('')
let data = reactive(null);
const totalCount = ref(null);
// const option = computed(() => {
//   const stats = data.value || { successCount: 0, unsuccessCount: 0 };
//   const total = data.value?.all ?? 0;
//   return {
//     series: [
//       {
//         name: 'успешно',
//         type: 'bar',
//         stack: 'total',
//         data: [stats.successCount || 0],
//         label: {
//           show: true,
//           position: 'inside',
//           formatter: `${stats.successCount || 0} успешно`,
//         },
//         itemStyle: {
//           color: '#98FB98',
//         },
//       },
//       {
//         name: 'неуспешно',
//         type: 'bar',
//         stack: 'total',
//         data: [stats.unsuccessCount || 0],
//         label: {
//           show: true,
//           position: 'inside',
//           formatter: `${stats.unsuccessCount || 0} неуспешно`,
//         },
//         itemStyle: {
//           color: '#FFC0CB',
//         },
//       },
//     ],
//   };
// });

const option = computed(() => {
  let stats = {
    UCELL: 0,
    BEELINE: 0,
    HUMANS: 0,
    UZMOBILE: 0,
    MOBIUZ: 0,
    PERFECTUM: 0
  }
  if(data && data.length > 0) {
    data.forEach(i => {
      if(i.count) {
        stats[i.operator] = i.count
      }
    })
  }
  return {
    title: [
      {
        text: `ВСЕГО ОТПРАВЛЕНО\nSMS\n ${totalCount.value}`,
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          textAlign: 'center'
        }
      }
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      data: ['UCELL', 'BEELINE', 'HUMANS', 'UZMOBILE', 'MOBIUZ', 'PERFECTUM']
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          { value: stats['UCELL'], name: 'UCELL', itemStyle: { color: '#6A1B9A' } },
          { value: stats['BEELINE'], name: 'BEELINE', itemStyle: { color: '#FFEB3B' } },
          { value: stats['HUMANS'], name: 'HUMANS', itemStyle: { color: '#4CAF50' } },
          { value: stats['UZMOBILE'], name: 'UZMOBILE', itemStyle: { color: '#2196F3' } },
          { value: stats['MOBIUZ'], name: 'MOBIUZ', itemStyle: { color: '#F44336' } },
          { value: stats['PERFECTUM'], name: 'PERFECTUM', itemStyle: { color: '#FF9800' } }
        ]
      }
    ]
  }
});

watch(dateRange, (newVal) => {
  filter.value.startDate = newVal?.[0] ? formatDateToIso(newVal[0]) : null
  filter.value.endDate   = newVal?.[1] ? formatDateToIso(newVal[1]) : null
  fetchByOperatorChart()
})
const fetchByOperatorChart = async () => {
  isLoading.value = true
  try {
    const res = await statisticStore.fetchByOperatorChart({...filter.value})
    console.log('ressa?.data')
    console.log(res)
    if (res) {
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

<style>
.header {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}
</style>