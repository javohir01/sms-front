import axiosInstance from "@/utils/axios.js";

export async function usersList() {
    return axiosInstance({
        url: `/munis/user-services/services`,
        method: 'GET',
    })
}
export async function userStore(data) {
    return axiosInstance({
        url: `/munis/user-services/services`,
        method: 'POST',
        data: data
    })
}
export function userUpdate(id, data) {
  return axiosInstance({
    url: `/munis/user-services/services/` + id,
    method: 'put',
    data
  })
}

export function destroy(id) {
  return axiosInstance({
    url: '/munis/user-services/services/' + id,
    method: 'delete'
  })
}



export async function usersListService(id) {
    return axiosInstance({
        url: `/munis/user-services/branches/service/` + id,
        method: 'GET',
        data:{id}
    })
}
export async function userStoreService(data) {
    return axiosInstance({
        url: `/munis/user-services/branches`,
        method: 'POST',
        data: data
    })
}
export function userUpdateService(id, data) {
  return axiosInstance({
    url: `/munis/user-services/branches/${id}`,
    method: 'put',
    data
  })
}
export function destroyService(id) {
  return axiosInstance({
    url: '/munis/user-services/branches/' + id,
    method: 'delete'
  })
}