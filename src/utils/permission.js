import { SYSTEM_ROLES, PERMISSION_CODES } from '@/constants/rbac'

/**
 * 权限工具类
 */
export class PermissionUtils {
  /**
   * 检查用户是否拥有指定权限
   * @param {Array} userPermissions 用户权限列表
   * @param {string|Array} requiredPermissions 需要的权限
   * @param {string} mode 检查模式: 'some' | 'every'
   * @returns {boolean}
   */
  static hasPermission(userPermissions = [], requiredPermissions, mode = 'some') {
    if (!requiredPermissions) return true
    if (!userPermissions.length) return false
    
    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions]
    
    const userPermissionCodes = userPermissions.map(p => p.code || p)
    
    if (mode === 'every') {
      return permissions.every(permission => userPermissionCodes.includes(permission))
    }
    
    return permissions.some(permission => userPermissionCodes.includes(permission))
  }
  
  /**
   * 检查用户是否拥有指定角色
   * @param {Array} userRoles 用户角色列表
   * @param {string|Array} requiredRoles 需要的角色
   * @param {string} mode 检查模式: 'some' | 'every'
   * @returns {boolean}
   */
  static hasRole(userRoles = [], requiredRoles, mode = 'some') {
    if (!requiredRoles) return true
    if (!userRoles.length) return false
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    const userRoleCodes = userRoles.map(r => r.code || r)
    
    if (mode === 'every') {
      return roles.every(role => userRoleCodes.includes(role))
    }
    
    return roles.some(role => userRoleCodes.includes(role))
  }
  
  /**
   * 检查是否为超级管理员
   * @param {Array} userRoles 用户角色列表
   * @returns {boolean}
   */
  static isSuperAdmin(userRoles = []) {
    return this.hasRole(userRoles, SYSTEM_ROLES.SUPER_ADMIN)
  }
  
  /**
   * 检查是否为管理员（包括超级管理员）
   * @param {Array} userRoles 用户角色列表
   * @returns {boolean}
   */
  static isAdmin(userRoles = []) {
    return this.hasRole(userRoles, [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ADMIN])
  }
  
  /**
   * 过滤有权限的菜单
   * @param {Array} menus 菜单列表
   * @param {Array} userPermissions 用户权限列表
   * @param {Array} userRoles 用户角色列表
   * @returns {Array}
   */
  static filterMenusByPermission(menus = [], userPermissions = [], userRoles = []) {
    // 超级管理员返回所有菜单
    if (this.isSuperAdmin(userRoles)) {
      return menus
    }
    
    return menus.filter(menu => {
      // 检查菜单权限
      if (menu.permission && !this.hasPermission(userPermissions, menu.permission)) {
        return false
      }
      
      // 检查菜单角色
      if (menu.roles && !this.hasRole(userRoles, menu.roles)) {
        return false
      }
      
      // 递归过滤子菜单
      if (menu.children && menu.children.length > 0) {
        menu.children = this.filterMenusByPermission(menu.children, userPermissions, userRoles)
      }
      
      return true
    })
  }
  
  /**
   * 构建权限树
   * @param {Array} permissions 权限列表
   * @param {string} parentId 父级ID
   * @returns {Array}
   */
  static buildPermissionTree(permissions = [], parentId = null) {
    const tree = []
    
    permissions.forEach(permission => {
      if (permission.parentId === parentId) {
        const children = this.buildPermissionTree(permissions, permission.id)
        if (children.length > 0) {
          permission.children = children
        }
        tree.push(permission)
      }
    })
    
    return tree
  }
  
  /**
   * 扁平化权限树
   * @param {Array} tree 权限树
   * @returns {Array}
   */
  static flattenPermissionTree(tree = []) {
    const result = []
    
    const traverse = (nodes) => {
      nodes.forEach(node => {
        result.push(node)
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    
    traverse(tree)
    return result
  }
  
  /**
   * 获取所有父级权限ID
   * @param {Array} permissions 权限列表
   * @param {string} permissionId 权限ID
   * @returns {Array}
   */
  static getParentPermissionIds(permissions = [], permissionId) {
    const parentIds = []
    
    const findParent = (id) => {
      const permission = permissions.find(p => p.id === id)
      if (permission && permission.parentId) {
        parentIds.unshift(permission.parentId)
        findParent(permission.parentId)
      }
    }
    
    findParent(permissionId)
    return parentIds
  }
}

/**
 * 数据权限工具
 */
export class DataPermissionUtils {
  /**
   * 根据数据范围过滤数据
   * @param {Array} data 数据列表
   * @param {string} dataScope 数据范围
   * @param {Object} user 当前用户
   * @param {Array} customDeptIds 自定义部门ID列表
   * @returns {Array}
   */
  static filterDataByScope(data = [], dataScope, user, customDeptIds = []) {
    switch (dataScope) {
      case 'all':
        return data
      
      case 'dept':
        return data.filter(item => item.deptId === user.deptId)
      
      case 'dept_sub':
        // 需要获取部门树来判断下级部门
        return data.filter(item => 
          item.deptId === user.deptId || 
          this.isSubDept(item.deptId, user.deptId)
        )
      
      case 'self':
        return data.filter(item => item.userId === user.id || item.createBy === user.id)
      
      case 'custom':
        return data.filter(item => customDeptIds.includes(item.deptId))
      
      default:
        return []
    }
  }
  
  /**
   * 判断是否为下级部门
   * @param {string} deptId 部门ID
   * @param {string} parentDeptId 父级部门ID
   * @param {Array} deptTree 部门树
   * @returns {boolean}
   */
  static isSubDept(deptId, parentDeptId, deptTree = []) {
    const findInTree = (nodes, targetId, currentParent) => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return currentParent === parentDeptId
        }
        if (node.children && node.children.length > 0) {
          const found = findInTree(node.children, targetId, node.id)
          if (found) return true
        }
      }
      return false
    }
    
    return findInTree(deptTree, deptId, null)
  }
  
  /**
   * 获取部门及其所有下级部门ID
   * @param {string} deptId 部门ID
   * @param {Array} depts 部门列表
   * @param {boolean} includeSelf 是否包含自身
   * @returns {Array}
   */
  static getSubDeptIds(deptId, depts = [], includeSelf = true) {
    const result = includeSelf ? [deptId] : []
    
    const findChildren = (parentId) => {
      depts.forEach(dept => {
        if (dept.parentId === parentId) {
          result.push(dept.id)
          findChildren(dept.id)
        }
      })
    }
    
    findChildren(deptId)
    return result
  }
  
  /**
   * 根据数据范围过滤数据（增强版）
   * @param {Array} data 数据列表
   * @param {string} dataScope 数据范围
   * @param {Object} user 当前用户
   * @param {Array} customDeptIds 自定义部门ID列表
   * @param {Array} depts 部门列表
   * @returns {Array}
   */
  static filterDataByScope(data = [], dataScope, user, customDeptIds = [], depts = []) {
    switch (dataScope) {
      case 'all':
        return data
      
      case 'dept':
        return data.filter(item => item.deptId === user.deptId)
      
      case 'dept_sub': {
        const subDeptIds = this.getSubDeptIds(user.deptId, depts, true)
        return data.filter(item => subDeptIds.includes(item.deptId))
      }
      
      case 'self':
        return data.filter(item => 
          item.userId === user.id || 
          item.createBy === user.id
        )
      
      case 'custom':
        return data.filter(item => customDeptIds.includes(item.deptId))
      
      default:
        return []
    }
  }
}