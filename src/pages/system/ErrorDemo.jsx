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
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

/**
 * 错误页面演示组件
 */
const ErrorDemo = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [layoutMode, setLayoutMode] = useState('card') // 'card' | 'sidebar'
  const [selectedErrorType, setSelectedErrorType] = useState('404')

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
      // 这里可以显示错误提示或跳转到错误页面
    } finally {
      setLoading(false)
    }
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
    }
  ]

  // 获取当前选中的错误类型配置
  const currentErrorType = errorTypes.find(type => type.key === selectedErrorType) || errorTypes[0]

  // 切换布局模式
  const handleLayoutChange = (checked) => {
    setLayoutMode(checked ? 'sidebar' : 'card')
  }

  // 错误类型菜单项
  const menuItems = errorTypes.map(errorType => ({
    key: errorType.key,
    icon: React.cloneElement(errorType.icon, { style: { color: errorType.color } }),
    label: (
      <Space>
        <span>{errorType.title}</span>
        <Badge 
          count={errorType.key} 
          style={{ 
            backgroundColor: errorType.color,
            fontSize: '10px',
            height: '16px',
            lineHeight: '16px',
            minWidth: '16px'
          }} 
        />
      </Space>
    ),
  }))

  // 渲染错误详情内容
  const renderErrorDetail = () => {
    return (
      <Card 
        title={
          <Space>
            {React.cloneElement(currentErrorType.icon, { style: { color: currentErrorType.color } })}
            <span>{currentErrorType.title}</span>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            danger
            onClick={currentErrorType.action}
            loading={currentErrorType.key === 'timeout' && loading}
          >
            {currentErrorType.key === 'timeout' && loading ? '处理中...' : '触发演示'}
          </Button>
        }
      >
        <div style={{ marginBottom: 24 }}>
          <Result
            status={currentErrorType.status}
            title={currentErrorType.status.toUpperCase()}
            subTitle={currentErrorType.subtitle}
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
                  onClick={() => window.history.back()}
                >
                  返回上页
                </Button>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => window.location.reload()}
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
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Alert
              message="错误描述"
              description={currentErrorType.description}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Alert
              message="可能原因"
              description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {currentErrorType.causes.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              }
              type="warning"
              showIcon
            />
          </Col>
          
          <Col xs={24} md={12}>
            <Alert
              message="解决方案"
              description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {currentErrorType.solutions.map((solution, index) => (
                    <li key={index}>{solution}</li>
                  ))}
                </ul>
              }
              type="success"
              showIcon
            />
          </Col>
        </Row>

        <Divider />
        
        <Alert
          message="技术信息"
          description={
            <div>
              <Typography.Text code>错误类型: {currentErrorType.key.toUpperCase()}</Typography.Text>
              <br />
              <Typography.Text code>时间戳: {new Date().toLocaleString()}</Typography.Text>
              <br />
              <Typography.Text code>用户代理: {navigator.userAgent.substring(0, 50)}...</Typography.Text>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>
    )
  }

  // 渲染侧边栏布局
  const renderSidebarLayout = () => {
    return (
      <Row gutter={16}>
        {/* 左侧错误类型菜单 */}
        <Col xs={24} sm={24} md={6} lg={6} xl={5}>
          <Card 
            title={
              <Space>
                <MenuOutlined />
                <span>错误类型</span>
              </Space>
            }
            size="small"
            style={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}
            bodyStyle={{ 
              padding: '12px 0',
              height: 'calc(100vh - 260px)',
              overflow: 'auto'
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedErrorType]}
              items={menuItems}
              onClick={({ key }) => setSelectedErrorType(key)}
              style={{ border: 'none' }}
            />
          </Card>
        </Col>
        
        {/* 右侧错误详情 */}
        <Col xs={24} sm={24} md={18} lg={18} xl={19}>
          <div style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
            {renderErrorDetail()}
          </div>
        </Col>
      </Row>
    )
  }

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

            {/* 403 错误演示 */}
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
          </Row>

          <Divider />

          <Typography.Title level={3}>其他错误处理演示</Typography.Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
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
            
            <Col xs={24} md={12}>
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

  return (
    <div>
      {/* 布局切换控制 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Typography.Title level={4} style={{ margin: 0 }}>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                错误页面演示
              </Typography.Title>
              <Alert
                message={layoutMode === 'card' ? '卡片列表模式' : '左右分栏模式'}
                type="info"
                size="small"
                showIcon
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Typography.Text>布局模式：</Typography.Text>
              <Tooltip title={layoutMode === 'card' ? '切换到侧边栏模式' : '切换到卡片模式'}>
                <Switch
                  checked={layoutMode === 'sidebar'}
                  onChange={handleLayoutChange}
                  checkedChildren={<MenuOutlined />}
                  unCheckedChildren={<AppstoreOutlined />}
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>
      
      {/* 根据布局模式渲染不同内容 */}
      {layoutMode === 'sidebar' ? renderSidebarLayout() : renderCardLayout()}
    </div>
  )
}

export default ErrorDemo