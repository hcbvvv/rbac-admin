import React, { useState } from 'react'
import { Card, Button, Space, Alert, Divider, Typography, Row, Col, Result } from 'antd'
import { 
  ExclamationCircleOutlined, 
  BugOutlined, 
  WarningOutlined, 
  StopOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  HomeOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { captureError } from '@/utils/errorHandler'
import { useErrorStore } from '@/stores/error'
import ErrorTypeCard from './components/ErrorTypeCard'
import InlineErrorDemo from './components/InlineErrorDemo'
import styles from './errorDemo.module.less'

const { Title, Paragraph, Text } = Typography

/**
 * 错误页面演示组件
 */
const ErrorDemo = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { showError, hideError } = useErrorStore()

  // 模拟触发404错误
  const triggerNotFound = () => {
    navigate('/non-existent-page')
  }

  // 模拟触发500错误
  const triggerServerError = () => {
    navigate('/500')
  }

  // 模拟触发403错误
  const triggerForbidden = () => {
    navigate('/403')
  }

  // 模拟API错误
  const simulateApiError = async () => {
    setLoading(true)
    try {
      // 模拟网络延迟和错误
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('服务器内部错误'))
        }, 2000)
      })
    } catch (error) {
      console.error('API错误:', error)
      // 使用全局错误处理
      captureError(error, { type: 'api_simulation', action: 'simulateApiError' })
    } finally {
      setLoading(false)
    }
  }

  // 模拟JavaScript运行时错误
  const triggerJavaScriptError = () => {
    // 访问不存在的属性
    const obj = null
    console.log(obj.someProperty) // 这会抛出TypeError
  }

  // 模拟Promise拒绝错误
  const triggerPromiseRejection = () => {
    // 未处理的Promise拒绝
    Promise.reject(new Error('未处理的Promise拒绝错误'))
  }

  // 错误类型配置
  const errorTypes = [
    {
      key: '404',
      title: '404 页面不存在',
      icon: <BugOutlined />,
      color: '#722ed1',
      status: '404',
      subtitle: '抱歉，您访问的页面不存在',
      description: '当用户访问不存在的页面时显示的错误页面。',
      causes: [
        '访问未定义的路由',
        '页面路径输入错误',
        '资源已被删除或移动',
        'URL参数不正确'
      ],
      solutions: [
        '检查URL地址是否正确',
        '返回首页重新导航',
        '联系管理员确认页面状态',
        '查看网站地图'
      ],
      action: triggerNotFound
    },
    {
      key: '500',
      title: '500 服务器错误',
      icon: <WarningOutlined />,
      color: '#fa541c',
      status: '500',
      subtitle: '抱歉，服务器出现错误，请稍后再试',
      description: '当服务器遇到内部错误时显示的错误页面。',
      causes: [
        '服务器内部错误',
        '数据库连接异常',
        '后端服务崩溃',
        '服务器资源不足'
      ],
      solutions: [
        '刷新页面重试',
        '稍后再试',
        '联系技术支持',
        '检查网络连接'
      ],
      action: triggerServerError
    },
    {
      key: '403',
      title: '403 权限不足',
      icon: <ExclamationCircleOutlined />,
      color: '#fa8c16',
      status: '403',
      subtitle: '抱歉，您没有权限访问此页面',
      description: '当用户没有权限访问页面时显示的错误页面。',
      causes: [
        '用户权限不足',
        '角色权限被禁用',
        '访问受限资源',
        '会话已过期'
      ],
      solutions: [
        '联系管理员获取权限',
        '重新登录账户',
        '检查用户角色设置',
        '申请相应访问权限'
      ],
      action: triggerForbidden
    },
    {
      key: 'network',
      title: '网络连接错误',
      icon: <StopOutlined />,
      color: '#ff4d4f',
      status: 'warning',
      subtitle: '网络连接失败，请检查网络设置',
      description: '当网络连接出现问题时显示的错误页面。',
      causes: [
        '网络连接中断',
        'DNS解析失败',
        '防火墙阻止连接',
        '代理服务器配置错误'
      ],
      solutions: [
        '检查网络连接',
        '重启路由器',
        '更换网络环境',
        '联系网络管理员'
      ],
      action: simulateApiError
    },
    {
      key: 'javascript',
      title: 'JavaScript 运行时错误',
      icon: <ThunderboltOutlined />,
      color: '#722ed1',
      status: 'error',
      subtitle: 'JavaScript代码执行出错',
      description: '当JavaScript代码在运行时发生错误时显示的错误信息。',
      causes: [
        '访问未定义的变量或属性',
        '类型转换错误',
        '函数调用错误',
        'DOM操作异常'
      ],
      solutions: [
        '检查代码逻辑',
        '添加类型检查',
        '使用try-catch捕获异常',
        '启用严格模式'
      ],
      action: triggerJavaScriptError
    },
    {
      key: 'promise',
      title: 'Promise 拒绝错误',
      icon: <InfoCircleOutlined />,
      color: '#faad14',
      status: 'warning',
      subtitle: '未处理的Promise拒绝',
      description: '当Promise被拒绝但没有相应处理时显示的错误信息。',
      causes: [
        '异步操作失败',
        '缺少catch处理',
        '网络请求失败',
        'API返回错误'
      ],
      solutions: [
        '添加catch处理',
        '使用async/await',
        '全局错误处理',
        '检查异步操作逻辑'
      ],
      action: triggerPromiseRejection
    }
  ]

  return (
    <div className={styles.errorDemoContainer}>
      <Card className={styles.errorDemoCard}>
        <div className={styles.errorDemoHeader}>
          <Title level={2} className={styles.errorDemoTitle}>
            错误页面演示
          </Title>
          <Paragraph className={styles.errorDemoDescription}>
            本页面用于演示系统中各种错误类型的处理方式，包括页面级错误和内联错误。
            通过点击下方按钮可以触发不同类型的错误，以验证系统的错误处理机制。
          </Paragraph>
        </div>

        <Alert
          message="错误处理说明"
          description="系统实现了完整的错误处理机制，包括页面级错误和内联错误两种处理方式。页面级错误会跳转到专门的错误页面，内联错误会在当前页面显示错误信息。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Row gutter={[16, 16]}>
          {errorTypes.map(errorType => (
            <Col xs={24} sm={12} md={8} key={errorType.key}>
              <ErrorTypeCard errorType={errorType} loading={loading} />
            </Col>
          ))}
        </Row>

        <Divider />

        <div className={styles.inlineErrorSection}>
          <div className={styles.inlineErrorHeader}>
            <Title level={3} className={styles.inlineErrorTitle}>
              内联错误演示
            </Title>
            <Paragraph className={styles.inlineErrorDescription}>
              内联错误会在当前页面显示错误信息，不会跳转到新的页面。
              这种方式适用于表单验证错误、局部数据加载失败等场景。
            </Paragraph>
          </div>

          <InlineErrorDemo 
            showError={showError}
            hideError={hideError}
          />
        </div>

        <div className={styles.errorDemoFooter}>
          <Text type="secondary">
            错误处理机制确保了系统的稳定性和用户体验的一致性。
            所有错误都会被记录并提供相应的解决方案建议。
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default ErrorDemo