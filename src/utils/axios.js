import axios from 'axios'
import router from '@/router'
import { getAccessToken } from '@/utils/localStorage.js'

import { useAuthStore } from '@/stores/auth'
const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 60000
})

axiosInstance.interceptors.request.use(
	config => {
		const accessToken = getAccessToken()

		if (accessToken != null) config.headers['Authorization'] = 'Bearer ' + accessToken
		return config
	},

	error => Promise.reject(error)
)
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
