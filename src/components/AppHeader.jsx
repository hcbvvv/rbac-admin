import React from 'react'
import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useAppStore } from '@/stores'
import AppBreadcrumb from './AppBreadcrumb'

const { Header } = Layout
const { Text } = Typography

/**
 * 头部导航组件
 */
const AppHeader = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { collapsed, toggleCollapsed } = useAppStore()
  
  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]
  
  // 退出登录处理
  function handleLogout() {
    logout()
    navigate('/login')
  }
  
  return (
    <Header
      style={{
        padding: '0 16px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
        position: 'fixed',
        top: 0,
        right: 0,
        left: collapsed ? 80 : 256,
        zIndex: 1001,
        transition: 'left 0.2s',
        height: '64px',
      }}
    >
      {/* 左侧 - 菜单折叠按钮和面包屑 */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        
        {/* 面包屑导航 */}
        <div style={{ marginLeft: '16px' }}>
          <AppBreadcrumb />
        </div>
      </div>
      
      {/* 右侧 - 用户信息和操作 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Space size="middle">
          {/* 通知铃铛 */}
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ 
              fontSize: '16px',
              height: '40px', // 限制高度
              width: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          
          {/* 用户信息下拉菜单 */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '4px 8px', // 减少上下内边距
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                height: '48px', // 限制高度
                maxHeight: '48px', // 确保不超过高度
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={user?.avatar}
                style={{ marginRight: 8, flexShrink: 0 }} // 防止头像被压缩
              />
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 0, // 允许文本截断
                lineHeight: 1.2, // 减小行高
              }}>
                <Text 
                  strong 
                  style={{ 
                    fontSize: '13px', // 略微减小字体
                    lineHeight: '16px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '120px' // 限制最大宽度
                  }}
                >
                  {user?.username || user?.name || '用户'}
                </Text>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: '11px', // 略微减小字体
                    lineHeight: '14px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '120px' // 限制最大宽度
                  }}
                >
                  {user?.roles?.[0]?.name || '普通用户'}
                </Text>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  )
}

export default AppHeader