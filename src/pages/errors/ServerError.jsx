import React from 'react'
import { Result, Button, Space, Typography, Card, Alert } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { HomeOutlined, ArrowLeftOutlined, ReloadOutlined, CustomerServiceOutlined } from '@ant-design/icons'

const { Text, Paragraph } = Typography

/**
 * 500 服务器错误页面
 */
const ServerError = () => {
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
  
  // 联系技术支持
  const contactSupport = () => {
    // 这里可以打开客服系统或显示联系方式
    console.log('联系技术支持')
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
          status="500"
          title="500"
          subTitle="抱歉，服务器出现错误，请稍后再试。"
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
              <Button 
                icon={<CustomerServiceOutlined />}
                onClick={contactSupport}
              >
                联系支持
              </Button>
            </Space>
          }
        />
        
        <Alert
          message="可能的原因"
          description={
            <div>
              <Paragraph style={{ margin: 0 }}>
                • 服务器正在维护中
                <br />
                • 网络连接不稳定
                <br />
                • 服务器资源不足
                <br />
                • 系统内部错误
              </Paragraph>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginTop: 20 }}
        />
        
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text type="secondary">
            当前访问路径：{location.pathname}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            错误编号：ERR_500_{Date.now()}
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default ServerError