import React, { useState } from 'react'
import { Row, Col, Card } from 'antd'
import { usePermission } from '@/hooks/usePermission'
import { useUserManage } from './hooks/useUserManage'
import DeptTreePanel from './components/DeptTreePanel'
import UserListPanel from './components/UserListPanel'
import UserFormModal from './components/UserFormModal'
import styles from './userManage.module.less'

/**
 * 用户管理页面
 */
const UserManage = () => {
  const { hasPermission } = usePermission()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  const {
    // 数据
    filteredUsers,
    depts,
    deptUserStats,
    selectedDeptId,
    selectedDeptInfo,
    searchKeyword,
    loading,
    
    // 方法
    setSearchKeyword,
    handleDeptSelect,
    handleDelete,
    handleSave,
    handleRefresh,
    handleResetDept,
  } = useUserManage()
  
  // 添加用户
  const handleAdd = () => {
    setEditingUser(null)
    setModalVisible(true)
  }
  
  // 编辑用户
  const handleEdit = (user) => {
    setEditingUser(user)
    setModalVisible(true)
  }
  
  // 保存用户
  const handleSaveUser = async (values, editingUser) => {
    const success = await handleSave(values, editingUser)
    if (success) {
      setModalVisible(false)
      setEditingUser(null)
    }
    return success
  }
  
  // 取消模态框
  const handleCancel = () => {
    setModalVisible(false)
    setEditingUser(null)
  }
  
  // 权限检查
  if (!hasPermission('user:view')) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>您没有权限访问用户管理</h3>
          <p>请联系管理员获取相应权限</p>
        </div>
      </Card>
    )
  }
  
  return (
    <div className={styles.userManageContainer}>
      <Row gutter={16} className={styles.userManageRow}>
        {/* 左侧部门树 */}
        <Col xs={24} sm={24} md={6} lg={6} xl={5}>
          <DeptTreePanel
            depts={depts}
            deptUserStats={deptUserStats}
            selectedDeptId={selectedDeptId}
            loading={loading}
            onDeptSelect={handleDeptSelect}
            onResetDept={handleResetDept}
          />
        </Col>
        
        {/* 右侧用户列表 */}
        <Col xs={24} sm={24} md={18} lg={18} xl={19}>
          <UserListPanel
            filteredUsers={filteredUsers}
            selectedDeptInfo={selectedDeptInfo}
            searchKeyword={searchKeyword}
            loading={loading}
            onSearchChange={setSearchKeyword}
            onRefresh={handleRefresh}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Col>
      </Row>
      
      {/* 用户表单模态框 */}
      <UserFormModal
        visible={modalVisible}
        editingUser={editingUser}
        loading={loading}
        selectedDeptId={selectedDeptId}
        onSave={handleSaveUser}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default UserManage