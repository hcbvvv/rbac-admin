import { useState, useEffect } from 'react'

/**
 * 权限管理钩子
 * 提供权限检查功能
 */
export const usePermission = () => {
  const [permissions, setPermissions] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false) // 添加初始化状态
  
  useEffect(() => {
    // 模拟从localStorage或API获取用户权限
    const initPermissions = async () => {
      try {
        // 模拟异步加载
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const mockUserInfo = {
          id: '1',
          username: 'admin',
          roles: ['admin'],
          permissions: [
            'menu:view', 'menu:create', 'menu:edit', 'menu:delete',
            'role:view', 'role:create', 'role:edit', 'role:delete',
            'user:view', 'user:create', 'user:edit', 'user:delete',
            'dept:view', 'dept:create', 'dept:edit', 'dept:delete',
            'system:manage'
          ]
        }
        
        setUserInfo(mockUserInfo)
        setPermissions(mockUserInfo.permissions)
        setIsInitialized(true) // 设置初始化完成
      } catch (error) {
        console.error('初始化权限失败:', error)
        setIsInitialized(true) // 即使失败也要设置为已初始化
      }
    }
    
    initPermissions()
  }, [])
  
  /**
   * 检查是否有指定权限
   * @param {string} permission 权限代码
   * @returns {boolean} 是否有权限
   */
  const hasPermission = (permission) => {
    // 如果没有权限要求，直接返回true
    if (!permission) return true
    
    // 如果权限还没有初始化完成，返回true避免403错误
    if (!isInitialized) return true
    
    // 管理员拥有所有权限
    if (userInfo?.roles?.includes('admin')) return true
    
    return permissions.includes(permission)
  }
  
  /**
   * 检查是否有任一权限
   * @param {string[]} permissionList 权限代码列表
   * @returns {boolean} 是否有权限
   */
  const hasAnyPermission = (permissionList) => {
    if (!permissionList || permissionList.length === 0) return true
    if (!isInitialized) return true // 权限未初始化时返回true
    if (userInfo?.roles?.includes('admin')) return true
    return permissionList.some(permission => permissions.includes(permission))
  }
  
  /**
   * 检查是否有所有权限
   * @param {string[]} permissionList 权限代码列表
   * @returns {boolean} 是否有权限
   */
  const hasAllPermissions = (permissionList) => {
    if (!permissionList || permissionList.length === 0) return true
    if (!isInitialized) return true // 权限未初始化时返回true
    if (userInfo?.roles?.includes('admin')) return true
    return permissionList.every(permission => permissions.includes(permission))
  }
  
  /**
   * 检查是否有角色
   * @param {string} role 角色代码
   * @returns {boolean} 是否有角色
   */
  const hasRole = (role) => {
    if (!role) return true
    return userInfo?.roles?.includes(role)
  }
    
  // 计算用户角色信息
  const userRoles = userInfo?.roles?.map(role => {
    if (typeof role === 'string') {
      return { id: role, name: role === 'admin' ? '管理员' : role }
    }
    return role
  }) || []
    
  const isSuperAdmin = userInfo?.roles?.includes('super_admin') || userInfo?.roles?.includes('admin')
  const isAdmin = userInfo?.roles?.includes('admin')
  
  return {
    userInfo,
    permissions,
    userRoles,
    isSuperAdmin,
    isAdmin,
    isInitialized, // 添加初始化状态
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole
  }
}

/**
 * 路由权限检查钩子
 * 用于检查路由访问权限
 */
export const useRoutePermission = () => {
  const { hasPermission, hasRole, isInitialized } = usePermission()
  
  /**
   * 检查路由权限
   * @param {Object} route 路由对象
   * @returns {boolean} 是否有权限访问
   */
  const checkRoutePermission = (route) => {
    // 如果权限还没有初始化完成，允许访问避免403错误
    if (!isInitialized) return true
    
    // 如果路由没有权限要求，直接允许访问
    if (!route?.meta?.permission && !route?.meta?.roles) {
      return true
    }
    
    // 检查权限
    if (route.meta.permission && !hasPermission(route.meta.permission)) {
      return false
    }
    
    // 检查角色
    if (route.meta.roles && !route.meta.roles.some(role => hasRole(role))) {
      return false
    }
    
    return true
  }
  
  return {
    checkRoutePermission,
    isInitialized
  }
}