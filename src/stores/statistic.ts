import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  byStatusChart,
  byOperatorChart
} from '@/api/statistic' 

export const useSmsStore = defineStore('sms', () => {
  const smses = ref({})
  const smsFrames = ref({})
  const loading = ref(false)
  const error = ref(null)

  const fetchSmses = async (params: any) => {
    loading.value = true
    try {
      const response = await sms(params)
      console.log('SMSlar:', response)
      if (response?.status === 200) {
        console.log('SMSlar muvaffaqiyatli olindi:', response.data)
      } else {
        console.error('SMSlarni olishda xatolik:', response)
      }
      if (response?.data) {
        smses.value = response.data || []
      }
    } catch (err) {
      console.error('Smslarni olishda xatolik:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }
  const fetchSmsFrames = async (params: any) => {
    loading.value = true
    try {
      const response = await smsFrame(params)
      console.log('SMSlar:', response)
      if (response?.status === 200) {
        console.log('SMSlar muvaffaqiyatli olindi:', response.data)
      } else {
        console.error('SMSlarni olishda xatolik:', response)
      }
      if (response?.data) {
        smsFrames.value = response.data || []
      }
    } catch (err) {
      console.error('Smslarni olishda xatolik:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }
  const smsExport = async (filter: Object) => {
    const res = await exportSms(filter)
    return res.data
  }
  const smsFrameExport = async (filter: Object) => {
    const res = await exportSmsFrame(filter)
    return res.data
  }

  return {
    loading,
    error,
    smses,
    smsFrames,
    fetchSmses,
    fetchSmsFrames,
    smsExport,
    smsFrameExport
  }
})
