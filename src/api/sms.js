import axiosInstance from "@/utils/axios.js";

export async function sms(params) {
  return axiosInstance({
    url: `/report/sms`,
    method: 'GET',
    params
  })
}

export async function exportSms(params) { 
  return axiosInstance({
    url: `/report/sms/export`,
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

export async function smsFrame(params) {
  return axiosInstance({
    url: `/sms-templates`,
    method: 'GET',
    params
  })
}

export async function exportSmsFrame(params) { 
  return axiosInstance({
    url: `/sms-templates/export`,
    method: 'GET',
    params,
    responseType: 'blob'
  })
}