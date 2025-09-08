/**
 * API 统一导出文件
 * 将各个模块的API统一导出，方便使用
 */

// 导出各个模块的API
export { authAPI } from './auth'
export { userAPI } from './user'
export { roleAPI } from './role'
export { permissionAPI } from './permission'
export { menuAPI } from './menu'
export { deptAPI } from './dept'
export { systemAPI } from './system'

// 导出请求工具
export { default as request } from '@/utils/request'

// 创建一个包含所有API的对象，方便整体导入
export const api = {
  auth: () => import('./auth').then(module => module.authAPI),
  user: () => import('./user').then(module => module.userAPI),
  role: () => import('./role').then(module => module.roleAPI),
  permission: () => import('./permission').then(module => module.permissionAPI),
  menu: () => import('./menu').then(module => module.menuAPI),
  dept: () => import('./dept').then(module => module.deptAPI),
  system: () => import('./system').then(module => module.systemAPI),
}