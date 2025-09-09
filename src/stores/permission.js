import { create } from 'zustand'
import { permissionAPI, menuAPI } from '@/api'

// 权限状态管理
export const usePermissionStore = create((set, get) => ({
  // 状态
  permissions: [],
  userMenus: [],
  allMenus: [],
  loading: false,
  
  // 获取用户权限
  fetchUserPermissions: async () => {
    set({ loading: true })
    try {
      // 模拟权限数据（实际项目中应该从后端获取）
      const mockPermissions = [
        { id: '1', code: 'system:manage', name: '系统管理' },
        { id: '2', code: 'user:view', name: '查看用户' },
        { id: '3', code: 'user:create', name: '创建用户' },
        { id: '4', code: 'user:edit', name: '编辑用户' },
        { id: '5', code: 'user:delete', name: '删除用户' },
        { id: '6', code: 'role:view', name: '查看角色' },
        { id: '7', code: 'role:create', name: '创建角色' },
        { id: '8', code: 'role:edit', name: '编辑角色' },
        { id: '9', code: 'role:delete', name: '删除角色' },
        { id: '10', code: 'permission:view', name: '查看权限' },
        { id: '11', code: 'permission:create', name: '创建权限' },
        { id: '12', code: 'permission:edit', name: '编辑权限' },
        { id: '13', code: 'permission:delete', name: '删除权限' },
        { id: '14', code: 'menu:view', name: '查看菜单' },
        { id: '15', code: 'menu:create', name: '创建菜单' },
        { id: '16', code: 'menu:edit', name: '编辑菜单' },
        { id: '17', code: 'menu:delete', name: '删除菜单' },
        { id: '18', code: 'dept:view', name: '查看部门' },
        { id: '19', code: 'dept:create', name: '创建部门' },
        { id: '20', code: 'dept:edit', name: '编辑部门' },
        { id: '21', code: 'dept:delete', name: '删除部门' },
        { id: '22', code: 'dict:view', name: '查看数据字典' },
        { id: '23', code: 'dict:create', name: '创建数据字典' },
        { id: '24', code: 'dict:edit', name: '编辑数据字典' },
        { id: '25', code: 'dict:delete', name: '删除数据字典' },
      ]
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set({ permissions: mockPermissions, loading: false })
      return mockPermissions
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  // 获取用户菜单
  fetchUserMenus: async () => {
    set({ loading: true })
    try {
      // 模拟菜单数据
      const mockUserMenus = [
        { id: '1', code: 'dashboard', name: '仪表板' },
        { id: '2', code: 'system', name: '系统管理' },
        { id: '3', code: 'user', name: '用户管理' },
        { id: '4', code: 'role', name: '角色管理' },
        { id: '5', code: 'menu', name: '菜单管理' },
        { id: '6', code: 'dept', name: '部门管理' },
        { id: '7', code: 'dict', name: '数据字典' },
      ]
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      set({ userMenus: mockUserMenus, loading: false })
      return mockUserMenus
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  // 获取所有菜单
  fetchAllMenus: async () => {
    try {
      // 模拟所有菜单数据
      const mockAllMenus = [
        { id: '1', code: 'dashboard', name: '仪表板', type: 'menu' },
        { id: '2', code: 'system', name: '系统管理', type: 'directory' },
        { id: '3', code: 'user', name: '用户管理', type: 'menu', parentId: '2' },
        { id: '4', code: 'role', name: '角色管理', type: 'menu', parentId: '2' },
        { id: '5', code: 'menu', name: '菜单管理', type: 'menu', parentId: '2' },
        { id: '6', code: 'dept', name: '部门管理', type: 'menu', parentId: '2' },
        { id: '7', code: 'dict', name: '数据字典', type: 'menu', parentId: '2' },
      ]
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 200))
      
      set({ allMenus: mockAllMenus })
      return mockAllMenus
    } catch (error) {
      throw error
    }
  },
  
  // 检查权限
  hasPermission: (permission) => {
    const { permissions } = get()
    if (!permission || !permissions.length) return false
    
    // 如果是数组，检查是否拥有任一权限
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.some(userPerm => userPerm.code === p))
    }
    
    // 检查单个权限
    return permissions.some(userPerm => userPerm.code === permission)
  },
  
  // 检查角色
  hasRole: (role) => {
    const { permissions } = get()
    if (!role || !permissions.length) return false
    
    // 从权限中提取角色信息（假设权限对象包含角色信息）
    const userRoles = permissions.map(p => p.role).filter(Boolean)
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r))
    }
    
    return userRoles.includes(role)
  },
  
  // 清除权限数据
  clearPermissions: () => {
    set({
      permissions: [],
      userMenus: [],
      allMenus: [],
    })
  },
  
  // 初始化权限数据
  initPermissions: async () => {
    try {
      await Promise.all([
        get().fetchUserPermissions(),
        get().fetchUserMenus(),
      ])
    } catch (error) {
      console.error('初始化权限数据失败:', error)
      // 即使初始化失败，也要设置默认值防止页面错误
      set({
        permissions: [],
        userMenus: [],
        allMenus: [],
        loading: false
      })
    }
  },
}))