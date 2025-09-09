import { useState, useEffect } from 'react'
import { Form, message } from 'antd'
import { useAuthStore } from '@/stores'

/**
 * Profile页面业务逻辑Hook
 */
export const useProfileManage = () => {
  const { user, updateProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const [settingsForm] = Form.useForm()
  const [avatarUrl, setAvatarUrl] = useState('')

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
      
      message.success('密码修改成功')
      passwordForm.resetFields()
      
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

  return {
    user,
    loading,
    passwordLoading,
    avatarUrl,
    profileForm,
    passwordForm,
    settingsForm,
    handleProfileUpdate,
    handlePasswordChange,
    handleSettingsUpdate,
    handleAvatarChange,
    setAvatarUrl
  }
}