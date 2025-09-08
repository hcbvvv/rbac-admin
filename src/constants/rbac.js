// 部门状态
export const DEPT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
}

export const DEPT_STATUS_OPTIONS = [
  { label: '正常', value: DEPT_STATUS.ACTIVE, color: 'green' },
  { label: '禁用', value: DEPT_STATUS.INACTIVE, color: 'red' },
  { label: '待启用', value: DEPT_STATUS.PENDING, color: 'blue' },
]

// 部门类型
export const DEPT_TYPE = {
  COMPANY: 'company',    // 公司
  DEPARTMENT: 'department', // 部门
  TEAM: 'team',         // 小组
}

export const DEPT_TYPE_OPTIONS = [
  { label: '公司', value: DEPT_TYPE.COMPANY },
  { label: '部门', value: DEPT_TYPE.DEPARTMENT },
  { label: '小组', value: DEPT_TYPE.TEAM },
]

// 用户状态
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  LOCKED: 'locked',
  PENDING: 'pending',
}

export const USER_STATUS_OPTIONS = [
  { label: '正常', value: USER_STATUS.ACTIVE, color: 'green' },
  { label: '禁用', value: USER_STATUS.INACTIVE, color: 'red' },
  { label: '锁定', value: USER_STATUS.LOCKED, color: 'orange' },
  { label: '待激活', value: USER_STATUS.PENDING, color: 'blue' },
]

// 角色类型
export const ROLE_TYPE = {
  SYSTEM: 'system',    // 系统角色
  CUSTOM: 'custom',    // 自定义角色
  TENANT: 'tenant',    // 租户角色
}

export const ROLE_TYPE_OPTIONS = [
  { label: '系统角色', value: ROLE_TYPE.SYSTEM },
  { label: '自定义角色', value: ROLE_TYPE.CUSTOM },
  { label: '租户角色', value: ROLE_TYPE.TENANT },
]

// 权限类型
export const PERMISSION_TYPE = {
  MENU: 'menu',        // 菜单权限
  BUTTON: 'button',    // 按钮权限
  API: 'api',          // 接口权限
  DATA: 'data',        // 数据权限
}

export const PERMISSION_TYPE_OPTIONS = [
  { label: '菜单权限', value: PERMISSION_TYPE.MENU },
  { label: '按钮权限', value: PERMISSION_TYPE.BUTTON },
  { label: '接口权限', value: PERMISSION_TYPE.API },
  { label: '数据权限', value: PERMISSION_TYPE.DATA },
]

// 菜单类型
export const MENU_TYPE = {
  DIRECTORY: 'directory', // 目录
  MENU: 'menu',          // 菜单
  BUTTON: 'button',      // 按钮
}

export const MENU_TYPE_OPTIONS = [
  { label: '目录', value: MENU_TYPE.DIRECTORY },
  { label: '菜单', value: MENU_TYPE.MENU },
  { label: '按钮', value: MENU_TYPE.BUTTON },
]

// 数据范围
export const DATA_SCOPE = {
  ALL: 'all',              // 全部数据
  DEPT: 'dept',            // 部门数据
  DEPT_AND_SUB: 'dept_sub', // 部门及下级数据
  SELF: 'self',            // 仅本人数据
  CUSTOM: 'custom',        // 自定义数据
}

export const DATA_SCOPE_OPTIONS = [
  { label: '全部数据', value: DATA_SCOPE.ALL, description: '可以访问系统中的所有数据，不受部门限制' },
  { label: '部门数据', value: DATA_SCOPE.DEPT, description: '只能访问本部门的数据' },
  { label: '部门及下级数据', value: DATA_SCOPE.DEPT_AND_SUB, description: '可以访问本部门及其下级部门的数据' },
  { label: '仅本人数据', value: DATA_SCOPE.SELF, description: '只能访问自己创建或负责的数据' },
  { label: '自定义数据', value: DATA_SCOPE.CUSTOM, description: '可以访问指定部门的数据' },
]

// 预定义的系统权限代码
export const PERMISSION_CODES = {
  // 系统管理
  SYSTEM_MANAGE: 'system:manage',
  
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_IMPORT: 'user:import',
  USER_EXPORT: 'user:export',
  USER_RESET_PWD: 'user:reset_pwd',
  
  // 角色管理
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_EDIT: 'role:edit',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN: 'role:assign',
  
  // 菜单管理
  MENU_VIEW: 'menu:view',
  MENU_CREATE: 'menu:create',
  MENU_EDIT: 'menu:edit',
  MENU_DELETE: 'menu:delete',
  
  // 部门管理
  DEPT_VIEW: 'dept:view',
  DEPT_CREATE: 'dept:create',
  DEPT_EDIT: 'dept:edit',
  DEPT_DELETE: 'dept:delete',
  DEPT_ASSIGN: 'dept:assign',
}

// 预定义的系统角色
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
}

export const SYSTEM_ROLE_OPTIONS = [
  { label: '超级管理员', value: SYSTEM_ROLES.SUPER_ADMIN },
  { label: '管理员', value: SYSTEM_ROLES.ADMIN },
  { label: '普通用户', value: SYSTEM_ROLES.USER },
  { label: '访客', value: SYSTEM_ROLES.GUEST },
]

/**
 * RBAC权限管理相关常量定义
 */

// 菜单类型常量
export const MENU_TYPES = {
  DIRECTORY: 'directory',  // 目录
  MENU: 'menu',           // 菜单
  BUTTON: 'button',       // 按钮
  API: 'api'              // 接口
}

// 菜单状态常量
export const MENU_STATUS = {
  ACTIVE: 'active',       // 启用
  INACTIVE: 'inactive'    // 禁用
}

// 角色类型常量
export const ROLE_TYPES = {
  SYSTEM: 'system',       // 系统角色
  CUSTOM: 'custom'        // 自定义角色
}

// 权限类型常量
export const PERMISSION_TYPES = {
  RESOURCE: 'resource',   // 资源权限
  BUTTON: 'button',      // 按钮权限
  API: 'api',            // 接口权限
  DATA: 'data'           // 数据权限
}
