import axiosInstance from "@/utils/axios.js";

export async function byStatusChart(params) {
  return axiosInstance({
    url: `/v1/summary-result-by-status`,
    method: 'GET',
    params
  })
}

export async function byOperatorChart(params) {
  return axiosInstance({
    url: `/v1/summary-result-by-operator`,
    method: 'GET',
    params
  })
}