import React, { Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { routes, getRouteByPath } from './router/routes'
import AuthGuard from '@/components/AuthGuard'
import { useAuthStore, usePermissionStore } from '@/stores'

/**
 * 路由加载中组件
 */
const RouteLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px' 
  }}>
    <Spin size="large" tip="页面加载中..." />
  </div>
)

/**
 * 错误边界组件
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('页面渲染错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="页面加载失败"
          subTitle="抱歉，页面出现了错误，请尝试刷新页面。"
          extra={[
            <Button type="primary" key="reload" onClick={() => window.location.reload()}>
              刷新页面
            </Button>,
            <Button key="home" onClick={() => window.location.href = '/'}>
              返回首页
            </Button>,
          ]}
        >
          <div style={{ marginTop: 16 }}>
            <details>
              <summary>错误详情</summary>
              <pre style={{ marginTop: 8, fontSize: 12 }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </Result>
      )
    }

    return this.props.children
  }
}

/**
 * 递归渲染路由
 */
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    const { path, element, children } = route
    
    if (children) {
      return (
        <Route key={path || index} path={path} element={element}>
          {renderRoutes(children)}
        </Route>
      )
    }
    
    return (
      <Route
        key={path || index}
        path={path}
        index={route.index}
        element={
          <ErrorBoundary>
            <AuthGuard route={route}>
              <Suspense fallback={<RouteLoading />}>
                {element}
              </Suspense>
            </AuthGuard>
          </ErrorBoundary>
        }
      />
    )
  })
}

/**
 * 应用路由器
 */
const AppRouter = () => {
  const location = useLocation()
  const [initError, setInitError] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)
  
  // 获取 stores
  const authStore = useAuthStore()
  const permissionStore = usePermissionStore()
  
  // 初始化认证和权限
  useEffect(() => {
    const initApp = async () => {
      try {
        setIsInitializing(true)
        
        // 初始化认证状态
        if (authStore?.initAuth) {
          authStore.initAuth()
        }
        
        // 如果已登录，初始化权限数据
        if (authStore?.isAuthenticated && permissionStore?.initPermissions) {
          await permissionStore.initPermissions()
        }
        
        setInitError(null)
      } catch (error) {
        console.error('初始化应用失败:', error)
        setInitError(error)
      } finally {
        setIsInitializing(false)
      }
    }

    initApp()
  }, [])
  
  // 监听路由变化
  useEffect(() => {
    try {
      const currentRoute = getRouteByPath(location.pathname)
      
      // 设置页面标题
      if (currentRoute?.meta?.title) {
        document.title = `${currentRoute.meta.title} - RBAC 权限管理系统`
      } else {
        document.title = 'RBAC 权限管理系统'
      }
    } catch (error) {
      console.error('处理路由变化失败:', error)
    }
  }, [location.pathname])
  
  // 初始化加载中
  if (isInitializing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column' 
      }}>
        <Spin size="large" tip="初始化中..." />
        <div style={{ marginTop: 16, color: '#666' }}>
          RBAC 权限管理系统
        </div>
      </div>
    )
  }
  
  // 初始化错误
  if (initError) {
    return (
      <Result
        status="error"
        title="系统初始化失败"
        subTitle="系统初始化过程中出现错误，请刷新页面重试。"
        extra={[
          <Button type="primary" key="retry" onClick={() => window.location.reload()}>
            重新加载
          </Button>
        ]}
      >
        <div style={{ marginTop: 16 }}>
          <details>
            <summary>错误详情</summary>
            <pre style={{ marginTop: 8, fontSize: 12 }}>
              {initError.toString()}
            </pre>
          </details>
        </div>
      </Result>
    )
  }

  return (
    <ErrorBoundary>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </ErrorBoundary>
  )
}

export default AppRouter