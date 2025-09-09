/**
 * Profile 页面模块入口
 */
export { default } from './Profile'

// 导出子组件
export { default as PersonalInfo } from './components/PersonalInfo'
export { default as PasswordChange } from './components/PasswordChange'
export { default as PersonalSettings } from './components/PersonalSettings'

// 导出Hook
export { useProfileManage } from './hooks/useProfileManage'