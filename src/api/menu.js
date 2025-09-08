import request from '@/utils/request'

/**
 * 菜单管理相关接口
 */
export const menuAPI = {
  // 获取用户菜单
  getUserMenus: () => request.get('/menus/user'),
  
  // 获取所有菜单
  getAllMenus: () => request.get('/menus'),
  
  // 获取菜单树
  getMenuTree: () => request.get('/menus/tree'),
  
  // 获取菜单详情
  getMenu: (id) => request.get(`/menus/${id}`),
  
  // 创建菜单
  createMenu: (data) => request.post('/menus', data),
  
  // 更新菜单
  updateMenu: (id, data) => request.put(`/menus/${id}`, data),
  
  // 删除菜单
  deleteMenu: (id) => request.delete(`/menus/${id}`),
  
  // 批量删除菜单
  batchDeleteMenus: (ids) => request.post('/menus/batch-delete', { ids }),
  
  // 移动菜单位置
  moveMenu: (id, targetId, position) => 
    request.post(`/menus/${id}/move`, { targetId, position }),
  
  // 获取菜单的子菜单
  getChildMenus: (id) => request.get(`/menus/${id}/children`),
  
  // 更新菜单状态
  updateMenuStatus: (id, status) => 
    request.patch(`/menus/${id}/status`, { status }),
  
  // 检查菜单路径是否存在
  checkMenuPath: (path, excludeId) => 
    request.get('/menus/check-path', { params: { path, excludeId } }),
  
  // 获取面包屑导航
  getBreadcrumb: (path) => request.get('/menus/breadcrumb', { params: { path } }),
  
  // 刷新菜单缓存
  refreshMenuCache: () => request.post('/menus/refresh-cache'),
  
  // 导出菜单配置
  exportMenus: () => request.get('/menus/export', { responseType: 'blob' }),
  
  // 导入菜单配置
  importMenus: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/menus/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}