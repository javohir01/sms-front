<script setup>
import { ref } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, LegendComponent } from 'echarts/components';

use([CanvasRenderer, PieChart, TitleComponent, LegendComponent]);

const option = ref({
  title: [
    {
      text: 'Статистика отправленных SMS',
      left: 'left'
    },
    {
      text: 'ВСЕГО ОТПРАВЛЕНО\nSMS\n20,210',
      left: 'center',
      top: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center'
      }
    }
  ],
  legend: {
    orient: 'horizontal',
    bottom: 0,
    data: ['UCELL', 'Beeline', 'Humans', 'UZTELEKOM', 'Mobiuz', 'Perfectum']
  },
  series: [
    {
      type: 'pie',
      radius: ['60%', '80%'], // Doughnut style
      avoidLabelOverlap: false,
      label: { show: false },
      data: [
        { value: 710, name: 'UCELL', itemStyle: { color: '#6A1B9A' } },
        { value: 2021, name: 'Beeline', itemStyle: { color: '#FFEB3B' } },
        { value: 3031, name: 'Humans', itemStyle: { color: '#4CAF50' } },
        { value: 8084, name: 'UZTELEKOM', itemStyle: { color: '#2196F3' } },
        { value: 5052, name: 'Mobiuz', itemStyle: { color: '#F44336' } },
        { value: 1312, name: 'Perfectum', itemStyle: { color: '#FF9800' } }
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