import React from 'react'
import { Card, Form, Input, Button, Alert } from 'antd'
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import styles from '../profile.module.less'

/**
 * 密码修改组件
 */
const PasswordChange = ({ loading, form, onSubmit }) => {
  return (
    <Card className={styles.passwordCard}>
      <Alert
        message="密码安全提示"
        description="为了您的账户安全，建议密码包含字母、数字和特殊字符，长度不少于8位。"
        type="info"
        showIcon
        className={styles.passwordAlert}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className={styles.passwordForm}
      >
        <Form.Item
          name="currentPassword"
          label="当前密码"
          rules={[{ required: true, message: '请输入当前密码' }]}
          className={styles.passwordFormItem}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入当前密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 8, message: '密码长度不能少于8位' },
            { 
              pattern: /^(?=.*[a-zA-Z])(?=.*\d).*$/, 
              message: '密码必须包含字母和数字' 
            }
          ]}
          className={styles.passwordFormItem}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入新密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
          className={styles.passwordFormItem}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入新密码"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.passwordSubmit}
            size="large"
          >
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default PasswordChange