import { useCallback } from 'react'
import { useMenuStore, usePermissionStore } from '@/stores'

/**
 * 菜单管理自定义钩子
 * 提供便捷的菜单操作方法
 */
export const useMenu = () => {
  const { permissions } = usePermissionStore()
  const {
    menuData,
    menuTree,
    menuMap,
    selectedKeys,
    openKeys,
    breadcrumbs,
    loading,
    buildMenuTree,
    buildMenuMap,
    transformMenuData,
    filterMenuByPermission,
    getParentKeys,
    generateBreadcrumbs,
    setSelectedKeys,
    setOpenKeys,
    updateMenuState,
    fetchMenuData,
    refreshMenuData,
    getMenuByKey,
    getMenuByPath,
    getUserAccessibleMenus,
    initMenuData,
    clearMenuData
  } = useMenuStore()

  /**
   * 获取当前用户可访问的菜单
   */
  const getAccessibleMenus = useCallback(() => {
    return getUserAccessibleMenus(permissions)
  }, [getUserAccessibleMenus, permissions])

  /**
   * 检查菜单权限
   */
  const checkMenuPermission = useCallback((menuKey) => {
    const menu = getMenuByKey(menuKey)
    if (!menu || !menu.permission) {
      return true // 没有权限要求的菜单默认可访问
    }
    
    return permissions.some(p => p.code === menu.permission)
  }, [getMenuByKey, permissions])

  /**
   * 获取菜单路径链
   */
  const getMenuPathChain = useCallback((menuKey) => {
    const menu = getMenuByKey(menuKey)
    if (!menu) return []
    
    const chain = []
    let currentMenu = menu
    
    while (currentMenu) {
      chain.unshift(currentMenu)
      if (currentMenu.parentId) {
        currentMenu = Object.values(menuMap).find(m => m.id === currentMenu.parentId)
      } else {
        break
      }
    }
    
    return chain
  }, [getMenuByKey, menuMap])

  /**
   * 获取菜单的所有子菜单
   */
  const getChildMenus = useCallback((menuKey, deep = false) => {
    const menu = getMenuByKey(menuKey)
    if (!menu) return []
    
    const getChildren = (parentId, level = 1) => {
      const children = Object.values(menuMap).filter(m => m.parentId === parentId)
      
      if (!deep || level >= 10) { // 防止无限递归
        return children
      }
      
      return children.reduce((acc, child) => {
        acc.push(child)
        acc.push(...getChildren(child.id, level + 1))
        return acc
      }, [])
    }
    
    return getChildren(menu.id)
  }, [getMenuByKey, menuMap])

  /**
   * 搜索菜单
   */
  const searchMenus = useCallback((keyword, searchInTitle = true, searchInPath = false) => {
    if (!keyword) return []
    
    const lowerKeyword = keyword.toLowerCase()
    
    return Object.values(menuMap).filter(menu => {
      if (searchInTitle && menu.title.toLowerCase().includes(lowerKeyword)) {
        return true
      }
      if (searchInPath && menu.path.toLowerCase().includes(lowerKeyword)) {
        return true
      }
      return false
    })
  }, [menuMap])

  /**
   * 获取菜单统计信息
   */
  const getMenuStats = useCallback(() => {
    const stats = {
      total: menuData.length,
      accessible: getAccessibleMenus().length,
      directories: menuData.filter(m => !m.component && m.children?.length > 0).length,
      pages: menuData.filter(m => m.component).length,
      permissions: menuData.filter(m => m.permission).length,
    }
    return stats
  }, [menuData, getAccessibleMenus])

  /**
   * 导航到指定菜单
   */
  const navigateToMenu = useCallback((menuKey, navigate) => {
    const menu = getMenuByKey(menuKey)
    if (menu && menu.path && checkMenuPermission(menuKey)) {
      navigate(menu.path)
      updateMenuState(menu.path)
    }
  }, [getMenuByKey, checkMenuPermission, updateMenuState])

  /**
   * 切换菜单展开状态
   */
  const toggleMenuOpen = useCallback((menuKey) => {
    const currentOpenKeys = [...openKeys]
    const index = currentOpenKeys.indexOf(menuKey)
    
    if (index > -1) {
      currentOpenKeys.splice(index, 1)
    } else {
      currentOpenKeys.push(menuKey)
    }
    
    setOpenKeys(currentOpenKeys)
  }, [openKeys, setOpenKeys])

  /**
   * 展开菜单到指定项
   */
  const expandToMenu = useCallback((menuKey) => {
    const parentKeys = getParentKeys(menuKey)
    setOpenKeys([...new Set([...openKeys, ...parentKeys])])
  }, [getParentKeys, openKeys, setOpenKeys])

  /**
   * 折叠所有菜单
   */
  const collapseAllMenus = useCallback(() => {
    setOpenKeys([])
  }, [setOpenKeys])

  /**
   * 展开所有菜单
   */
  const expandAllMenus = useCallback(() => {
    const allParentKeys = []
    const collectParentKeys = (menus) => {
      menus.forEach(menu => {
        if (menu.children && menu.children.length > 0) {
          allParentKeys.push(menu.key)
          collectParentKeys(menu.children)
        }
      })
    }
    
    collectParentKeys(getAccessibleMenus())
    setOpenKeys(allParentKeys)
  }, [getAccessibleMenus, setOpenKeys])

  return {
    // 数据
    menuData,
    menuTree,
    menuMap,
    selectedKeys,
    openKeys,
    breadcrumbs,
    loading,
    
    // 基础方法
    buildMenuTree,
    buildMenuMap,
    transformMenuData,
    filterMenuByPermission,
    getParentKeys,
    generateBreadcrumbs,
    setSelectedKeys,
    setOpenKeys,
    updateMenuState,
    fetchMenuData,
    refreshMenuData,
    getMenuByKey,
    getMenuByPath,
    getUserAccessibleMenus,
    initMenuData,
    clearMenuData,
    
    // 扩展方法
    getAccessibleMenus,
    checkMenuPermission,
    getMenuPathChain,
    getChildMenus,
    searchMenus,
    getMenuStats,
    navigateToMenu,
    toggleMenuOpen,
    expandToMenu,
    collapseAllMenus,
    expandAllMenus,
  }
}

export default useMenu