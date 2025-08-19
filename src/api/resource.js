import axiosInstance from "@/utils/axios.js";

export async function allOperators(params) {
    return axiosInstance({
        url: `/report/sms/all-operators`,
        method: 'GET',
        params
    })
}
export async function allMerchants(params) {
    return axiosInstance({
        url: `/report/sms/all-merchants`,
        method: 'GET',
        params
    })
}