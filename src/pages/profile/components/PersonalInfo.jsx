import React from 'react'
import { Card, Form, Input, Button, Avatar, Upload, Row, Col, Typography } from 'antd'
import { UserOutlined, CameraOutlined, SaveOutlined, PhoneOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons'
import { DeptSelector } from '@/components'
import styles from '../profile.module.css'

const { Title } = Typography

/**
 * 个人信息组件
 */
const PersonalInfo = ({ user, loading, avatarUrl, form, onSubmit, onAvatarChange }) => {
  return (
    <Card className={styles.profileCard}>
      {/* 头像部分 */}
      <div className={styles.avatarSection}>
        <Upload
          name="avatar"
          listType="picture-card"
          className={styles.avatarUploader}
          showUploadList={false}
          action="/api/upload/avatar"
          onChange={onAvatarChange}
        >
          <div className={styles.avatarUploader}>
            <Avatar 
              size={120} 
              src={avatarUrl} 
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.avatarOverlay}>
              <CameraOutlined style={{ fontSize: 24, color: 'white' }} />
            </div>
          </div>
        </Upload>
        <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
          {user?.name || user?.username}
        </Title>
        <p style={{ color: '#666', margin: 0 }}>
          {user?.roles?.[0]?.name || '普通用户'}
        </p>
      </div>

      {/* 表单部分 */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        className={styles.profileForm}
      >
        <Row gutter={[24, 0]} className={styles.formRow}>
          <Col xs={24} md={12}>
            <Form.Item
              name="username"
              label="用户名"
              className={styles.formItem}
            >
              <Input 
                prefix={<UserOutlined />}
                disabled
                placeholder="用户名"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
              className={styles.formItem}
            >
              <Input 
                prefix={<IdcardOutlined />}
                placeholder="请输入姓名"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]} className={styles.formRow}>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
              className={styles.formItem}
            >
              <Input 
                prefix={<MailOutlined />}
                placeholder="请输入邮箱"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
              ]}
              className={styles.formItem}
            >
              <Input 
                prefix={<PhoneOutlined />}
                placeholder="请输入手机号"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]} className={styles.formRow}>
          <Col xs={24} md={12}>
            <Form.Item
              name="deptId"
              label="所属部门"
              className={styles.formItem}
            >
              <DeptSelector placeholder="请选择所属部门" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="jobTitle"
              label="职位"
              className={styles.formItem}
            >
              <Input placeholder="请输入职位" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="个人简介"
          className={styles.formItem}
        >
          <Input.TextArea 
            rows={4}
            placeholder="请输入个人简介"
            showCount
            maxLength={200}
          />
        </Form.Item>

        <div className={styles.submitSection}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
          >
            保存个人信息
          </Button>
        </div>
      </Form>
    </Card>
  )
}

export default PersonalInfo