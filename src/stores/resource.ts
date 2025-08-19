import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  allOperators,
  allMerchants
} from '@/api/resource'

export const useResourceStore = defineStore('resource', () => {
  const operators = ref([])
  const merchants = ref([])
  const loading = ref(false)

  const fetchOperators = async () => {
    loading.value = true
    try {
      const response = await allOperators()
      if (response?.status === 200) {
        console.log('Operatorlar muvaffaqiyatli olindi:', response.data)
      } else {
        console.error('Operatorlarni olishda xatolik:', response)
      }
      if (response?.data) {
        operators.value = response.data || []
      }
    } catch (err) {
      console.error('Operatorlarni olishda xatolik:', err)
    } finally {
      loading.value = false
    }
  }
  const fetchMerchants = async () => {
    loading.value = true
    try {
      const response = await allMerchants()
      if (response?.status === 200) {
        console.log('Operatorlar muvaffaqiyatli olindi:', response.data)
      } else {
        console.error('Operatorlarni olishda xatolik:', response)
      }
      if (response?.data) {
        merchants.value = response.data || []
      }
    } catch (err) {
      console.error('Operatorlarni olishda xatolik:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    operators,
    merchants,
    fetchOperators,
    fetchMerchants
  }
})
