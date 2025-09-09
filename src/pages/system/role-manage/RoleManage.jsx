import React, { useState } from 'react'
import { Card } from 'antd'
import { usePermission } from '@/hooks/usePermission'
import { useRoleManage } from './hooks/useRoleManage'
import TopOperationBar from './components/TopOperationBar'
import RoleTable from './components/RoleTable'
import RoleFormModal from './components/RoleFormModal'
import PermissionConfigModal from './components/PermissionConfigModal'
import UserAssignModal from './components/UserAssignModal'
import AdvancedSearchModal from './components/AdvancedSearchModal'
import styles from './roleManage.module.css'

/**
 * 角色管理页面
 */
const RoleManage = () => {
  const { hasPermission } = usePermission()
  const [modalVisible, setModalVisible] = useState(false)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [userAssignModalVisible, setUserAssignModalVisible] = useState(false)
  const [advancedSearchModalVisible, setAdvancedSearchModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  
  const {
    // 数据
    roles,
    filteredRoles,
    basicSearchParams,
    advancedSearchParams,
    checkedPermissions,
    assignedUsers,
    availableUsers,
    loading,
    
    // 方法
    handleBasicSearch,
    handleAdvancedSearch,
    handleClearAllSearch,
    handleDelete,
    handleSave,
    handlePermissionConfig,
    handleSavePermissions,
    handleUserAssignConfig,
    handleSaveUserAssign,
    handleRefresh,
    setCheckedPermissions,
    setAssignedUsers,
  } = useRoleManage()
  
  // 添加角色
  const handleAdd = () => {
    setEditingRole(null)
    setModalVisible(true)
  }
  
  // 编辑角色
  const handleEdit = (role) => {
    setEditingRole(role)
    setModalVisible(true)
  }
  
  // 保存角色
  const handleSaveRole = async (values, editingRole) => {
    const success = await handleSave(values, editingRole)
    if (success) {
      setModalVisible(false)
      setEditingRole(null)
    }
    return success
  }
  
  // 取消角色模态框
  const handleCancelRole = () => {
    setModalVisible(false)
    setEditingRole(null)
  }
  
  // 权限配置
  const handlePermission = (role) => {
    setSelectedRole(role)
    handlePermissionConfig(role)
    setPermissionModalVisible(true)
  }
  
  // 保存权限配置
  const handleSavePermissionConfig = async () => {
    const success = await handleSavePermissions()
    if (success) {
      setPermissionModalVisible(false)
      setSelectedRole(null)
    }
  }
  
  // 取消权限配置
  const handleCancelPermission = () => {
    setPermissionModalVisible(false)
    setSelectedRole(null)
  }
  
  // 人员分配
  const handleUserAssign = (role) => {
    setSelectedRole(role)
    handleUserAssignConfig(role)
    setUserAssignModalVisible(true)
  }
  
  // 保存人员分配
  const handleSaveUserAssignConfig = async (selectedRole) => {
    const success = await handleSaveUserAssign(selectedRole)
    if (success) {
      setUserAssignModalVisible(false)
      setSelectedRole(null)
      setAssignedUsers([])
    }
  }
  
  // 取消人员分配
  const handleCancelUserAssign = () => {
    setUserAssignModalVisible(false)
    setSelectedRole(null)
    setAssignedUsers([])
  }
  
  // 高级查询
  const handleAdvancedSearchOpen = () => {
    setAdvancedSearchModalVisible(true)
  }
  
  // 执行高级查询
  const handleAdvancedSearchSubmit = (values) => {
    handleAdvancedSearch(values)
    setAdvancedSearchModalVisible(false)
  }
  
  // 取消高级查询
  const handleCancelAdvancedSearch = () => {
    setAdvancedSearchModalVisible(false)
  }
  
  // 清除高级查询条件
  const handleClearAdvancedSearch = () => {
    handleClearAllSearch()
    setAdvancedSearchModalVisible(false)
  }
  
  // 权限检查
  if (!hasPermission('role:view')) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>您没有权限访问角色管理</h3>
          <p>请联系管理员获取相应权限</p>
        </div>
      </Card>
    )
  }
  
  return (
    <div className={styles.roleManageContainer}>
      <Card 
        className={styles.roleManageCard}
        styles={{ 
          body: {
            padding: '24px',
            height: 'calc(100vh - 100px)',
            overflow: 'auto'
          }
        }}
      >
        <TopOperationBar
          basicSearchParams={basicSearchParams}
          advancedSearchParams={advancedSearchParams}
          roles={roles}
          filteredRoles={filteredRoles}
          onBasicSearch={handleBasicSearch}
          onAdvancedSearch={handleAdvancedSearchOpen}
          onClearSearch={handleClearAllSearch}
          onRefresh={handleRefresh}
          onAdd={handleAdd}
        />
        
        <RoleTable
          dataSource={filteredRoles}
          loading={loading}
          onPermissionConfig={handlePermission}
          onUserAssign={handleUserAssign}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>
      
      {/* 角色表单模态框 */}
      <RoleFormModal
        visible={modalVisible}
        editingRole={editingRole}
        loading={loading}
        onSave={handleSaveRole}
        onCancel={handleCancelRole}
      />
      
      {/* 权限配置模态框 */}
      <PermissionConfigModal
        visible={permissionModalVisible}
        selectedRole={selectedRole}
        checkedPermissions={checkedPermissions}
        loading={loading}
        onSave={handleSavePermissionConfig}
        onCancel={handleCancelPermission}
        onPermissionChange={setCheckedPermissions}
      />
      
      {/* 人员分配模态框 */}
      <UserAssignModal
        visible={userAssignModalVisible}
        selectedRole={selectedRole}
        availableUsers={availableUsers}
        assignedUsers={assignedUsers}
        loading={loading}
        onSave={handleSaveUserAssignConfig}
        onCancel={handleCancelUserAssign}
        onUserChange={setAssignedUsers}
      />
      
      {/* 高级查询模态框 */}
      <AdvancedSearchModal
        visible={advancedSearchModalVisible}
        advancedSearchParams={advancedSearchParams}
        onSearch={handleAdvancedSearchSubmit}
        onCancel={handleCancelAdvancedSearch}
        onClear={handleClearAdvancedSearch}
      />
    </div>
  )
}

export default RoleManage