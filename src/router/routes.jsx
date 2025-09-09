import React, { lazy } from 'react'
import { ROUTES, PERMISSION_CODES } from '@/constants'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Login = lazy(() => import('@/pages/Login'))
const Profile = lazy(() => import('@/pages/Profile'))

// 系统管理页面
const UserManage = lazy(() => import('@/pages/system/UserManage'))
const RoleManage = lazy(() => import('@/pages/system/RoleManage'))
const DeptManage = lazy(() => import('@/pages/system/DeptManage'))
const MenuManage = lazy(() => import('@/pages/system/MenuManage'))
const DictManage = lazy(() => import('@/pages/system/DictManage'))
const ErrorDemo = lazy(() => import('@/pages/system/ErrorDemo'))
const ErrorDemoTest = lazy(() => import('@/pages/system/ErrorDemoTest'))

// 错误页面
const NotFound = lazy(() => import('@/pages/errors/NotFound'))
const Forbidden = lazy(() => import('@/pages/errors/Forbidden'))
const ServerError = lazy(() => import('@/pages/errors/ServerError'))

/**
 * 路由配置
 */
export const routes = [
  // 认证相关路由
  {
    path: ROUTES.LOGIN,
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  
  // 主应用路由
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 重定向到仪表板
      {
        index: true,
        element: <Dashboard />,
      },
      
      // 仪表板
      {
        path: ROUTES.DASHBOARD,
        element: <Dashboard />,
        meta: {
          title: '仪表板',
          icon: 'DashboardOutlined',
          keepAlive: true,
        },
      },
      
      // 个人中心
      {
        path: ROUTES.PROFILE,
        element: <Profile />,
        meta: {
          title: '个人中心',
          icon: 'UserOutlined',
          keepAlive: true,
        },
      },
      
      // 个人设置（指向同一个组件）
      {
        path: ROUTES.SETTINGS,
        element: <Profile />,
        meta: {
          title: '个人设置',
          icon: 'SettingOutlined',
          keepAlive: true,
        },
      },
      
      // 系统管理
      {
        path: ROUTES.SYSTEM,
        meta: {
          title: '系统管理',
          icon: 'SettingOutlined',
          permission: PERMISSION_CODES.SYSTEM_MANAGE,
        },
        children: [
          {
            path: ROUTES.USER_MANAGE,
            element: <UserManage />,
            meta: {
              title: '用户管理',
              icon: 'UserOutlined',
              permission: PERMISSION_CODES.USER_VIEW,
              keepAlive: true,
            },
          },
          {
            path: ROUTES.ROLE_MANAGE,
            element: <RoleManage />,
            meta: {
              title: '角色管理',
              icon: 'TeamOutlined',
              permission: PERMISSION_CODES.ROLE_VIEW,
              keepAlive: true,
            },
          },
          {
            path: ROUTES.DEPT_MANAGE,
            element: <DeptManage />,
            meta: {
              title: '部门管理',
              icon: 'ApartmentOutlined',
              permission: PERMISSION_CODES.DEPT_VIEW,
              keepAlive: true,
            },
          },
          {
            path: ROUTES.MENU_MANAGE,
            element: <MenuManage />,
            meta: {
              title: '菜单管理',
              icon: 'MenuOutlined',
              permission: PERMISSION_CODES.MENU_VIEW,
              keepAlive: true,
            },
          },
          {
            path: ROUTES.DICT_MANAGE,
            element: <DictManage />,
            meta: {
              title: '数据字典',
              icon: 'BookOutlined',
              permission: PERMISSION_CODES.DICT_VIEW,
              keepAlive: true,
            },
          },
          {
            path: '/system/error-demo',
            element: <ErrorDemo />,
            meta: {
              title: '错误页面样例',
              icon: 'ExclamationCircleOutlined',
              keepAlive: false,
            },
          },
          {
            path: '/system/error-demo-test',
            element: <ErrorDemoTest />,
            meta: {
              title: '错误页面测试',
              icon: 'ExclamationCircleOutlined',
              keepAlive: false,
            },
          },
        ],
      },
    ],
  },
  
  // 错误页面
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFound />,
  },
  {
    path: ROUTES.FORBIDDEN,
    element: <Forbidden />,
  },
  {
    path: ROUTES.SERVER_ERROR,
    element: <ServerError />,
  },
  
  // 404 页面（通配符路由）
  {
    path: '*',
    element: <NotFound />,
  },
]

/**
 * 扁平化路由配置，用于权限检查
 */
export const flatRoutes = []

const flattenRoutes = (routes, parentPath = '') => {
  routes.forEach(route => {
    const fullPath = parentPath + (route.path || '')
    
    if (route.element) {
      flatRoutes.push({
        path: fullPath,
        element: route.element,
        meta: route.meta,
        permission: route.meta?.permission,
        roles: route.meta?.roles,
      })
    }
    
    if (route.children) {
      flattenRoutes(route.children, fullPath)
    }
  })
}

flattenRoutes(routes)

/**
 * 根据路径获取路由配置
 */
export const getRouteByPath = (path) => {
  return flatRoutes.find(route => route.path === path)
}