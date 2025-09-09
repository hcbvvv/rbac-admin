import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './forbidden.module.css'

/**
 * 403 权限不足页面
 */
const Forbidden = () => {
  const navigate = useNavigate()
  
  return (
    <div className={styles.forbiddenContainer}>
      <div className={styles.forbiddenCard}>
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有访问此页面的权限。"
          className={styles.forbiddenResult}
          extra={
            <Button 
              type="primary" 
              onClick={() => navigate('/dashboard')}
              className={styles.forbiddenButton}
            >
              返回首页
            </Button>
          }
        />
      </div>
    </div>
  )
}

export default Forbidden