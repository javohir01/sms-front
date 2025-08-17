// stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  usersList,
  userStore,
  userUpdate,
  destroy,
  usersListService,
  userStoreService,
  userUpdateService,
  destroyService
} from '@/api/users' 

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await usersList()
      if (response?.data) {
        users.value = response.data || []
      }
    } catch (err) {
      console.error('Foydalanuvchilarni olishda xatolik:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Yangi foydalanuvchi qo‘shish
  const addUser = async (payload) => {
    loading.value = true
    try {
      await userStore(payload)
      await fetchUsers() // Ro‘yxatni yangilash
    } catch (err) {
      console.error('Foydalanuvchini qo‘shishda xatolik:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

const updateUser = async (payload) => {
  loading.value = true
  try {
    const { id, ...data } = payload
    console.log('Yuborilayotgan ID:', id) // debug uchun
    await userUpdate(id, data)
    await fetchUsers()
  } catch (err) {
    console.error('Foydalanuvchini yangilashda xatolik:', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

  // Foydalanuvchini o‘chirish
  const deleteUser = async (id) => {
    loading.value = true
    try {
      await destroy(id)
      await fetchUsers()
    } catch (err) {
      console.error('Foydalanuvchini o‘chirishda xatolik:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }
  const fetchUsersService = async (id) => {
    loading.value = true
    try {
      const response = await usersListService(id)
      if (response?.data) {
        users.value = response.data || []
      }
    } catch (err) {
      console.error('Foydalanuvchilarni olishda xatolik:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Yangi foydalanuvchi qo‘shish
  const addUserService = async (payload) => {
    loading.value = true
    try {
      await userStoreService(payload)
      await fetchUsersService(payload?.id) // Ro‘yxatni yangilash
    } catch (err) {
      console.error('Foydalanuvchini qo‘shishda xatolik:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

const updateUserService = async (payload) => {
  loading.value = true
  try {
    const { id, ...data } = payload
    if (!id) throw new Error("ID topilmadi (updateUserService)")
    await userUpdateService(id, data)
    await fetchUsersService(id)
  } catch (err) {
    console.error('Foydalanuvchini yangilashda xatolik (updateUserService):', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

  // Foydalanuvchini o‘chirish
  const deleteUserService = async (id) => {
    loading.value = true
    try {
      await destroyService(id)
      await fetchUsersService(id)
    } catch (err) {
      console.error('Foydalanuvchini o‘chirishda xatolik:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    fetchUsersService,
    addUserService,
    updateUserService,
    deleteUserService,
  }
})
