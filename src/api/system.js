import request from '@/utils/request'

/**
 * 系统管理相关接口
 */
export const systemAPI = {
  // 获取系统信息
  getSystemInfo: () => request.get('/system/info'),
  
  // 获取系统配置
  getSystemConfig: () => request.get('/system/config'),
  
  // 更新系统配置
  updateSystemConfig: (data) => request.put('/system/config', data),
  
  // 获取系统日志
  getSystemLogs: (params) => request.get('/system/logs', { params }),
  
  // 清理系统日志
  clearSystemLogs: (days) => request.delete('/system/logs', { data: { days } }),
  
  // 获取在线用户
  getOnlineUsers: (params) => request.get('/system/online-users', { params }),
  
  // 强制下线用户
  forceLogout: (userId) => request.post(`/system/force-logout/${userId}`),
  
  // 获取登录日志
  getLoginLogs: (params) => request.get('/system/login-logs', { params }),
  
  // 获取操作日志
  getOperationLogs: (params) => request.get('/system/operation-logs', { params }),
  
  // 数据备份
  backupData: () => request.post('/system/backup', {}, { responseType: 'blob' }),
  
  // 数据恢复
  restoreData: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/system/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  // 清理缓存
  clearCache: () => request.post('/system/clear-cache'),
  
  // 获取服务器状态
  getServerStatus: () => request.get('/system/server-status'),
  
  // 获取数据库状态
  getDatabaseStatus: () => request.get('/system/database-status'),
  
  // 发送系统通知
  sendNotification: (data) => request.post('/system/notification', data),
}