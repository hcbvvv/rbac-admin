import request from '@/utils/request'

/**
 * 角色管理相关接口
 */
export const roleAPI = {
  // 获取角色列表
  getRoles: (params) => request.get('/roles', { params }),
  
  // 获取角色详情
  getRole: (id) => request.get(`/roles/${id}`),
  
  // 创建角色
  createRole: (data) => request.post('/roles', data),
  
  // 更新角色
  updateRole: (id, data) => request.put(`/roles/${id}`, data),
  
  // 删除角色
  deleteRole: (id) => request.delete(`/roles/${id}`),
  
  // 批量删除角色
  batchDeleteRoles: (ids) => request.post('/roles/batch-delete', { ids }),
  
  // 获取角色权限
  getRolePermissions: (id) => request.get(`/roles/${id}/permissions`),
  
  // 分配角色权限
  assignRolePermissions: (id, permissionIds) => 
    request.post(`/roles/${id}/permissions`, { permissionIds }),
  
  // 获取角色菜单
  getRoleMenus: (id) => request.get(`/roles/${id}/menus`),
  
  // 分配角色菜单
  assignRoleMenus: (id, menuIds) => 
    request.post(`/roles/${id}/menus`, { menuIds }),
  
  // 获取角色用户
  getRoleUsers: (id, params) => request.get(`/roles/${id}/users`, { params }),
  
  // 分配用户到角色
  assignUsersToRole: (id, userIds) => 
    request.post(`/roles/${id}/users`, { userIds }),
  
  // 从角色移除用户
  removeUsersFromRole: (id, userIds) => 
    request.delete(`/roles/${id}/users`, { data: { userIds } }),
  
  // 复制角色
  copyRole: (id, data) => request.post(`/roles/${id}/copy`, data),
  
  // 获取角色树（层级结构）
  getRoleTree: () => request.get('/roles/tree'),
  
  // 设置数据权限
  setDataScope: (id, dataScope, customDeptIds = []) => 
    request.post(`/roles/${id}/data-scope`, { dataScope, customDeptIds }),
}