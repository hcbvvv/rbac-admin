import React, { useState, useEffect } from 'react'
import { Result, Button, Space, Typography, Alert, Collapse, Card } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  HomeOutlined, 
  ArrowLeftOutlined, 
  ReloadOutlined, 
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
  BugOutlined,
  WarningOutlined,
  StopOutlined
} from '@ant-design/icons'

const { Text, Paragraph } = Typography
const { Panel } = Collapse

/**
 * 内联错误页面组件 - 在主布局内显示错误
 */
const InlineErrorPage = ({ 
  errorType = '500', 
  errorInfo = null, 
  onRetry = null,
  style = {} 
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 返回上一页
  const goBack = () => {
    try {
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      navigate('/dashboard')
    }
  }
  
  // 刷新当前页面
  const refresh = () => {
    window.location.reload()
  }
  
  // 重试操作
  const retry = () => {
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }
  
  // 根据错误类型获取配置
  const getErrorConfig = () => {
    switch (errorType) {
      case '404':
        return {
          status: '404',
          title: '页面不存在',
          subTitle: '抱歉，您访问的页面不存在',
          icon: <BugOutlined style={{ color: '#722ed1' }} />,
          color: '#722ed1',
          causes: [
            '访问未定义的路由',
            '页面路径输入错误',
            '资源已被删除或移动',
            'URL参数不正确'
          ]
        }
      case '403':
        return {
          status: '403',
          title: '权限不足',
          subTitle: '抱歉，您没有权限访问此页面',
          icon: <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />,
          color: '#fa8c16',
          causes: [
            '用户权限不足',
            '角色权限被禁用',
            '访问受限资源',
            '会话已过期'
          ]
        }
      case 'network':
        return {
          status: 'warning',
          title: '网络连接错误',
          subTitle: '网络连接失败，请检查网络设置',
          icon: <StopOutlined style={{ color: '#ff4d4f' }} />,
          color: '#ff4d4f',
          causes: [
            '网络连接中断',
            '服务器无响应',
            'DNS解析失败',
            '防火墙阻止连接'
          ]
        }
      default: // '500'
        return {
          status: '500',
          title: '系统错误',
          subTitle: '抱歉，系统出现错误，请稍后再试',
          icon: <WarningOutlined style={{ color: '#fa541c' }} />,
          color: '#fa541c',
          causes: [
            '服务器内部错误',
            '数据库连接异常', 
            '代码执行异常',
            '系统资源不足'
          ]
        }
    }
  }

  const config = getErrorConfig()
  
  // 获取错误详情
  const getErrorDetails = () => {
    if (!errorInfo) return '未获取到错误详情'
    
    return Object.entries(errorInfo)
      .filter(([key, value]) => value != null)
      .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`)
      .join('\n')
  }

  return (
    <div style={{
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      ...style 
    }}>
      <Card>
        <Result
          status={config.status}
          title={config.title}
          subTitle={config.subTitle}
          icon={config.icon}
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
              {onRetry && (
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={retry}
                >
                  重新尝试
                </Button>
              )}
              <Button 
                icon={<ReloadOutlined />}
                onClick={refresh}
              >
                刷新页面
              </Button>
              <Button 
                icon={<CustomerServiceOutlined />}
                onClick={() => console.log('联系客服')}
              >
                联系客服
              </Button>
            </Space>
          }
        />
        
        <Alert
          message="可能的原因"
          description={
            <div>
              <Paragraph style={{ margin: 0 }}>
                {errorInfo?.message && (
                  <>
                    • {errorInfo.message}
                    <br />
                  </>
                )}
                {config.causes.map((cause, index) => (
                  <span key={index}>
                    • {cause}
                    {index < config.causes.length - 1 && <br />}
                  </span>
                ))}
              </Paragraph>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginTop: 20 }}
        />

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
                {getErrorDetails()}
              </div>
            </Panel>
          </Collapse>
        )}
        
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Text type="secondary">
            当前访问路径：{location.pathname}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            错误编号：{errorInfo?.errorId || `ERR_${errorType}_${Date.now()}`}
          </Text>
          {errorInfo?.timestamp && (
            <>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                发生时间：{new Date(errorInfo.timestamp).toLocaleString()}
              </Text>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

export default InlineErrorPage