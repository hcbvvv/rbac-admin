import React from 'react'
import { Card, Row, Col, Statistic, Typography, Space, Button } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores'
import { usePermission } from '@/hooks/usePermission'

const { Title, Paragraph } = Typography

/**
 * 仪表板页面组件
 */
const Dashboard = () => {
  const { user } = useAuthStore()
  const { hasPermission, userRoles, isSuperAdmin, isAdmin } = usePermission()
  
  // 模拟统计数据
  const statistics = [
    {
      title: '用户总数',
      value: 1234,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: '人',
      icon: <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
    },
    {
      title: '角色数量',
      value: 15,
      precision: 0,
      valueStyle: { color: '#cf1322' },
      prefix: <ArrowDownOutlined />,
      suffix: '个',
      icon: <TeamOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    },
    {
      title: '权限数量',
      value: 89,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: '项',
      icon: <SafetyOutlined style={{ fontSize: 24, color: '#faad14' }} />,
    },
    {
      title: '菜单数量',
      value: 32,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: '个',
      icon: <MenuOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
    },
  ]
  
  return (
    <div>
      {/* 欢迎信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={2}>
          欢迎回来，{user?.username || user?.name || '用户'}！
        </Title>
        <Paragraph type="secondary">
          今天是 {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </Paragraph>
        
        {/* 用户信息 */}
        <div style={{ marginTop: 16 }}>
          <Space direction="vertical" size={4}>
            <div>
              <strong>当前角色：</strong>
              <Space>
                {userRoles.map(role => (
                  <span key={role.id || role} style={{
                    padding: '2px 8px',
                    background: isSuperAdmin ? '#f6ffed' : isAdmin ? '#fff1f0' : '#f0f5ff',
                    color: isSuperAdmin ? '#52c41a' : isAdmin ? '#ff4d4f' : '#1890ff',
                    borderRadius: 4,
                    fontSize: 12,
                  }}>
                    {role.name || role}
                  </span>
                ))}
              </Space>
            </div>
            <div>
              <strong>权限状态：</strong>
              {isSuperAdmin ? (
                <span style={{ color: '#52c41a' }}>超级管理员（拥有所有权限）</span>
              ) : isAdmin ? (
                <span style={{ color: '#ff4d4f' }}>管理员</span>
              ) : (
                <span style={{ color: '#1890ff' }}>普通用户</span>
              )}
            </div>
          </Space>
        </div>
      </Card>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    precision={stat.precision}
                    valueStyle={stat.valueStyle}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* 快捷操作 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="快捷操作" extra={<Button type="link">更多</Button>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {hasPermission('user:create') && (
                <Button type="primary" block icon={<UserOutlined />}>
                  创建用户
                </Button>
              )}
              {hasPermission('role:create') && (
                <Button block icon={<TeamOutlined />}>
                  创建角色
                </Button>
              )}
              {hasPermission('permission:view') && (
                <Button block icon={<SafetyOutlined />}>
                  权限管理
                </Button>
              )}
              {hasPermission('menu:create') && (
                <Button block icon={<MenuOutlined />}>
                  菜单配置
                </Button>
              )}
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="系统信息">
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div>
                <strong>系统版本：</strong> v1.0.0
              </div>
              <div>
                <strong>技术栈：</strong> React + Vite + Ant Design + Zustand
              </div>
              <div>
                <strong>权限模型：</strong> RBAC (基于角色的访问控制)
              </div>
              <div>
                <strong>最后更新：</strong> {new Date().toLocaleDateString()}
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard