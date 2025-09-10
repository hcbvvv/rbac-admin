import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tabs } from 'antd'
import PersonalInfo from './components/PersonalInfo'
import PasswordChange from './components/PasswordChange'
import PersonalSettings from './components/PersonalSettings'
import { useProfileManage } from './hooks/useProfileManage'
import styles from './profile.module.less'

/**
 * 个人资料页面主组件
 * 合并了个人中心和个人设置功能
 */
const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('profile')
  
  const {
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
    handleAvatarChange
  } = useProfileManage()

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

  const tabItems = [
    {
      key: 'profile',
      label: '个人信息',
      children: (
        <PersonalInfo
          user={user}
          loading={loading}
          avatarUrl={avatarUrl}
          form={profileForm}
          onSubmit={handleProfileUpdate}
          onAvatarChange={handleAvatarChange}
        />
      )
    },
    {
      key: 'password',
      label: '密码修改',
      children: (
        <PasswordChange
          loading={passwordLoading}
          form={passwordForm}
          onSubmit={handlePasswordChange}
        />
      )
    },
    {
      key: 'settings',
      label: '个人设置',
      children: (
        <PersonalSettings
          loading={loading}
          form={settingsForm}
          onSubmit={handleSettingsUpdate}
        />
      )
    }
  ]

  return (
    <div className={styles.profileContainer}>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        className={styles.profileTabs}
      />
    </div>
  )
}

export default Profile