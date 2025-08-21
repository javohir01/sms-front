import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'
import {
  sms,
  smsFrame,
  exportSms,
  exportSmsFrame
} from '@/api/sms' 

export const useSmsStore = defineStore('sms', () => {
  const smses = ref({})
  const smsFrames = ref({})
  const loading = ref(false)
  const error = ref(null)
  const statuses = reactive({
    'CREATED': 'Создано',
    'FAILED': 'Ошибка',
    'NOT_FOUND': 'Не удалось',
    'EXPIRED': 'Истекло',
    'TRANSMITTED': 'Отправлено',
    'DELIVERED': 'Доставлено',
    'REJECTED': 'Отклонено',
    'NOT_DELIVERED': 'Не доставлено'
  })
  const fetchSmses = async (params: any) => {
    loading.value = true
    try {
      const response = await sms(params)
      if (response?.data) {
        smses.value = response.data || []
      }
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  const fetchSmsFrames = async (params: any) => {
    loading.value = true
    try {
      const response = await smsFrame(params)
      if (response?.data) {
        smsFrames.value = response.data || []
      }
    } catch (err) {
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
    statuses,
    fetchSmses,
    fetchSmsFrames,
    smsExport,
    smsFrameExport
  }
})
