import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '@/stores'
import { useRoutePermission } from '@/hooks/usePermission'
import { PUBLIC_ROUTES, ROUTES } from '@/constants'

/**
 * 权限守卫组件
 */
const AuthGuard = ({ children, route }) => {
  const location = useLocation()
  const { isAuthenticated, loading, user } = useAuthStore()
  const { checkRoutePermission, isInitialized } = useRoutePermission()
  
  // 如果正在加载中，显示加载状态
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }
  
  // 如果权限正在初始化中，显示加载状态
  if (isAuthenticated && !isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="初始化权限中..." />
      </div>
    )
  }
  
  // 检查是否为公共路由
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname)
  
  // 如果是公共路由，直接渲染
  if (isPublicRoute) {
    return children
  }
  
  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }
  
  // 如果用户信息不完整，可能需要重新获取用户信息
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="加载用户信息..." />
      </div>
    )
  }
  
  // 检查路由权限
  if (route && !checkRoutePermission(route)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />
  }
  
  return children
}

export default AuthGuard