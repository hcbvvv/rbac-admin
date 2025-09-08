import { useMemo } from 'react'
import { useAuthStore, useDeptStore } from '@/stores'
import { DataPermissionUtils } from '@/utils/permission'

/**
 * 数据权限 Hook
 */
export const useDataPermission = () => {
  const { user } = useAuthStore()
  const { depts } = useDeptStore()
  
  // 根据数据权限过滤数据
  const filterDataByPermission = useMemo(() => {
    return (data, dataScope = 'all', customDeptIds = []) => {
      if (!user || !data || data.length === 0) {
        return data || []
      }
      
      return DataPermissionUtils.filterDataByScope(
        data, 
        dataScope, 
        user, 
        customDeptIds, 
        depts
      )
    }
  }, [user, depts])
  
  // 获取用户可访问的部门ID列表
  const getAccessibleDeptIds = useMemo(() => {
    return (dataScope = 'all', customDeptIds = []) => {
      if (!user) return []
      
      switch (dataScope) {
        case 'all':
          return depts.map(dept => dept.id)
        
        case 'dept':
          return [user.deptId]
        
        case 'dept_sub':
          return DataPermissionUtils.getSubDeptIds(user.deptId, depts, true)
        
        case 'self':
          return []
        
        case 'custom':
          return customDeptIds
        
        default:
          return []
      }
    }
  }, [user, depts])
  
  // 检查用户是否可以访问指定部门的数据
  const canAccessDeptData = useMemo(() => {
    return (deptId, dataScope = 'all', customDeptIds = []) => {
      const accessibleDeptIds = getAccessibleDeptIds(dataScope, customDeptIds)
      return accessibleDeptIds.includes(deptId)
    }
  }, [getAccessibleDeptIds])
  
  // 获取部门层级信息
  const getDeptLevel = useMemo(() => {
    return (deptId) => {
      const dept = depts.find(d => d.id === deptId)
      if (!dept) return 0
      
      let level = 1
      let parentId = dept.parentId
      
      while (parentId) {
        level++
        const parentDept = depts.find(d => d.id === parentId)
        parentId = parentDept?.parentId
      }
      
      return level
    }
  }, [depts])
  
  return {
    filterDataByPermission,
    getAccessibleDeptIds,
    canAccessDeptData,
    getDeptLevel,
  }
}