import React from 'react'
import { Button } from 'antd'
import styles from '../login.module.css'

/**
 * 演示登录组件
 */
const DemoLogin = ({ form }) => {
  // 模拟登录（演示用）
  const handleDemoLogin = (role = 'admin') => {
    const demoCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      user: { username: 'user', password: 'user123' },
    }
    
    form.setFieldsValue(demoCredentials[role])
  }
  
  return (
    <div className={styles.demoSection}>
      <p className={styles.demoText}>
        演示账号：
      </p>
      <div className={styles.demoButtons}>
        <Button 
          size="small" 
          type="link"
          onClick={() => handleDemoLogin('admin')}
        >
          管理员登录
        </Button>
        <Button 
          size="small" 
          type="link"
          onClick={() => handleDemoLogin('user')}
        >
          普通用户登录
        </Button>
      </div>
    </div>
  )
}

export default DemoLogin