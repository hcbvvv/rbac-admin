import React from 'react'
import styles from '../login.module.css'

/**
 * 登录页面底部组件
 */
const LoginFooter = () => {
  return (
    <div className={styles.loginFooter}>
      <p className={styles.footerText}>
        © 2024 RBAC权限管理系统. All rights reserved.
      </p>
    </div>
  )
}

export default LoginFooter