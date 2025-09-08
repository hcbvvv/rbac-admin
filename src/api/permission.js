import request from '@/utils/request'

/**
 * 权限管理相关接口
 */
export const permissionAPI = {
  // 获取权限列表
  getPermissions: (params) => request.get('/permissions', { params }),
  
  // 获取权限树
  getPermissionTree: () => request.get('/permissions/tree'),
  
  // 获取权限详情
  getPermission: (id) => request.get(`/permissions/${id}`),
  
  // 创建权限
  createPermission: (data) => request.post('/permissions', data),
  
  // 更新权限
  updatePermission: (id, data) => request.put(`/permissions/${id}`, data),
  
  // 删除权限
  deletePermission: (id) => request.delete(`/permissions/${id}`),
  
  // 批量删除权限
  batchDeletePermissions: (ids) => request.post('/permissions/batch-delete', { ids }),
  
  // 移动权限位置
  movePermission: (id, targetId, position) => 
    request.post(`/permissions/${id}/move`, { targetId, position }),
  
  // 获取权限的子权限
  getChildPermissions: (id) => request.get(`/permissions/${id}/children`),
  
  // 检查权限代码是否存在
  checkPermissionCode: (code, excludeId) => 
    request.get('/permissions/check-code', { params: { code, excludeId } }),
  
  // 同步权限（从代码中扫描）
  syncPermissions: () => request.post('/permissions/sync'),
  
  // 获取用户权限
  getUserPermissions: (userId) => request.get(`/permissions/user/${userId}`),
  
  // 获取角色权限
  getRolePermissions: (roleId) => request.get(`/permissions/role/${roleId}`),
  
  // 权限验证
  validatePermission: (permissionCode) => 
    request.post('/permissions/validate', { permissionCode }),
}