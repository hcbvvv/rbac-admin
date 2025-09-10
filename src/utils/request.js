import axios from 'axios'
import { message } from '@/utils/antdGlobal'
import { captureError } from './errorHandler'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 打印请求信息（开发环境）
    if (import.meta.env.DEV) {
      console.log('🚀 Request:', config.method?.toUpperCase(), config.url, config.data)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 打印响应信息（开发环境）
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.config.url, data)
    }
    
    // 统一处理响应格式
    if (data.code === 200 || data.success) {
      return data.data || data
    } else {
      // 业务错误处理
      message.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  (error) => {
    console.error('❌ Response Error:', error)
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_info')
          message.error('登录已过期，请重新登录')
          // 可以在这里添加跳转到登录页的逻辑
          window.location.href = '/login'
          break
        case 403:
          message.error('权限不足，无法访问')
          // 权限错误，使用全局错误处理
          const permissionError = new Error(data?.message || '权限不足')
          permissionError.status = 403
          permissionError.response = error.response
          captureError(permissionError, {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params,
            data: error.config?.data,
            errorType: '403'
          })
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
        case 502:
        case 503:
        case 504:
          // 服务器错误，使用全局错误处理
          const serverError = new Error(data?.message || '服务器内部错误')
          serverError.status = status
          serverError.response = error.response
          captureError(serverError, {
            url: error.config?.url,
            method: error.config?.method,
            params: error.config?.params,
            data: error.config?.data
          })
          break
        default:
          message.error(data?.message || '网络错误，请稍后重试')
      }
    } else if (error.request) {
      // 网络错误
      message.error('网络连接失败，请检查网络')
      console.error('Network Error:', error.request)
    } else {
      // 请求配置错误或其他错误
      message.error('请求配置错误')
      // 捕获未知错误
      captureError(error, {
        type: 'request_config_error',
        config: error.config
      })
    }
    
    return Promise.reject(error)
  }
)

export default request