import React, { useState } from 'react'
import { Layout, Button, Dropdown, Avatar, Space, Typography, Drawer, List, Badge, Empty, Divider, Tag } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useAppStore } from '@/stores'
// 可选：使用全局通知store
// import { useAuthStore, useAppStore, useNotificationStore } from '@/stores'
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
  const [notificationOpen, setNotificationOpen] = useState(false)
  
  // 模拟通知数据
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info',
      title: '系统维护通知',
      content: '系统将于今晚22:00-23:00进行维护，期间可能无法正常访问',
      time: '2024-01-09 14:30',
      read: false
    },
    {
      id: '2', 
      type: 'success',
      title: '权限申请通过',
      content: '您申请的用户管理权限已通过审核',
      time: '2024-01-09 10:15',
      read: false
    },
    {
      id: '3',
      type: 'warning', 
      title: '密码即将过期',
      content: '您的密码将在7天后过期，请及时修改',
      time: '2024-01-08 16:45',
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: '登录异常',
      content: '检测到您的账户在异地登录，请注意账户安全',
      time: '2024-01-08 09:20',
      read: true
    },
    {
      id: '5',
      type: 'info',
      title: '新功能上线',
      content: '数据导出功能已上线，欢迎体验使用',
      time: '2024-01-07 18:30',
      read: true
    }
  ])
  
  // 未读通知数量
  const unreadCount = notifications.filter(n => !n.read).length
  
  // 用户菜单项
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile?tab=profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
      onClick: () => navigate('/profile?tab=settings'),
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
  
  // 打开通知抽屉
  const handleNotificationClick = () => {
    setNotificationOpen(true)
  }
  
  // 关闭通知抽屉
  const handleNotificationClose = () => {
    setNotificationOpen(false)
  }
  
  // 标记为已读
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }
  
  // 删除通知
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  // 全部标记为已读
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }
  
  // 清空已读通知
  const clearReadNotifications = () => {
    setNotifications(prev => prev.filter(n => !n.read))
  }
  
  // 获取通知类型图标和颜色
  const getNotificationIcon = (type) => {
    const iconProps = { style: { fontSize: 16 } }
    switch (type) {
      case 'success':
        return <CheckCircleOutlined {...iconProps} style={{ ...iconProps.style, color: '#52c41a' }} />
      case 'warning':
        return <ExclamationCircleOutlined {...iconProps} style={{ ...iconProps.style, color: '#faad14' }} />
      case 'error':
        return <CloseOutlined {...iconProps} style={{ ...iconProps.style, color: '#ff4d4f' }} />
      default:
        return <InfoCircleOutlined {...iconProps} style={{ ...iconProps.style, color: '#1890ff' }} />
    }
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
          <Badge count={unreadCount} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              onClick={handleNotificationClick}
              style={{ 
                fontSize: '16px',
                height: '40px',
                width: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </Badge>
          
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
      
      {/* 通知抽屉 */}
      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>通知中心</span>
            <Space size="small">
              {unreadCount > 0 && (
                <Button 
                  type="text" 
                  size="small" 
                  onClick={markAllAsRead}
                >
                  全部已读
                </Button>
              )}
              <Button 
                type="text" 
                size="small" 
                onClick={clearReadNotifications}
                disabled={notifications.filter(n => n.read).length === 0}
              >
                清空已读
              </Button>
            </Space>
          </div>
        }
        placement="right"
        width={400}
        open={notificationOpen}
        onClose={handleNotificationClose}
        bodyStyle={{ padding: 0 }}
      >
        {notifications.length === 0 ? (
          <div style={{ padding: 40 }}>
            <Empty 
              description="暂无通知" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: '16px 24px',
                  backgroundColor: item.read ? '#fff' : '#f6f8ff',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}
                actions={[
                  <Button
                    key="read"
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(item.id)
                    }}
                    disabled={item.read}
                    title={item.read ? '已读' : '标记为已读'}
                  />,
                  <Button
                    key="delete"
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(item.id)
                    }}
                    danger
                    title="删除"
                  />
                ]}
                onClick={() => !item.read && markAsRead(item.id)}
              >
                <List.Item.Meta
                  avatar={getNotificationIcon(item.type)}
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: item.read ? 'normal' : 'bold' }}>
                        {item.title}
                      </span>
                      {!item.read && (
                        <Badge 
                          status="processing" 
                          style={{ marginLeft: 8 }}
                        />
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ 
                        color: item.read ? '#666' : '#333',
                        marginBottom: 8,
                        lineHeight: 1.4
                      }}>
                        {item.content}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ 
                          color: '#999', 
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {item.time}
                        </span>
                        <Tag 
                          color={
                            item.type === 'success' ? 'green' :
                            item.type === 'warning' ? 'orange' :
                            item.type === 'error' ? 'red' : 'blue'
                          }
                          size="small"
                        >
                          {
                            item.type === 'success' ? '成功' :
                            item.type === 'warning' ? '警告' :
                            item.type === 'error' ? '错误' : '信息'
                          }
                        </Tag>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Drawer>
    </Header>
  )
}

export default AppHeader