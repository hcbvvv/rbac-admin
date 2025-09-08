import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

/**
 * 403 权限不足页面
 */
const Forbidden = () => {
  const navigate = useNavigate()
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有访问此页面的权限。"
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export default Forbidden