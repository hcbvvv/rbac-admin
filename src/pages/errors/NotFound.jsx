import React from 'react'
import { Result, Button, Space, Typography, Card } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { HomeOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons'

const { Text } = Typography

/**
 * 404 页面
 */
const NotFound = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 返回上一页
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/dashboard')
    }
  }
  
  // 刷新当前页面
  const refresh = () => {
    window.location.reload()
  }
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: 600, width: '100%' }}>
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在。"
          extra={
            <Space wrap>
              <Button 
                type="primary" 
                icon={<HomeOutlined />}
                onClick={() => navigate('/dashboard')}
              >
                返回首页
              </Button>
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={goBack}
              >
                返回上页
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={refresh}
              >
                刷新页面
              </Button>
            </Space>
          }
        />
        
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text type="secondary">
            当前访问路径：{location.pathname}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            如果您认为这是一个错误，请联系系统管理员
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default NotFound