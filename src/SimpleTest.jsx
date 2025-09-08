import React from 'react'
import { Button, Card } from 'antd'

const SimpleTest = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Card title="RBAC 权限管理系统" style={{ margin: '20px' }}>
        <h2>系统正常运行！</h2>
        <p>如果您看到这个页面，说明基础配置没有问题。</p>
        <Button type="primary" onClick={() => alert('测试成功！')}>
          测试按钮
        </Button>
        <div style={{ marginTop: '20px', background: '#f0f2f5', padding: '16px' }}>
          <h3>功能状态：</h3>
          <ul>
            <li>✅ React 组件渲染正常</li>
            <li>✅ Ant Design 样式正常</li>
            <li>✅ 基础交互功能正常</li>
            <li>🔄 菜单管理功能已实现，包括左右分栏布局</li>
            <li>🔄 权限管理功能已实现，支持数据权限控制</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

export default SimpleTest