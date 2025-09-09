import React from 'react'
import styles from '../login.module.css'

/**
 * 登录页面头部组件
 */
const LoginHeader = () => {
  return (
    <div className={styles.loginHeader}>
      <h1 className={styles.loginTitle}>
        RBAC 权限管理系统
      </h1>
      <p className={styles.loginSubtitle}>
        基于角色的访问控制管理平台
      </p>
    </div>
  )
}

export default LoginHeader