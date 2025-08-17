import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin } from '@/api/auth.js'
import { setAccessToken } from "@/utils/localStorage"
import { getMe } from '@/api/profile'

// Helper functions for localStorage
const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}
const setLocal = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
}
const removeLocal = (key: string) => {
  localStorage.removeItem(key)
}

export const useAuthStore = defineStore('auth', () => {
  const defaultUser = { merchantName: '' }
  const isAuthenticated = ref(getLocal<boolean>('isAuthenticated', false))
  const user = ref(getLocal('user', defaultUser))

  // Fetch user profile from API
  const fetchUser = async () => {
    try {
      const response = await getMe()
      if (response?.data?.data) {
        user.value = response.data.data
        setLocal('user', user.value)
      }
    } catch (error) {
      console.error('Profil maʼlumotlarini olishda xatolik:', error)
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password)
      const data = response?.data?.data

      if (data?.accessToken) {
        isAuthenticated.value = true
        setAccessToken(data.accessToken)
        await fetchUser()
        setLocal('isAuthenticated', true)
        setLocal('user', user.value)
        return true
      }
    } catch (e) {
      console.error('Login xatolik:', e)
    }
    // Reset state on failure
    isAuthenticated.value = false
    setLocal('isAuthenticated', false)
    removeLocal('user')
    return false
  }

  // Logout function
  const logout = () => {
    isAuthenticated.value = false
    user.value = defaultUser
    setLocal('isAuthenticated', false)
    removeLocal('user')
    removeLocal('access_token')
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    fetchUser
  }
})
