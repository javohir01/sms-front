import { defineStore } from 'pinia'
import { ref } from 'vue'
import { updateProfileApi } from '@/api/profile'

export const useProfileStore = defineStore('profile', () => {
  const totalPages = ref(1)
  const totalItems = ref(0)
  const isLoading = ref(false)
  const currentPage = ref(0)
  const snackbar = ref({ show: false, text: '', color: 'success' })

  const showSnackbar = (text: string, color: string = 'success') => {
    snackbar.value = { show: true, text, color }
    setTimeout(() => snackbar.value.show = false, 3000)
  }


  const updateProfile = async (data) => {
    try {
      await updateProfileApi(data)
      showSnackbar('Muvaffaqiyatli yangilandi', 'success')
    } catch (error) {
      console.error('Profilni yangilashda xatolik:', error)
      showSnackbar(error?.data?.message || error.message || 'Xatolik yuz berdi', 'error')
      throw error
    }
  }

  return {
    totalPages,
    totalItems,
    isLoading,
    currentPage,
    updateProfile,
    snackbar
  }
})