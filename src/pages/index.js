/**
 * Pages 目录统一导出
 * 管理所有页面模块的导出，提供清晰的模块结构
 */

// 主要页面
export { default as Dashboard } from './dashboard'
export { default as Login } from './login'
export { default as Profile } from './Profile'

// 系统管理页面
export { default as UserManage } from './system/UserManage'
export { default as RoleManage } from './system/RoleManage'
export { default as DeptManage } from './system/DeptManage'
export { default as MenuManage } from './system/MenuManage'
export { default as DictManage } from './system/dict-manage'
export { default as ErrorDemo } from './system/ErrorDemo'
export { default as ErrorDemoTest } from './system/ErrorDemoTest'

// 错误页面
export { default as NotFound } from './errors/NotFound'
export { default as Forbidden } from './errors/Forbidden'
export { default as ServerError } from './errors/ServerError'