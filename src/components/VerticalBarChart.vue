<script setup>
import { ref } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, GridComponent } from 'echarts/components';

use([CanvasRenderer, BarChart, TitleComponent, GridComponent]);

const option = ref({
  title: {
    text: 'Количество SMS по статусам',
    left: 'left'
  },
  xAxis: {
    type: 'category',
    data: ['Создано', 'Отправлено', 'Доставлено', 'Не доставлено', 'Ошибка', 'Отклонено', 'Не удалось', 'Создано', 'Состояно'],
    axisLabel: {
      rotate: 45,
      interval: 0
    }
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
});
</script>

<template>
  <div>
    <VChart :option="option" style="height: 300px;" />
  </div>
</template>