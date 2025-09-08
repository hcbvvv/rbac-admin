import React from 'react'
import { Button } from 'antd'

/**
 * 简单的测试组件，用于验证应用是否正常启动
 */
const TestComponent = () => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <h1>RBAC 权限管理系统</h1>
      <p>如果您看到这个页面，说明应用已经正常启动！</p>
      <Button type="primary" size="large">
        测试按钮
      </Button>
      <div style={{ marginTop: '20px' }}>
        <p>菜单管理功能已经创建完成，包括：</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>左右分栏布局设计</li>
          <li>树形菜单结构显示</li>
          <li>资源权限、按钮权限、数据权限管理</li>
          <li>数据权限支持：全部数据、部门数据、部门及下级、个人数据、自定义部门</li>
        </ul>
      </div>
    </div>
  )
}

export default TestComponent