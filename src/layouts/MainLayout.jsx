import React from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Sidebar, AppHeader, InlineErrorPage } from '@/components'
import { useAppStore, useErrorStore } from '@/stores'

const { Content, Sider } = Layout

/**
 * 主布局组件
 */
const MainLayout = () => {
  const { collapsed } = useAppStore()
  const { showInlineError, errorType, errorInfo, onRetry } = useErrorStore()
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={256}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1002, // 高于头部的z-index
        }}
      >
        {/* Logo */}
        <div className="logo">
          {collapsed ? 'RBAC' : 'RBAC 权限管理'}
        </div>
        
        {/* 侧边栏菜单 */}
        <Sidebar />
      </Sider>
      
      {/* 主内容区域 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'margin-left 0.2s' }}>
        {/* 头部导航 */}
        <AppHeader />
        
        {/* 内容区域 - 固定高度和滚动 */}
        <Content
          style={{
            marginTop: '64px', // 为固定头部留出空间
            height: 'calc(100vh - 64px)', // 固定高度，减去头部高度
            overflow: 'auto', // 直接在Content上设置滚动
            padding: '16px', // 直接设置内边距
          }}
        >
          {/* 页面内容 */}
          <div 
            className="site-layout-content"
            style={{
              height: '100%',
            }}
          >
            {showInlineError ? (
              <InlineErrorPage 
                errorType={errorType}
                errorInfo={errorInfo}
                onRetry={onRetry}
              />
            ) : (
              <Outlet />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout