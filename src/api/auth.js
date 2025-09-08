import request from '@/utils/request'

/**
 * 用户认证相关接口
 */
export const authAPI = {
  // 登录
  login: (data) => request.post('/auth/login', data),
  
  // 登出
  logout: () => request.post('/auth/logout'),
  
  // 刷新 token
  refreshToken: (refreshToken) => request.post('/auth/refresh', { refreshToken }),
  
  // 获取用户信息
  getUserInfo: () => request.get('/auth/user'),
  
  // 修改密码
  changePassword: (data) => request.post('/auth/change-password', data),
  
  // 重置密码
  resetPassword: (data) => request.post('/auth/reset-password', data),
  
  // 发送验证码
  sendCaptcha: (data) => request.post('/auth/captcha', data),
  
  // 验证token有效性
  validateToken: () => request.get('/auth/validate'),
}