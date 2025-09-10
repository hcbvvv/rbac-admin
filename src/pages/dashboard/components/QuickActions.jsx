import React from 'react'
import { Card, Space, Button } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import styles from '../dashboard.module.less'

/**
 * 快捷操作组件
 */
const QuickActions = () => {
  const { hasPermission } = usePermission()
  
  return (
    <Card 
      title="快捷操作" 
      extra={<Button type="link">更多</Button>}
      className={styles.actionCard}
    >
      <Space direction="vertical" className={styles.actionButtons}>
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
  )
}

export default QuickActions