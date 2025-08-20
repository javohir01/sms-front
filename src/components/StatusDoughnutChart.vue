<script setup>
import { ref } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, LegendComponent } from 'echarts/components';

use([CanvasRenderer, PieChart, TitleComponent, LegendComponent]);

const option = ref({
  title: {
    text: 'Количество SMS по статусам',
    left: 'left'
  },
  legend: {
    orient: 'horizontal',
    bottom: 0,
    data: ['Успешно', 'Неуспешно']
  },
  series: [
    {
      type: 'pie',
      radius: ['60%', '80%'], // Doughnut style
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'inner',
        formatter: '{d}%'
      },
      data: [
        { value: 68.8, name: 'Успешно', itemStyle: { color: '#A5D6A7' } },
        { value: 18.8, name: 'Неуспешно', itemStyle: { color: '#64B5F6' } },
        { value: 12.4, name: '', itemStyle: { color: 'transparent' }, label: { show: false } }
      ]
    }
  ]
});
</script>

<template>
  <div>
    <div class="header">2025-05-30 00:00:00 - 2025-06-09 23:59:59</div>
    <VChart :option="option" style="height: 300px;" />
  </div>
</template>

<style>
.header {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}
</style>