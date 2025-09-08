import React from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

/**
 * 认证页面布局组件
 */
const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '0 20px',
          }}
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}

export default AuthLayout