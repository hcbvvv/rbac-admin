import request from '@/utils/request'

/**
 * 部门管理相关接口
 */
export const deptAPI = {
  // 获取部门列表
  getDepts: (params) => request.get('/depts', { params }),
  
  // 获取部门树
  getDeptTree: () => request.get('/depts/tree'),
  
  // 获取部门详情
  getDept: (id) => request.get(`/depts/${id}`),
  
  // 创建部门
  createDept: (data) => request.post('/depts', data),
  
  // 更新部门
  updateDept: (id, data) => request.put(`/depts/${id}`, data),
  
  // 删除部门
  deleteDept: (id) => request.delete(`/depts/${id}`),
  
  // 批量删除部门
  batchDeleteDepts: (ids) => request.post('/depts/batch-delete', { ids }),
  
  // 移动部门
  moveDept: (id, targetId, position) => 
    request.post(`/depts/${id}/move`, { targetId, position }),
  
  // 获取部门用户
  getDeptUsers: (id, params) => request.get(`/depts/${id}/users`, { params }),
  
  // 分配用户到部门
  assignUsers: (id, userIds) => 
    request.post(`/depts/${id}/users`, { userIds }),
  
  // 从部门移除用户
  removeUsers: (id, userIds) => 
    request.delete(`/depts/${id}/users`, { data: { userIds } }),
  
  // 获取部门的子部门
  getChildDepts: (id) => request.get(`/depts/${id}/children`),
  
  // 获取部门及其所有下级部门ID
  getSubDeptIds: (id) => request.get(`/depts/${id}/sub-ids`),
  
  // 检查部门编码是否存在
  checkDeptCode: (code, excludeId) => 
    request.get('/depts/check-code', { params: { code, excludeId } }),
  
  // 更新部门状态
  updateDeptStatus: (id, status) => 
    request.patch(`/depts/${id}/status`, { status }),
  
  // 获取部门统计信息
  getDeptStats: (id) => request.get(`/depts/${id}/stats`),
  
  // 导出部门结构
  exportDepts: () => request.get('/depts/export', { responseType: 'blob' }),
  
  // 导入部门结构
  importDepts: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/depts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  // 获取部门路径（从根到当前部门）
  getDeptPath: (id) => request.get(`/depts/${id}/path`),
  
  // 搜索部门
  searchDepts: (keyword) => request.get('/depts/search', { params: { keyword } }),
}