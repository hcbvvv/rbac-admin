import React from 'react'
import { Button, Space, Alert } from 'antd'
import { ExclamationCircleOutlined, CloseCircleOutlined, BugOutlined } from '@ant-design/icons'
import styles from '../errorDemo.module.css'

/**
 * 内联错误演示组件
 */
const InlineErrorDemo = ({ showError, hideError }) => {
  // 模拟内联403错误
  const triggerInline403 = () => {
    const error = {
      message: '权限不足，无法访问此页面',
      status: 403,
      type: 'permission_denied',
      timestamp: new Date().toISOString(),
      errorId: `ERR_403_${Date.now()}`
    }
    showError('403', error)
  }

  // 模拟内联500错误
  const triggerInline500 = () => {
    const error = {
      message: '服务器内部错误，请稍后重试',
      status: 500,
      type: 'internal_server_error',
      timestamp: new Date().toISOString(),
      errorId: `ERR_500_${Date.now()}`,
      stack: 'Error: 模拟的服务器错误\n    at triggerInline500\n    at onClick'
    }
    showError('500', error, () => {
      console.log('重试操作')
      hideError()
    })
  }

  // 模拟内联404错误
  const triggerInline404 = () => {
    const error = {
      message: '请求的资源不存在',
      status: 404,
      type: 'not_found',
      timestamp: new Date().toISOString(),
      errorId: `ERR_404_${Date.now()}`
    }
    showError('404', error)
  }

  return (
    <div>
      <Space className={styles.inlineErrorActions}>
        <Button 
          icon={<ExclamationCircleOutlined />}
          onClick={triggerInline403}
        >
          显示403错误
        </Button>
        <Button 
          icon={<CloseCircleOutlined />}
          onClick={triggerInline500}
        >
          显示500错误
        </Button>
        <Button 
          icon={<BugOutlined />}
          onClick={triggerInline404}
        >
          显示404错误
        </Button>
        <Button 
          onClick={hideError}
        >
          隐藏错误
        </Button>
      </Space>
      
      <Alert
        message="内联错误处理"
        description="内联错误会在当前页面显示，不会跳转到新的页面。这种方式适用于表单验证、局部数据加载失败等场景。"
        type="success"
        showIcon
        style={{ marginTop: 16 }}
      />
    </div>
  )
}

export default InlineErrorDemo