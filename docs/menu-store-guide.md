# 菜单Store使用说明

## 概述

菜单Store (`useMenuStore`) 是一个基于Zustand的状态管理解决方案，专门用于管理系统的菜单数据、面包屑导航、菜单状态等功能。

## 主要功能

### 1. 菜单数据管理
- 原始菜单数据存储
- 菜单树构建
- 菜单映射关系维护
- 权限过滤

### 2. 菜单状态管理
- 当前选中菜单
- 展开的菜单项
- 面包屑导航数据

### 3. 菜单操作方法
- 菜单初始化
- 动态菜单加载
- 权限验证
- 导航管理

## Store结构

```javascript
{
  // 数据
  menuData: [],        // 原始菜单数据
  menuTree: [],        // 菜单树结构
  menuMap: {},         // 菜单映射表
  selectedKeys: [],    // 当前选中菜单
  openKeys: [],        // 展开的菜单
  breadcrumbs: [],     // 面包屑数据
  loading: false,      // 加载状态

  // 方法
  buildMenuTree,       // 构建菜单树
  buildMenuMap,        // 构建菜单映射
  transformMenuData,   // 转换菜单数据
  filterMenuByPermission, // 权限过滤
  generateBreadcrumbs, // 生成面包屑
  updateMenuState,     // 更新菜单状态
  // ... 更多方法
}
```

## 使用方式

### 1. 在组件中直接使用Store

```jsx
import { useMenuStore } from '@/stores'

const MyComponent = () => {
  const {
    menuTree,
    selectedKeys,
    openKeys,
    updateMenuState
  } = useMenuStore()
  
  // 组件逻辑
}
```

### 2. 使用自定义Hook

```jsx
import useMenu from '@/hooks/useMenu'

const MyComponent = () => {
  const {
    menuData,
    getAccessibleMenus,
    checkMenuPermission,
    navigateToMenu
  } = useMenu()
  
  // 组件逻辑
}
```

## 实际应用示例

### 1. 侧边栏菜单组件

```jsx
import React, { useMemo, useEffect } from 'react'
import { Menu } from 'antd'
import { useMenuStore, usePermissionStore } from '@/stores'

const Sidebar = () => {
  const { permissions } = usePermissionStore()
  const {
    selectedKeys,
    openKeys,
    updateMenuState,
    initMenuData,
    getUserAccessibleMenus,
    transformMenuData
  } = useMenuStore()
  
  // 初始化菜单数据
  useEffect(() => {
    initMenuData()
  }, [])
  
  // 根据权限过滤菜单
  const accessibleMenus = useMemo(() => {
    return getUserAccessibleMenus(permissions)
  }, [permissions])
  
  // 转换为Ant Design菜单格式
  const menuItems = transformMenuData(accessibleMenus)
  
  // 菜单点击处理
  const handleMenuClick = ({ key }) => {
    navigate(key)
    updateMenuState(key)
  }
  
  return (
    <Menu
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onClick={handleMenuClick}
      items={menuItems}
    />
  )
}
```

### 2. 面包屑组件

```jsx
import React, { useEffect, useMemo } from 'react'
import { Breadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { useMenuStore } from '@/stores'

const AppBreadcrumb = () => {
  const location = useLocation()
  const { breadcrumbs, generateBreadcrumbs } = useMenuStore()
  
  // 根据当前路径生成面包屑
  useEffect(() => {
    generateBreadcrumbs(location.pathname)
  }, [location.pathname])
  
  // 转换为Ant Design格式
  const breadcrumbItems = useMemo(() => {
    return breadcrumbs.map((item, index) => ({
      key: item.path,
      title: index === breadcrumbs.length - 1 
        ? item.title 
        : <Link to={item.path}>{item.title}</Link>
    }))
  }, [breadcrumbs])
  
  return <Breadcrumb items={breadcrumbItems} />
}
```

### 3. 菜单管理页面

```jsx
import React, { useEffect } from 'react'
import { Table, Button } from 'antd'
import useMenu from '@/hooks/useMenu'

const MenuManage = () => {
  const {
    menuData,
    loading,
    refreshMenuData,
    getMenuStats
  } = useMenu()
  
  // 初始化加载
  useEffect(() => {
    refreshMenuData()
  }, [])
  
  // 获取统计信息
  const stats = getMenuStats()
  
  return (
    <div>
      <div>
        总菜单数: {stats.total}, 
        可访问: {stats.accessible}
      </div>
      
      <Button onClick={refreshMenuData} loading={loading}>
        刷新菜单
      </Button>
      
      <Table 
        dataSource={menuData}
        loading={loading}
        // ... 其他配置
      />
    </div>
  )
}
```

## 自定义Hook方法

### useMenu Hook提供的扩展方法

```javascript
// 权限检查
const hasAccess = checkMenuPermission('/system/user')

// 获取菜单路径链
const pathChain = getMenuPathChain('/system/user')
// 返回: [系统管理菜单对象, 用户管理菜单对象]

// 获取子菜单
const childMenus = getChildMenus('/system')

// 搜索菜单
const searchResults = searchMenus('用户')

// 导航到菜单
navigateToMenu('/system/user', navigate)

// 菜单展开控制
expandToMenu('/system/user')     // 展开到指定菜单
collapseAllMenus()              // 折叠所有菜单
expandAllMenus()                // 展开所有菜单
```

## 数据结构

### 菜单数据结构
```javascript
{
  id: '1',                    // 菜单ID
  key: '/dashboard',          // 菜单Key（通常与path相同）
  path: '/dashboard',         // 路由路径
  title: '仪表板',            // 菜单标题
  icon: 'DashboardOutlined',  // 图标名称
  parentId: null,             // 父菜单ID
  sort: 1,                    // 排序
  permission: 'dashboard:view', // 权限代码
  component: 'Dashboard',     // 组件名称
  children: []                // 子菜单（构建树时生成）
}
```

### 面包屑数据结构
```javascript
{
  path: '/system/user',       // 路径
  title: '用户管理',          // 标题
  icon: 'UserOutlined'        // 图标
}
```

## 最佳实践

### 1. 权限集成
始终配合权限Store使用，确保菜单按权限正确显示：

```jsx
const { permissions } = usePermissionStore()
const accessibleMenus = getUserAccessibleMenus(permissions)
```

### 2. 性能优化
使用useMemo优化菜单渲染：

```jsx
const menuItems = useMemo(() => {
  return transformMenuData(accessibleMenus)
}, [accessibleMenus])
```

### 3. 路由同步
确保菜单状态与路由状态同步：

```jsx
useEffect(() => {
  updateMenuState(location.pathname)
}, [location.pathname])
```

### 4. 错误处理
处理菜单加载和操作中的错误：

```jsx
const loadMenu = async () => {
  try {
    await refreshMenuData()
  } catch (error) {
    message.error('菜单加载失败')
  }
}
```

## 注意事项

1. **持久化**: Store使用persist中间件，只持久化必要的状态数据
2. **权限验证**: 菜单显示前必须进行权限验证
3. **内存管理**: 大量菜单数据时注意内存使用
4. **异步操作**: 菜单数据的加载和更新都是异步的
5. **状态同步**: 确保菜单状态与路由状态保持同步

## 扩展说明

Store设计为可扩展的，可以根据项目需求添加更多功能：

- 菜单收藏功能
- 最近访问菜单
- 菜单使用统计
- 自定义菜单布局
- 多语言菜单支持