import React, { useState } from 'react'
import { Card, Button, Space, Alert, Divider, Typography, Row, Col, Menu, Switch, Tooltip, Result, Badge } from 'antd'
import { 
  ExclamationCircleOutlined, 
  BugOutlined, 
  WarningOutlined, 
  MenuOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  StopOutlined,
  CloseCircleOutlined,
  CustomerServiceOutlined,
  ReloadOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { captureError } from '@/utils/errorHandler'
import { useErrorStore } from '@/stores/error'

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
        '服务器无响应',
        'DNS解析失败',
        '防火墙阻止连接'
      ],
      solutions: [
        '检查网络连接',
        '重启网络设备',
        '联系网络管理员',
        '尝试使用移动网络'
      ],
      action: () => console.log('模拟网络错误')
    },
    {
      key: 'timeout',
      title: '请求超时',
      icon: <CloseCircleOutlined />,
      color: '#faad14',
      status: 'error',
      subtitle: '请求处理超时，请稍后重试',
      description: '当请求处理时间过长时显示的错误页面。',
      causes: [
        '服务器响应缓慢',
        '网络延迟过高',
        '处理数据量过大',
        '服务器负载过高'
      ],
      solutions: [
        '稍后重试',
        '减少请求数据量',
        '优化网络环境',
        '联系技术支持'
      ],
      action: () => simulateApiError()
    },
    {
      key: 'javascript',
      title: 'JavaScript错误',
      icon: <CodeOutlined />,
      color: '#f5222d',
      status: '500',
      subtitle: '代码执行异常，系统错误',
      description: '当JavaScript代码执行出现异常时显示的错误页面。',
      causes: [
        '空指针引用',
        '类型错误',
        '函数不存在',
        '语法错误'
      ],
      solutions: [
        '刷新页面重试',
        '清空浏览器缓存',
        '联系技术支持',
        '更新浏览器版本'
      ],
      action: triggerJavaScriptError
    },
    {
      key: 'promise',
      title: 'Promise拒绝错误',
      icon: <ThunderboltOutlined />,
      color: '#eb2f96',
      status: '500',
      subtitle: '未处理的Promise异常',
      description: '当Promise被拒绝且未被捕获时显示的错误页面。',
      causes: [
        '异步操作失败',
        '网络请求被拒绝',
        '数据处理异常',
        '服务不可用'
      ],
      solutions: [
        '检查错误原因',
        '重新尝试操作',
        '联系技术支持',
        '检查服务状态'
      ],
      action: triggerPromiseRejection
    }
  ]











  // 渲染卡片布局（原有模式）
  const renderCardLayout = () => {
    return (
      <div style={{ padding: '0' }}>
        <Card>
          <Alert
            message="演示说明"
            description="这是一个错误页面演示组件，用于展示系统中不同类型的错误页面效果。点击下面的按钮可以查看相应的错误页面。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={[16, 16]}>
            {/* 404 错误演示 */}
            <Col xs={24} sm={12} lg={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <BugOutlined style={{ color: '#722ed1' }} />
                    <span>404 页面不存在</span>
                  </Space>
                }
                hoverable
              >
                <Typography.Paragraph>
                  当用户访问不存在的页面时显示的错误页面。
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <Typography.Text strong>触发条件：</Typography.Text>
                  <br />
                  • 访问未定义的路由
                  <br />
                  • 页面路径输入错误
                  <br />
                  • 资源已被删除或移动
                </Typography.Paragraph>
                <Button 
                  type="primary" 
                  danger 
                  onClick={triggerNotFound}
                  block
                >
                  查看 404 页面
                </Button>
              </Card>
            </Col>

            {/* 500 错误演示 */}
            <Col xs={24} sm={12} lg={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <WarningOutlined style={{ color: '#fa541c' }} />
                    <span>500 服务器错误</span>
                  </Space>
                }
                hoverable
              >
                <Typography.Paragraph>
                  当服务器遇到内部错误时显示的错误页面。
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <Typography.Text strong>触发条件：</Typography.Text>
                  <br />
                  • 服务器内部错误
                  <br />
                  • 数据库连接异常
                  <br />
                  • 后端服务崩溃
                </Typography.Paragraph>
                <Button 
                  type="primary" 
                  danger 
                  onClick={triggerServerError}
                  block
                >
                  查看 500 页面
                </Button>
              </Card>
            </Col>

            {/* 403 权限不足演示 */}
            <Col xs={24} sm={12} lg={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <ExclamationCircleOutlined style={{ color: '#fa8c16' }} />
                    <span>403 权限不足</span>
                  </Space>
                }
                hoverable
              >
                <Typography.Paragraph>
                  当用户没有权限访问页面时显示的错误页面。
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <Typography.Text strong>触发条件：</Typography.Text>
                  <br />
                  • 用户权限不足
                  <br />
                  • 角色权限被禁用
                  <br />
                  • 访问受限资源
                </Typography.Paragraph>
                <Button 
                  type="primary" 
                  danger 
                  onClick={triggerForbidden}
                  block
                >
                  查看 403 页面
                </Button>
              </Card>
            </Col>

            {/* JavaScript错误演示 */}
            <Col xs={24} sm={12} lg={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <CodeOutlined style={{ color: '#f5222d' }} />
                    <span>JavaScript错误</span>
                  </Space>
                }
                hoverable
              >
                <Typography.Paragraph>
                  当JavaScript代码执行出现异常时显示的错误页面。
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <Typography.Text strong>触发条件：</Typography.Text>
                  <br />
                  • 空指针引用
                  <br />
                  • 类型错误
                  <br />
                  • 函数不存在
                </Typography.Paragraph>
                <Button 
                  type="primary" 
                  danger 
                  onClick={triggerJavaScriptError}
                  block
                >
                  触发 JS 错误
                </Button>
              </Card>
            </Col>

            {/* Promise拒绝错误演示 */}
            <Col xs={24} sm={12} lg={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <ThunderboltOutlined style={{ color: '#eb2f96' }} />
                    <span>Promise拒绝错误</span>
                  </Space>
                }
                hoverable
              >
                <Typography.Paragraph>
                  当Promise被拒绝且未被捕获时显示的错误页面。
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <Typography.Text strong>触发条件：</Typography.Text>
                  <br />
                  • 异步操作失败
                  <br />
                  • 网络请求被拒绝
                  <br />
                  • 数据处理异常
                </Typography.Paragraph>
                <Button 
                  type="primary" 
                  danger 
                  onClick={triggerPromiseRejection}
                  block
                >
                  触发 Promise 错误
                </Button>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Typography.Title level={3}>其他错误处理演示</Typography.Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card size="small" title="API 错误模拟">
                <Typography.Paragraph>
                  模拟API请求错误，查看控制台输出错误信息。
                </Typography.Paragraph>
                <Button 
                  type="default" 
                  loading={loading}
                  onClick={simulateApiError}
                  block
                >
                  {loading ? '模拟API错误中...' : '模拟 API 错误'}
                </Button>
              </Card>
            </Col>

            {/* 内联错误演示 */}
            <Col xs={24} md={8}>
              <Card
                size="small"
                title={
                  <Space>
                    <EyeOutlined style={{ color: '#1890ff' }} />
                    <span>内联错误显示</span>
                  </Space>
                }
              >
                <Typography.Paragraph>
                  在主布局内直接显示错误，不跳转新页面。
                </Typography.Paragraph>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    danger 
                    onClick={triggerInline500}
                    block
                    size="small"
                  >
                    内联 500 错误
                  </Button>
                  <Button 
                    type="primary" 
                    danger 
                    onClick={triggerInline403}
                    block
                    size="small"
                  >
                    内联 403 错误
                  </Button>
                  <Button 
                    type="primary" 
                    danger 
                    onClick={triggerInline404}
                    block
                    size="small"
                  >
                    内联 404 错误
                  </Button>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card size="small" title="返回操作">
                <Typography.Paragraph>
                  返回到系统的其他页面继续操作。
                </Typography.Paragraph>
                <Space wrap style={{ width: '100%' }}>
                  <Button onClick={() => navigate('/dashboard')}>
                    返回首页
                  </Button>
                  <Button onClick={() => navigate('/system/user')}>
                    用户管理
                  </Button>
                  <Button onClick={() => navigate('/system/role')}>
                    角色管理
                  </Button>
                  <Button onClick={() => hideError()}>
                    隐藏错误
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Alert
            message="开发提示"
            description={
              <div>
                <Typography.Paragraph>
                  在实际开发中，错误页面的处理建议：
                </Typography.Paragraph>
                <ul>
                  <li>提供清晰的错误信息和解决方案</li>
                  <li>记录错误日志便于问题追踪</li>
                  <li>提供友好的用户操作指引</li>
                  <li>考虑错误页面的响应式设计</li>
                  <li>添加错误上报机制</li>
                </ul>
              </div>
            }
            type="warning"
            showIcon
          />
        </Card>
      </div>
    )
  }

  return renderCardLayout()
}

export default ErrorDemo