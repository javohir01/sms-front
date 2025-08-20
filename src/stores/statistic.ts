import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  byStatusChart,
  byOperatorChart
} from '@/api/statistic' 

export const useStatisticStore = defineStore('statistic', () => {
  const loading = ref(false)
  const error = ref(null)

  const fetchByStatusChart = async (params: any) => {
    const res = await byStatusChart(params)
    return res.data
  }

  const fetchByOperatorChart = async (params: any) => {
    const res = await byOperatorChart(params)
    return res.data
  }
  return {
    loading,
    error,
    fetchByStatusChart,
    fetchByOperatorChart,
  }
})
