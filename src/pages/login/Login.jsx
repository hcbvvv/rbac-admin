import React from 'react'
import LoginHeader from './components/LoginHeader'
import LoginForm from './components/LoginForm'
import LoginFooter from './components/LoginFooter'
import styles from './login.module.css'

/**
 * 登录页面主组件
 */
const Login = () => {
  return (
    <div className={styles.loginContainer}>
      {/* 页面标题 */}
      <LoginHeader />
      
      {/* 登录表单 */}
      <LoginForm />
      
      {/* 底部信息 */}
      <LoginFooter />
    </div>
  )
}

export default Login