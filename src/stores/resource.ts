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
      if (response?.data) {
        operators.value = response.data || []
      }
    } finally {
      loading.value = false
    }
  }
  const fetchMerchants = async () => {
    loading.value = true
    try {
      const response = await allMerchants()
      if (response?.data) {
        merchants.value = response.data || []
      }
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
