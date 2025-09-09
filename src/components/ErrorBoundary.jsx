import React from 'react'
import { Result, Button, Space, Typography, Card, Alert, Collapse } from 'antd'
import { useNavigate } from 'react-router-dom'
import { 
  HomeOutlined, 
  ArrowLeftOutlined, 
  ReloadOutlined, 
  BugOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'

const { Text, Paragraph } = Typography
const { Panel } = Collapse

/**
 * React 错误边界组件
 * 用于捕获子组件中的JavaScript错误，并显示友好的错误页面
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // 更新状态，使得下一次渲染显示降级后的UI
    return {
      hasError: true,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    this.setState({
      error,
      errorInfo
    })

    // 这里可以将错误信息发送到错误监控服务
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // 可以集成错误监控服务，如 Sentry
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack
    //     }
    //   }
    // })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        resetError={() => this.setState({ 
          hasError: false, 
          error: null, 
          errorInfo: null,
          errorId: null 
        })}
      />
    }

    return this.props.children
  }
}

/**
 * 错误回退UI组件
 */
const ErrorFallback = ({ error, errorInfo, errorId, resetError }) => {
  const navigate = useNavigate()
  
  // 返回上一页
  const goBack = () => {
    try {
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      window.location.href = '/dashboard'
    }
  }
  
  // 刷新当前页面
  const refresh = () => {
    window.location.reload()
  }
  
  // 重试操作
  const retry = () => {
    resetError()
  }
  
  // 获取错误详情
  const getErrorDetails = () => {
    if (!error) return '未知错误'
    
    let details = `错误类型: ${error.name || 'Error'}\n`
    details += `错误信息: ${error.message || '未知错误'}\n`
    
    if (error.stack) {
      details += `错误堆栈:\n${error.stack}\n`
    }
    
    if (errorInfo && errorInfo.componentStack) {
      details += `组件堆栈:\n${errorInfo.componentStack}`
    }
    
    return details
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
      <Card style={{ maxWidth: 700, width: '100%' }}>
        <Result
          status="500"
          title="系统错误"
          subTitle="抱歉，页面出现错误。我们正在努力修复中，请稍后再试。"
          icon={<BugOutlined style={{ color: '#ff4d4f' }} />}
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
                onClick={retry}
              >
                重新尝试
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
        
        <Alert
          message="错误原因"
          description={
            <div>
              <Paragraph style={{ margin: 0 }}>
                • 代码执行异常
                <br />
                • 数据格式错误
                <br />
                • 组件渲染失败
                <br />
                • 网络请求失败
                <br />
                • 权限验证异常
              </Paragraph>
            </div>
          }
          type="error"
          showIcon
          style={{ marginTop: 20 }}
        />

        {/* 错误详情折叠面板 - 开发环境显示 */}
        {process.env.NODE_ENV === 'development' && (
          <Collapse 
            ghost 
            style={{ marginTop: 20 }}
          >
            <Panel 
              header={
                <Space>
                  <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                  <Text strong>错误详情（开发模式）</Text>
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
                {getErrorDetails()}
              </div>
            </Panel>
          </Collapse>
        )}
        
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text type="secondary">
            错误编号：{errorId}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            发生时间：{new Date().toLocaleString()}
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default ErrorBoundary