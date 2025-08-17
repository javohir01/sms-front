import axiosInstance from "@/utils/axios.js";

export async function getMe() {
    return axiosInstance({
        url: `/v1/profile/getMe`,
        method: 'GET',
    })
}
export async function balance() {
    return axiosInstance({
        url: `/v1/profile/balance`,
        method: 'GET',
    })
}
export async function balanceHistory(filter) {
    return axiosInstance({
        url: `/v1/profile/balance-history`,
        method: 'GET',
        params: filter
    })
}
export async function updateProfileApi(data) {
    return axiosInstance({
        url: `/v1/profile/update-profile`,
        method: 'POST',
        data
    })
}

export async function createBalanceApi(data) {
    return axiosInstance({
        url: `/v1/profile/pay-wallet`,
        method: 'POST',
        data
    })
}