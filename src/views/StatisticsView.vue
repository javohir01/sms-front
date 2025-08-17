<template>
  <v-container fluid class="statistics-container">
    <h>Statistic</h>
  </v-container>
</template>

<script setup lang="ts">
import { ref,h } from 'vue'

const dateRange = ref('')
const dateRange2 = ref('')
const itemsPerPageOptions = ['5', '10', '20', '50']
const itemsPerPage = ref('5')
const searchQuery = ref('')

// Example data for main charts
const turnoverChartSeries = [
  {
    name: 'Платежи',
    data: [0, 50000000, 150000000, 250000000, 200000000, 100000000, 50000000, 0]
  },
  {
    name: 'Переводы',
    data: [0, 40000000, 100000000, 200000000, 150000000, 80000000, 30000000, 0]
  }
]
const turnoverChartOptions = {
  chart: { toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#8B5CF6', '#10B981'],
  stroke: { width: 3, curve: 'smooth' },
  xaxis: {
    categories: ['24-11', '24-12', '24-13', '24-14', '24-15', '24-16', '24-17', '24-18'],
    labels: { style: { fontSize: '10px', colors: '#666', fontFamily: 'Mulish, sans-serif' } }
  },
  yaxis: {
    labels: { style: { fontSize: '10px', colors: '#666', fontFamily: 'Mulish, sans-serif' } }
  },
  legend: { show: false },
  grid: { borderColor: '#f0f0f0' }
}

const quantityChartSeries = [
  {
    name: 'Платежи',
    data: [0, 10, 25, 45, 40, 20, 5, 0]
  },
  {
    name: 'Переводы',
    data: [0, 8, 20, 35, 30, 15, 3, 0]
  }
]
const quantityChartOptions = {
  chart: { toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#8B5CF6', '#10B981'],
  stroke: { width: 3, curve: 'smooth' },
  xaxis: {
    categories: ['24-11', '24-12', '24-13', '24-14', '24-15', '24-16', '24-17', '24-18'],
    labels: { style: { fontSize: '10px', colors: '#666', fontFamily: 'Mulish, sans-serif' } }
  },
  yaxis: {
    labels: { style: { fontSize: '10px', colors: '#666', fontFamily: 'Mulish, sans-serif' } }
  },
  legend: { show: false },
  grid: { borderColor: '#f0f0f0' }
}

// Example agents data
const agents = ref([
  {
    id: 1,
    name: 'BP_Muxiddin',
    activeTab: 'amount',
    payment: {
      quantity: 52,
      amount: '25 128 750.00 UZS'
    },
    transfer: {
      quantity: 52,
      amount: '25 128 750.00 UZS'
    },
    total: {
      quantity: 52,
      amount: '25 128 750.00 UZS'
    },
    chartData: {
      amount: {
        payments: [0, 5000000, 10000000, 25000000, 20000000, 10000000, 5000000, 0],
        transfers: [0, 4000000, 8000000, 20000000, 15000000, 8000000, 3000000, 0]
      },
      quantity: {
        payments: [0, 5, 12, 25, 20, 10, 5, 0],
        transfers: [0, 4, 10, 20, 15, 8, 3, 0]
      }
    }
  },
  // ... boshqa agentlar ...
])

function getAgentChartSeries(agent: any) {
  if (agent.activeTab === 'amount') {
    return [
      { name: 'Платежи', data: agent.chartData.amount.payments },
      { name: 'Переводы', data: agent.chartData.amount.transfers }
    ]
  } else {
    return [
      { name: 'Платежи', data: agent.chartData.quantity.payments },
      { name: 'Переводы', data: agent.chartData.quantity.transfers }
    ]
  }
}
function getAgentChartOptions(agent: any) {
  return {
    chart: { toolbar: { show: false }, zoom: { enabled: false }, sparkline: { enabled: true } },
    colors: ['#8B5CF6', '#10B981'],
    stroke: { width: 2, curve: 'smooth' },
    xaxis: {
      categories: ['24-11', '24-12', '24-13', '24-14', '24-15', '24-16', '24-17', '24-18'],
      labels: { show: false }
    },
    yaxis: { labels: { show: false } },
    legend: { show: false },
    grid: { borderColor: '#f0f0f0' }
  }
}
function clearFilter() {
  dateRange.value = ''
  dateRange2.value = ''
  itemsPerPage.value = '5'
  searchQuery.value = ''
}
function clearFilterAgents() {
  dateRange2.value = ''
  itemsPerPage.value = '5'
  searchQuery.value = ''
}
</script>