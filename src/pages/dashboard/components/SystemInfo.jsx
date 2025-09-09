import React from 'react'
import { Card, Space } from 'antd'
import styles from '../dashboard.module.css'

/**
 * 系统信息组件
 */
const SystemInfo = () => {
  return (
    <Card title="系统信息" className={styles.systemInfo}>
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <div className={styles.systemInfoItem}>
          <strong>系统版本：</strong> v1.0.0
        </div>
        <div className={styles.systemInfoItem}>
          <strong>技术栈：</strong> React + Vite + Ant Design + Zustand
        </div>
        <div className={styles.systemInfoItem}>
          <strong>权限模型：</strong> RBAC (基于角色的访问控制)
        </div>
        <div className={styles.systemInfoItem}>
          <strong>最后更新：</strong> {new Date().toLocaleDateString()}
        </div>
      </Space>
    </Card>
  )
}

export default SystemInfo