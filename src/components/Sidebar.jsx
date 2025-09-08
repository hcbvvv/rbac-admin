import React, { useMemo, useEffect } from 'react'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore, useMenuStore, usePermissionStore } from '@/stores'
import MenuIcon from '@/components/MenuIcon'

/**
 * 侧边栏菜单组件
 */
const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { collapsed } = useAppStore()
  const { permissions } = usePermissionStore()
  const {
    menuTree,
    selectedKeys,
    openKeys,
    transformMenuData,
    setSelectedKeys,
    setOpenKeys,
    updateMenuState,
    initMenuData,
    getUserAccessibleMenus
  } = useMenuStore()
  
  // 初始化菜单数据
  useEffect(() => {
    initMenuData()
  }, [])
  
  // 根据权限过滤菜单
  const filteredMenuTree = useMemo(() => {
    return getUserAccessibleMenus(permissions)
  }, [permissions, menuTree])
  
  // 转换菜单数据
  const menuItems = useMemo(() => {
    return transformMenuData(filteredMenuTree).map(menu => ({
      ...menu,
      icon: menu.icon ? <MenuIcon icon={menu.icon} /> : null,
      children: menu.children ? menu.children.map(child => ({
        ...child,
        icon: child.icon ? <MenuIcon icon={child.icon} /> : null,
      })) : undefined,
    }))
  }, [filteredMenuTree])
  
  // 根据当前路径设置选中和展开的菜单
  useEffect(() => {
    updateMenuState(location.pathname)
  }, [location.pathname, updateMenuState])
  
  // 菜单点击处理
  const handleMenuClick = ({ key, item }) => {
    const menuItem = item.props
    if (menuItem.path) {
      navigate(menuItem.path)
    }
  }
  
  // 子菜单展开/收起处理
  const handleOpenChange = (keys) => {
    // 在折叠状态下，不允许展开子菜单
    if (collapsed) {
      setOpenKeys([])
      return
    }
    
    setOpenKeys(keys)
  }
  
  return (
    <div className="sidebar">
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={selectedKeys}
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        items={menuItems}
        inlineCollapsed={collapsed}
        style={{
          height: '100%',
          borderRight: 0,
        }}
      />
    </div>
  )
}

export default Sidebar