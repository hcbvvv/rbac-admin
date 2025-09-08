import request from '@/utils/request'

/**
 * 用户管理相关接口
 */
export const userAPI = {
  // 获取用户列表
  getUsers: (params) => request.get('/users', { params }),
  
  // 获取用户详情
  getUser: (id) => request.get(`/users/${id}`),
  
  // 创建用户
  createUser: (data) => request.post('/users', data),
  
  // 更新用户
  updateUser: (id, data) => request.put(`/users/${id}`, data),
  
  // 删除用户
  deleteUser: (id) => request.delete(`/users/${id}`),
  
  // 批量删除用户
  batchDeleteUsers: (ids) => request.post('/users/batch-delete', { ids }),
  
  // 修改用户状态
  updateUserStatus: (id, status) => request.patch(`/users/${id}/status`, { status }),
  
  // 重置用户密码
  resetUserPassword: (id, password) => request.patch(`/users/${id}/reset-password`, { password }),
  
  // 分配用户角色
  assignUserRoles: (id, roleIds) => request.post(`/users/${id}/roles`, { roleIds }),
  
  // 获取用户角色
  getUserRoles: (id) => request.get(`/users/${id}/roles`),
  
  // 导入用户
  importUsers: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  // 导出用户
  exportUsers: (params) => request.get('/users/export', { 
    params,
    responseType: 'blob'
  }),
  
  // 获取用户统计信息
  getUserStats: () => request.get('/users/stats'),
}