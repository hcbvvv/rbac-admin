import request from '@/utils/request'

/**
 * 数据字典 API
 */
const dictAPI = {
  // 字典类型相关
  getDictTypes: () => {
    return request.get('/api/dict/types')
  },

  // 字典主表相关
  getDictList: (params) => {
    return request.get('/api/dict/list', { params })
  },

  createDict: (data) => {
    return request.post('/api/dict', data)
  },

  updateDict: (id, data) => {
    return request.put(`/api/dict/${id}`, data)
  },

  deleteDict: (id) => {
    return request.delete(`/api/dict/${id}`)
  },

  getDictById: (id) => {
    return request.get(`/api/dict/${id}`)
  },

  // 字典选项相关
  getDictOptions: (dictCode, params = {}) => {
    return request.get(`/api/dict/${dictCode}/options`, { params })
  },

  createDictOption: (dictCode, data) => {
    return request.post(`/api/dict/${dictCode}/options`, data)
  },

  updateDictOption: (dictCode, optionId, data) => {
    return request.put(`/api/dict/${dictCode}/options/${optionId}`, data)
  },

  deleteDictOption: (dictCode, optionId) => {
    return request.delete(`/api/dict/${dictCode}/options/${optionId}`)
  },

  // 批量操作
  batchDeleteDict: (ids) => {
    return request.delete('/api/dict/batch', { data: { ids } })
  },

  batchDeleteOptions: (dictCode, ids) => {
    return request.delete(`/api/dict/${dictCode}/options/batch`, { data: { ids } })
  },

  // 字典缓存相关
  refreshDictCache: (dictCode) => {
    return request.post(`/api/dict/${dictCode}/refresh`)
  },

  clearAllDictCache: () => {
    return request.post('/api/dict/cache/clear')
  },

  // 字典导入导出
  exportDict: (dictCode) => {
    return request.get(`/api/dict/${dictCode}/export`, {
      responseType: 'blob'
    })
  },

  importDict: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/api/dict/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 获取字典树
  getDictTree: () => {
    return request.get('/api/dict/tree')
  },

  // 根据字典编码获取选项（用于其他模块调用）
  getDictOptionsByCode: (dictCode) => {
    return request.get(`/api/dict/options/${dictCode}`)
  },

  // 字典验证
  validateDictCode: (dictCode, excludeId) => {
    return request.post('/api/dict/validate', { dictCode, excludeId })
  },

  validateOptionValue: (dictCode, value, excludeId) => {
    return request.post(`/api/dict/${dictCode}/options/validate`, { value, excludeId })
  }
}

export { dictAPI }