import React from 'react'
import { Form, Input, Button, Card, message, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import DemoLogin from './DemoLogin'
import styles from '../login.module.less'

/**
 * 登录表单组件
 */
const LoginForm = () => {
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
  
  return (
    <Card
      className={styles.loginCard}
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
        className={styles.loginForm}
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' },
          ]}
          className={styles.formItem}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            size="large"
            className={styles.inputField}
          />
        </Form.Item>
        
        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' },
          ]}
          className={styles.formItem}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密码"
            size="large"
            className={styles.inputField}
          />
        </Form.Item>
        
        <Form.Item name="remember" valuePropName="checked" className={styles.formItem}>
          <Checkbox>记住我</Checkbox>
        </Form.Item>
        
        <Form.Item className={styles.formItem}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            className={styles.submitButton}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      
      {/* 演示账号组件 */}
      <DemoLogin form={form} />
    </Card>
  )
}

export default LoginForm