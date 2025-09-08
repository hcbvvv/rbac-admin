import React, { useState } from 'react'
import { Form, Input, Button, Card, message, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores'

/**
 * 登录页面组件
 */
const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuthStore()
  const [form] = Form.useForm()
  
  // 获取重定向路径
  const from = location.state?.from?.pathname || '/dashboard'
  
  // 表单提交处理
  const handleSubmit = async (values) => {
    try {
      const result = await login(values)
      
      if (result.success) {
        message.success('登录成功')
        navigate(from, { replace: true })
      } else {
        message.error(result.error || '登录失败')
      }
    } catch (error) {
      message.error('登录失败，请重试')
    }
  }
  
  // 模拟登录（演示用）
  const handleDemoLogin = (role = 'admin') => {
    const demoCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      user: { username: 'user', password: 'user123' },
    }
    
    form.setFieldsValue(demoCredentials[role])
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* 标题 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 24,
        color: 'white'
      }}>
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 'bold', 
          margin: 0,
          color: 'white'
        }}>
          RBAC 权限管理系统
        </h1>
        <p style={{ 
          fontSize: 16, 
          margin: '8px 0 0 0',
          opacity: 0.8
        }}>
          基于角色的访问控制管理平台
        </p>
      </div>
      
      {/* 登录表单 */}
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
        title="用户登录"
        headStyle={{
          textAlign: 'center',
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        {/* 演示账号 */}
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <p style={{ margin: '8px 0', color: '#666', fontSize: 14 }}>
            演示账号：
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Button 
              size="small" 
              type="link"
              onClick={() => handleDemoLogin('admin')}
            >
              管理员登录
            </Button>
            <Button 
              size="small" 
              type="link"
              onClick={() => handleDemoLogin('user')}
            >
              普通用户登录
            </Button>
          </div>
        </div>
      </Card>
      
      {/* 底部信息 */}
      <div style={{ 
        marginTop: 24, 
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14
      }}>
        <p>© 2024 RBAC权限管理系统. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Login