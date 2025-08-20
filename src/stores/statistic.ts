import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  byStatusChart,
  byStatusWithDetailChart,
  byOperatorChart
} from '@/api/statistic'
import fixNanhai from "echarts/types/src/coord/geo/fix/nanhai";

export const useStatisticStore = defineStore('statistic', () => {
  const error = ref(null)
  const fetchByStatusChart = async (params: any) => {
    const res = await byStatusChart(params)
    return res
  }
  const fetchByStatusWithDetailChart = async (params: any) => {
    const res = await byStatusWithDetailChart(params)
    return res
  }

  const fetchByOperatorChart = async (params: any) => {
    const res = await byOperatorChart(params)
    return res.data
  }
  return {
    error,
    fetchByStatusChart,
    fetchByStatusWithDetailChart,
    fetchByOperatorChart,

  }
})
