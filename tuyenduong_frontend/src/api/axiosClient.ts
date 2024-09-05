import axios from 'axios'
import queryString from 'query-string'
import store from '../store'
import { setUnAuthorized } from '../redux/unAuthorized'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_SERVER,
  headers:
    process.env.REACT_APP_NODE_ENV === 'development'
      ? {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      : {
          'content-type': 'application/json',
        },
  paramsSerializer: (params) => queryString.stringify(params),
  withCredentials: true,
})
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token')
  config.headers['Authentication'] = token
  return config
})
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    // Handle errors
    if (error.response.status === 401) {
      store.dispatch(setUnAuthorized(true))
      throw error
    }
    throw error
  }
)

export default axiosClient
