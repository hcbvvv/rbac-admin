import React, { useState, useEffect } from 'react'
import { Result, Button, Space, Typography, Card, Alert, Collapse } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  HomeOutlined, 
  ArrowLeftOutlined, 
  ReloadOutlined, 
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
  BugOutlined
} from '@ant-design/icons'

const { Text, Paragraph } = Typography
const { Panel } = Collapse

/**
 * 500 服务器错误页面
 */
const ServerError = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [errorInfo, setErrorInfo] = useState(null)
  
  // 加载存储的错误信息
  useEffect(() => {
    try {
      const lastError = sessionStorage.getItem('lastError')
      if (lastError) {
        const parsedError = JSON.parse(lastError)
        setErrorInfo(parsedError)
        // 清除已显示的错误信息
        sessionStorage.removeItem('lastError')
      }
    } catch (error) {
      console.error('解析错误信息失败:', error)
    }
  }, [])
  
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
                {errorInfo ? (
                  <>
                    • {errorInfo.message || '系统内部错误'}
                    <br />
                    • 错误类型：{errorInfo.type || '未知错误'}
                    {errorInfo.timestamp && (
                      <>
                        <br />
                        • 发生时间：{new Date(errorInfo.timestamp).toLocaleString()}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    • 服务器正在维护中
                    <br />
                    • 网络连接不稳定
                    <br />
                    • 服务器资源不足
                    <br />
                    • 系统内部错误
                  </>
                )}
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
            错误编号：{errorInfo?.errorId || `ERR_500_${Date.now()}`}
          </Text>
        </div>

        {/* 错误详情折叠面板 - 开发环境或有错误信息时显示 */}
        {(process.env.NODE_ENV === 'development' || errorInfo) && (
          <Collapse 
            ghost 
            style={{ marginTop: 20 }}
          >
            <Panel 
              header={
                <Space>
                  <BugOutlined style={{ color: '#faad14' }} />
                  <Text strong>错误详情{process.env.NODE_ENV === 'development' ? '（开发模式）' : ''}</Text>
                </Space>
              } 
              key="error-details"
            >
              <div style={{
                background: '#f6f8fa',
                padding: '12px',
                borderRadius: '6px',
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '300px',
                overflow: 'auto',
                border: '1px solid #d9d9d9'
              }}>
                {errorInfo ? (
                  Object.entries(errorInfo)
                    .filter(([key, value]) => value != null)
                    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`)
                    .join('\n')
                ) : (
                  '未捕获到错误详情'
                )}
              </div>
            </Panel>
          </Collapse>
        )}
      </Card>
    </div>
  )
}

export default ServerError