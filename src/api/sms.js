import axiosInstance from "@/utils/axios.js";

export async function sms() {
    return axiosInstance({
        url: `/report/sms`,
        method: 'GET',
    })
}
export async function updateProfileApi(data) {
    return axiosInstance({
        url: `/v1/profile/update-profile`,
        method: 'POST',
        data
    })
}