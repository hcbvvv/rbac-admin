import React, { useState } from 'react'
import { Card, Button, Space, Alert, Typography, Row, Col, Switch, Tooltip, Result } from 'antd'
import { 
  ExclamationCircleOutlined, 
  ArrowLeftOutlined,
  HomeOutlined,
  EyeOutlined
} from '@ant-design/icons'

const { Title } = Typography

/**
 * 错误页面演示测试组件（简化版）
 */
const ErrorDemoTest = () => {
  const [displayMode, setDisplayMode] = useState('inline') // 'inline' | 'fullscreen'
  const [layoutMode, setLayoutMode] = useState('card') // 'card' | 'sidebar'

  // 切换显示模式
  const handleDisplayModeChange = (checked) => {
    setDisplayMode(checked ? 'fullscreen' : 'inline')
  }

  // 切换布局模式
  const handleLayoutModeChange = (checked) => {
    setLayoutMode(checked ? 'sidebar' : 'card')
  }

  // 退出全屏模式
  const exitFullscreenMode = () => {
    setDisplayMode('inline')
  }

  // 全屏模式的渲染函数
  const renderFullscreenMode = () => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        zIndex: 9999,
        padding: '20px',
        overflow: 'auto'
      }}>
        {/* 全屏模式头部 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                  错误页面演示测试（全屏模式）
                </Typography.Title>
                <Alert
                  message="全屏显示模式"
                  type="success"
                  size="small"
                  showIcon
                />
              </Space>
            </Col>
            <Col>
              <Space>
                <Typography.Text>布局模式：</Typography.Text>
                <Tooltip title="切换布局显示方式">
                  <Switch
                    checked={layoutMode === 'sidebar'}
                    onChange={handleLayoutModeChange}
                    checkedChildren="侧边栏"
                    unCheckedChildren="卡片"
                  />
                </Tooltip>
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={exitFullscreenMode}
                >
                  退出全屏
                </Button>
                <Button 
                  type="primary"
                  icon={<HomeOutlined />}
                  onClick={() => console.log('返回首页')}
                >
                  返回首页
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        
        {/* 全屏模式内容 */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {renderContent()}
        </div>
      </div>
    )
  }

  // 内联模式的渲染函数
  const renderInlineMode = () => {
    return (
      <div>
        {/* 内联模式切换控制 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                  错误页面演示测试
                </Typography.Title>
                <Alert
                  message="主布局内显示模式"
                  type="info"
                  size="small"
                  showIcon
                />
              </Space>
            </Col>
            <Col>
              <Space>
                <Typography.Text>显示模式：</Typography.Text>
                <Tooltip title="切换到全屏显示模式">
                  <Switch
                    checked={displayMode === 'fullscreen'}
                    onChange={handleDisplayModeChange}
                    checkedChildren="全屏"
                    unCheckedChildren="内联"
                  />
                </Tooltip>
                <Typography.Text>布局模式：</Typography.Text>
                <Tooltip title="切换布局显示方式">
                  <Switch
                    checked={layoutMode === 'sidebar'}
                    onChange={handleLayoutModeChange}
                    checkedChildren="侧边栏"
                    unCheckedChildren="卡片"
                  />
                </Tooltip>
                <Button 
                  type="primary"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => setDisplayMode('fullscreen')}
                >
                  全屏演示
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        
        {/* 内联模式内容 */}
        {renderContent()}
      </div>
    )
  }

  // 渲染内容
  const renderContent = () => {
    if (layoutMode === 'sidebar') {
      return renderSidebarLayout()
    } else {
      return renderCardLayout()
    }
  }

  // 渲染侧边栏布局
  const renderSidebarLayout = () => {
    return (
      <Row gutter={16}>
        <Col xs={24} sm={24} md={6} lg={6} xl={5}>
          <Card 
            title="侧边栏菜单"
            size="small"
            style={{ height: '400px' }}
          >
            <p>这是侧边栏布局模式</p>
            <p>左侧是菜单，右侧是内容</p>
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={18} lg={18} xl={19}>
          <Card title="错误详情">
            <Result
              status="500"
              title="500"
              subTitle="这是侧边栏模式下的错误展示"
              extra={[
                <Button type="primary" key="console">
                  侧边栏模式测试
                </Button>
              ]}
            />
          </Card>
        </Col>
      </Row>
    )
  }

  // 渲染卡片布局
  const renderCardLayout = () => {
    return (
      <Card>
        <Alert
          message="测试说明"
          description="这是一个简化的错误页面演示测试组件，用于验证布局模式切换功能是否正常工作。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              size="small"
              title="卡片模式测试 1"
              hoverable
            >
              <p>这是卡片布局模式</p>
              <Button type="primary" block>
                测试按钮 1
              </Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              size="small"
              title="卡片模式测试 2"
              hoverable
            >
              <p>布局模式可以切换</p>
              <Button type="primary" block>
                测试按钮 2
              </Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              size="small"
              title="卡片模式测试 3"
              hoverable
            >
              <p>支持全屏和内联显示</p>
              <Button type="primary" block>
                测试按钮 3
              </Button>
            </Card>
          </Col>
        </Row>

        <Alert
          message="功能正常"
          description="如果你能看到这个消息，说明组件渲染正常，布局模式切换功能可用。"
          type="success"
          showIcon
          style={{ marginTop: 24 }}
        />
      </Card>
    )
  }

  return (
    <>
      {displayMode === 'fullscreen' ? renderFullscreenMode() : renderInlineMode()}
    </>
  )
}

export default ErrorDemoTest