import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  sms
} from '@/api/sms' 

export const useSmsStore = defineStore('sms', () => {
  const smses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchSmses = async (params: {}) => {
    loading.value = true
    try {
      const response = await sms()
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

  return {
    fetchSmses
  }
})
