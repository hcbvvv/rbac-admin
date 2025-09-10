import { useState, useEffect, useMemo } from 'react'
import { message } from '@/utils/antdGlobal'

/**
 * 菜单管理业务逻辑Hook
 */
export const useMenuManage = () => {
  const [loading, setLoading] = useState(false)
  const [selectedMenuId, setSelectedMenuId] = useState(null)
  const [selectedMenuInfo, setSelectedMenuInfo] = useState(null)
  const [expandedKeys, setExpandedKeys] = useState(['1', '2'])
  
  // 模拟菜单数据（简化版本，包含基本的目录、菜单、按钮、接口结构）
  const [menus, setMenus] = useState([
    {
      id: '1',
      title: '仪表板',
      name: 'Dashboard',
      path: '/dashboard',
      type: 'menu',
      icon: 'DashboardOutlined',
      parentId: null,
      sort: 1,
      showInCollapsed: true,
      keepAlive: true,
      status: 'active',
      hidden: false,
      permissions: {
        list: [
          {
            id: 'resource_dashboard_view',
            type: 'resource',
            typeLabel: '资源权限',
            typeColor: '#1890ff',
            key: 'dashboard:view',
            title: '仪表板查看',
            description: '访问系统仪表板和统计信息',
            dataScope: null,
            customDeptIds: null
          }
        ]
      },
      createdAt: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      title: '系统管理',
      name: 'System',
      path: '/system',
      type: 'directory',
      icon: 'SettingOutlined',
      parentId: null,
      sort: 2,
      showInCollapsed: false,
      keepAlive: false,
      status: 'active',
      hidden: false,
      permissions: {
        list: [
          {
            id: 'resource_system_manage',
            type: 'resource',
            typeLabel: '资源权限',
            typeColor: '#1890ff',
            key: 'system:manage',
            title: '系统管理',
            description: '访问系统管理模块',
            dataScope: null,
            customDeptIds: null
          }
        ]
      },
      createdAt: '2024-01-01 11:00:00'
    },
    {
      id: '3',
      title: '用户管理',
      name: 'UserManage',
      path: '/system/user',
      type: 'menu',
      icon: 'UserOutlined',
      parentId: '2',
      sort: 1,
      showInCollapsed: false,
      keepAlive: true,
      status: 'active',
      hidden: false,
      permissions: {
        list: [
          {
            id: 'resource_user_view',
            type: 'resource',
            typeLabel: '资源权限',
            typeColor: '#1890ff',
            key: 'user:view',
            title: '用户查看',
            description: '查看用户列表和详细信息',
            dataScope: null,
            customDeptIds: null
          },
          {
            id: 'button_user_create',
            type: 'button',
            typeLabel: '按钮权限',
            typeColor: '#faad14',
            key: 'user:create',
            title: '新增用户',
            description: '创建新的用户账户',
            dataScope: null,
            customDeptIds: null
          }
        ]
      },
      createdAt: '2024-01-02 09:00:00'
    }
  ])
  
  // 构建菜单树结构
  const menuTree = useMemo(() => {
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.parentId === parentId)
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }))
    }
    return buildTree(menus)
  }, [menus])
  
  // 选择菜单节点
  const handleSelectMenu = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      const menuId = selectedKeys[0]
      const menuInfo = menus.find(m => m.id === menuId)
      setSelectedMenuId(menuId)
      setSelectedMenuInfo(menuInfo)
    } else {
      setSelectedMenuId(null)
      setSelectedMenuInfo(null)
    }
  }
  
  // 删除菜单
  const handleDelete = async (menu) => {
    try {
      setLoading(true)
      
      // 检查是否有子菜单
      const hasChildren = menus.some(m => m.parentId === menu.id)
      if (hasChildren) {
        message.error('该菜单下还有子菜单，无法删除')
        return false
      }
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMenus(menus.filter(m => m.id !== menu.id))
      message.success('菜单删除成功')
      
      // 如果删除的是当前选中的菜单，清空选中状态
      if (selectedMenuId === menu.id) {
        setSelectedMenuId(null)
        setSelectedMenuInfo(null)
      }
      
      return true
    } catch (error) {
      message.error('删除失败，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 保存菜单
  const handleSave = async (values, editingMenu) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingMenu) {
        // 编辑菜单
        setMenus(menus.map(menu => 
          menu.id === editingMenu.id 
            ? { ...menu, ...values }
            : menu
        ))
        message.success('菜单更新成功')
        
        // 更新选中的菜单信息
        if (selectedMenuId === editingMenu.id) {
          setSelectedMenuInfo({ ...editingMenu, ...values })
        }
      } else {
        // 新增菜单
        const newMenu = {
          id: Date.now().toString(),
          ...values,
          permissions: { list: [] },
          createdAt: new Date().toLocaleString(),
        }
        setMenus([...menus, newMenu])
        message.success('菜单创建成功')
      }
      
      return true
    } catch (error) {
      message.error('操作失败，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 保存权限配置
  const handleSavePermission = async (menuId, permission) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新菜单的权限配置
      setMenus(menus.map(menu => {
        if (menu.id === menuId) {
          const existingIndex = menu.permissions.list.findIndex(p => p.id === permission.id)
          const updatedPermissions = [...menu.permissions.list]
          
          if (existingIndex >= 0) {
            // 更新现有权限
            updatedPermissions[existingIndex] = permission
          } else {
            // 添加新权限
            updatedPermissions.push({
              ...permission,
              id: permission.id || `perm_${Date.now()}`
            })
          }
          
          return { ...menu, permissions: { list: updatedPermissions } }
        }
        return menu
      }))
      
      // 更新选中菜单信息
      if (selectedMenuId === menuId) {
        const updatedMenu = menus.find(m => m.id === menuId)
        if (updatedMenu) {
          setSelectedMenuInfo(updatedMenu)
        }
      }
      
      message.success('权限配置保存成功')
      return true
    } catch (error) {
      message.error('保存失败，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 删除权限
  const handleDeletePermission = async (menuId, permissionId) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 从菜单权限列表中删除指定权限
      setMenus(menus.map(menu => {
        if (menu.id === menuId) {
          return {
            ...menu,
            permissions: {
              list: menu.permissions.list.filter(p => p.id !== permissionId)
            }
          }
        }
        return menu
      }))
      
      // 更新选中菜单信息
      if (selectedMenuId === menuId) {
        const updatedMenu = menus.find(m => m.id === menuId)
        if (updatedMenu) {
          setSelectedMenuInfo(updatedMenu)
        }
      }
      
      message.success('权限删除成功')
      return true
    } catch (error) {
      message.error('删除失败，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 刷新数据
  const handleRefresh = () => {
    message.info('刷新数据')
    // 这里可以重新加载菜单数据
  }
  
  return {
    // 数据
    menus,
    menuTree,
    selectedMenuId,
    selectedMenuInfo,
    expandedKeys,
    loading,
    
    // 方法
    setExpandedKeys,
    handleSelectMenu,
    handleDelete,
    handleSave,
    handleSavePermission,
    handleDeletePermission,
    handleRefresh,
  }
}