import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Space, 
  message, 
  Avatar, 
  Upload, 
  Switch,
  Select,
  Row,
  Col,
  Divider,
  Alert,
  Typography,
  Badge
} from 'antd'
import { 
  UserOutlined, 
  LockOutlined, 
  SettingOutlined,
  CameraOutlined,
  SaveOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { useAuthStore } from '@/stores'
import { DeptSelector } from '@/components'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Option } = Select

// CSS 样式
const avatarStyles = `
  .avatar-uploader:hover .avatar-overlay {
    opacity: 1 !important;
  }
  .avatar-uploader .ant-upload {
    border: none !important;
    background: transparent !important;
  }
`

// 动态添加样式
if (typeof document !== 'undefined') {
  const styleId = 'profile-avatar-styles'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = avatarStyles
    document.head.appendChild(style)
  }
}

/**
 * 个人资料页面
 * 合并了个人中心和个人设置功能
 */
const Profile = () => {
  const { user, updateProfile } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [settingsForm] = Form.useForm()
  const [avatarUrl, setAvatarUrl] = useState('')

  // 初始化标签页
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'password', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // 标签页切换
  const handleTabChange = (key) => {
    setActiveTab(key)
    setSearchParams({ tab: key })
  }

  // 初始化表单数据
  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        deptId: user.deptId,
        jobTitle: user.jobTitle || '',
        description: user.description || ''
      })
      
      settingsForm.setFieldsValue({
        language: user.settings?.language || 'zh-CN',
        theme: user.settings?.theme || 'light',
        emailNotification: user.settings?.emailNotification ?? true,
        smsNotification: user.settings?.smsNotification ?? false,
        systemNotification: user.settings?.systemNotification ?? true,
        autoLogout: user.settings?.autoLogout ?? 30
      })

      setAvatarUrl(user.avatar || '')
    }
  }, [user, profileForm, settingsForm])

  // 更新个人信息
  const handleProfileUpdate = async (values) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新用户信息
      await updateProfile({
        ...values,
        avatar: avatarUrl
      })
      
      message.success('个人信息更新成功')
    } catch (error) {
      message.error('更新失败，请重试')
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 修改密码
  const handlePasswordChange = async (values) => {
    try {
      setPasswordLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success('密码修改成功，请重新登录')
      passwordForm.resetFields()
      
      // 这里可以选择是否强制重新登录
      // logout()
      // navigate('/login')
      
    } catch (error) {
      message.error('密码修改失败，请重试')
      console.error('Password change error:', error)
    } finally {
      setPasswordLoading(false)
    }
  }

  // 更新个人设置
  const handleSettingsUpdate = async (values) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 更新用户设置
      await updateProfile({
        settings: values
      })
      
      message.success('设置保存成功')
    } catch (error) {
      message.error('设置保存失败，请重试')
      console.error('Settings update error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 头像上传处理
  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // 获取上传结果
      setAvatarUrl(info.file.response?.url || URL.createObjectURL(info.file.originFileObj))
      setLoading(false)
      message.success('头像上传成功')
    }
    if (info.file.status === 'error') {
      setLoading(false)
      message.error('头像上传失败')
    }
  }

  // 头像上传前检查
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB')
      return false
    }
    return true
  }

  // 个人信息表单
  const ProfileForm = () => (
    <Form
      form={profileForm}
      layout="vertical"
      onFinish={handleProfileUpdate}
    >
      <Row gutter={24}>
        <Col xs={24} sm={24} md={8}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-block', position: 'relative' }}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/api/upload/avatar"
                beforeUpload={beforeUpload}
                onChange={handleAvatarChange}
                style={{ 
                  display: 'inline-block',
                  border: 'none',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}
              >
                {avatarUrl || user?.avatar ? (
                  <div style={{ position: 'relative' }}>
                    <Avatar size={120} src={avatarUrl || user?.avatar} />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                    className="avatar-overlay"
                    >
                      <CameraOutlined style={{ color: 'white', fontSize: 24 }} />
                    </div>
                  </div>
                ) : (
                  <div style={{
                    width: 120,
                    height: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed #d9d9d9',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}>
                    <CameraOutlined style={{ fontSize: 24, marginBottom: 8, color: '#999' }} />
                    <div style={{ color: '#999', fontSize: 12 }}>上传头像</div>
                  </div>
                )}
              </Upload>
            </div>
            <div style={{ marginTop: 16 }}>
              <Title level={4} style={{ margin: 0 }}>{user?.name}</Title>
              <Text type="secondary">{user?.jobTitle || '暂无职位'}</Text>
            </div>
          </div>
        </Col>
        
        <Col xs={24} sm={24} md={16}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined />}
                  disabled
                  placeholder="用户名不可修改"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input 
                  prefix={<IdcardOutlined />}
                  placeholder="请输入姓名"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />}
                  placeholder="请输入手机号"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="deptId"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <DeptSelector 
                  prefix={<TeamOutlined />}
                  placeholder="请选择所属部门"
                  disabled
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="jobTitle"
                label="职位"
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
            
            <Col xs={24}>
              <Form.Item
                name="description"
                label="个人简介"
              >
                <Input.TextArea 
                  rows={4}
                  placeholder="请输入个人简介"
                  showCount
                  maxLength={200}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
            >
              保存信息
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  // 密码修改表单
  const PasswordForm = () => (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Alert
        message="安全提示"
        description="为了您的账户安全，请定期修改密码，密码应包含字母、数字和特殊字符。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordChange}
      >
        <Form.Item
          name="currentPassword"
          label="当前密码"
          rules={[{ required: true, message: '请输入当前密码' }]}
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
            { min: 6, message: '密码至少6个字符' },
            { 
              pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, 
              message: '密码必须包含字母和数字' 
            }
          ]}
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
            loading={passwordLoading}
            block
            size="large"
          >
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  )

  // 个人设置表单
  const SettingsForm = () => (
    <Form
      form={settingsForm}
      layout="vertical"
      onFinish={handleSettingsUpdate}
      onValuesChange={handleSettingsUpdate}
    >
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <Card title="界面设置" size="small">
            <Form.Item
              name="language"
              label="语言设置"
            >
              <Select>
                <Option value="zh-CN">简体中文</Option>
                <Option value="en-US">English</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="theme"
              label="主题模式"
            >
              <Select>
                <Option value="light">浅色模式</Option>
                <Option value="dark">深色模式</Option>
                <Option value="auto">自动切换</Option>
              </Select>
            </Form.Item>
          </Card>
        </Col>
        
        <Col xs={24} sm={12}>
          <Card title="通知设置" size="small">
            <Form.Item
              name="emailNotification"
              label="邮件通知"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="开启" 
                unCheckedChildren="关闭"
              />
            </Form.Item>
            
            <Form.Item
              name="smsNotification"
              label="短信通知"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="开启" 
                unCheckedChildren="关闭"
              />
            </Form.Item>
            
            <Form.Item
              name="systemNotification"
              label="系统通知"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="开启" 
                unCheckedChildren="关闭"
              />
            </Form.Item>
          </Card>
        </Col>
        
        <Col xs={24}>
          <Card title="安全设置" size="small">
            <Form.Item
              name="autoLogout"
              label="自动登出时间（分钟）"
            >
              <Select>
                <Option value={15}>15分钟</Option>
                <Option value={30}>30分钟</Option>
                <Option value={60}>1小时</Option>
                <Option value={120}>2小时</Option>
                <Option value={0}>不自动登出</Option>
              </Select>
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Form>
  )

  return (
    <div style={{ padding: 24 }}>
      <Card styles={{body:{height:'calc(100vh - 146px)'}}}>
        <Tabs 
          activeKey={activeTab}
          onChange={handleTabChange}
          size="large"
          items={[
            {
              key: 'profile',
              label: (
                <Space>
                  <UserOutlined />
                  个人信息
                </Space>
              ),
              children: <ProfileForm />
            },
            {
              key: 'password',
              label: (
                <Space>
                  <LockOutlined />
                  密码修改
                </Space>
              ),
              children: <PasswordForm />
            },
            {
              key: 'settings',
              label: (
                <Space>
                  <SettingOutlined />
                  个人设置
                </Space>
              ),
              children: <SettingsForm />
            }
          ]}
        />
      </Card>
    </div>
  )
}

export default Profile