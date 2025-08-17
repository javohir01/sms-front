import axios from '@/utils/axios.js'
export async function login(username, password) {
    return axios({
        url: `v1/auth/login`,
        method: 'POST',
        data: {
            username,
            password
        }
    })
}