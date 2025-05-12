import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL

const $api = axios.create({
	baseURL: API_URL, 
	headers: {
		'Content-Type': 'application/json',
	},
})

$api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('authToken')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

export default $api
