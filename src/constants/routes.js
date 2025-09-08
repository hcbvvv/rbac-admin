// 路由路径常量
export const ROUTES = {
  // 公共路由
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // 主页
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // 系统管理
  SYSTEM: '/system',
  USER_MANAGE: '/system/user',
  ROLE_MANAGE: '/system/role',
  DEPT_MANAGE: '/system/dept',
  MENU_MANAGE: '/system/menu',
  ERROR_DEMO: '/system/error-demo',
  
  // 监控管理
  MONITOR: '/monitor',
  ONLINE_USER: '/monitor/online',
  LOGIN_LOG: '/monitor/login-log',
  OPERATION_LOG: '/monitor/operation-log',
  
  // 个人中心
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // 错误页面
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
}

// 不需要权限验证的路由
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.NOT_FOUND,
  ROUTES.FORBIDDEN,
  ROUTES.SERVER_ERROR,
]

// 默认重定向路由
export const DEFAULT_ROUTE = ROUTES.DASHBOARD