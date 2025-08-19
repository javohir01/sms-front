import axiosInstance from "@/utils/axios.js";

export async function sms(params) {
    return axiosInstance({
        url: `/report/sms`,
        method: 'GET',
        params
    })
}
export async function updateProfileApi(data) {
    return axiosInstance({
        url: `/v1/profile/update-profile`,
        method: 'POST',
        data
    })
}