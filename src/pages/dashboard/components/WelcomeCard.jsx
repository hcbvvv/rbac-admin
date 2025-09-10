import React from 'react'
import { Card, Typography, Space } from 'antd'
import { useAuthStore } from '@/stores'
import { usePermission } from '@/hooks/usePermission'
import styles from '../dashboard.module.less'

const { Title, Paragraph } = Typography

/**
 * 欢迎卡片组件
 */
const WelcomeCard = () => {
  const { user } = useAuthStore()
  const { userRoles, isSuperAdmin, isAdmin } = usePermission()
  
  return (
    <Card className={styles.welcomeCard}>
      <Title level={2} className={styles.welcomeTitle}>
        欢迎回来，{user?.username || user?.name || '用户'}！
      </Title>
      <Paragraph type="secondary" className={styles.welcomeDescription}>
        今天是 {new Date().toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}
      </Paragraph>
      
      {/* 用户信息 */}
      <div className={styles.userInfo}>
        <Space direction="vertical" size={4}>
          <div className={styles.userInfoItem}>
            <strong>当前角色：</strong>
            <Space>
              {userRoles.map(role => (
                <span 
                  key={role.id || role} 
                  className={`${styles.roleTag} ${
                    isSuperAdmin ? styles.roleTagSuper : 
                    isAdmin ? styles.roleTagAdmin : 
                    styles.roleTagUser
                  }`}
                >
                  {role.name || role}
                </span>
              ))}
            </Space>
          </div>
          <div className={styles.userInfoItem}>
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
  )
}

export default WelcomeCard