import React, { useState } from 'react'
import { Button, Space, List, Tag, Popconfirm, Modal, Empty } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SafetyOutlined,
  ControlOutlined,
  ApiOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import PermissionFormModal from './PermissionFormModal'
import styles from '../menuManage.module.less'

/**
 * 权限配置标签页组件
 */
const PermissionTab = ({ 
  menuInfo, 
  onPermissionSave, 
  onPermissionDelete 
}) => {
  const { hasPermission } = usePermission()
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [editingPermission, setEditingPermission] = useState(null)
  
  if (!menuInfo) return null
  
  const permissions = menuInfo.permissions?.list || []
  
  // 获取权限类型图标
  const getPermissionIcon = (type) => {
    switch (type) {
      case 'resource':
        return <SafetyOutlined style={{ color: '#1890ff' }} />
      case 'button':
        return <ControlOutlined style={{ color: '#faad14' }} />
      case 'api':
        return <ApiOutlined style={{ color: '#722ed1' }} />
      case 'data':
        return <DatabaseOutlined style={{ color: '#13c2c2' }} />
      default:
        return <SafetyOutlined />
    }
  }
  
  // 获取数据权限范围标签
  const getDataScopeTag = (dataScope) => {
    const scopeMap = {
      all: { label: '全部数据', color: 'blue' },
      dept: { label: '部门数据', color: 'green' },
      dept_sub: { label: '部门及下级', color: 'orange' },
      self: { label: '仅本人', color: 'purple' },
      custom: { label: '自定义', color: 'red' }
    }
    const scopeInfo = scopeMap[dataScope] || { label: dataScope, color: 'default' }
    return <Tag color={scopeInfo.color}>{scopeInfo.label}</Tag>
  }
  
  // 添加权限
  const handleAddPermission = () => {
    setEditingPermission(null)
    setPermissionModalVisible(true)
  }
  
  // 编辑权限
  const handleEditPermission = (permission) => {
    setEditingPermission(permission)
    setPermissionModalVisible(true)
  }
  
  // 保存权限
  const handleSavePermission = async (permissionData) => {
    const success = await onPermissionSave(menuInfo.id, permissionData)
    if (success) {
      setPermissionModalVisible(false)
      setEditingPermission(null)
    }
    return success
  }
  
  // 取消权限模态框
  const handleCancelPermission = () => {
    setPermissionModalVisible(false)
    setEditingPermission(null)
  }
  
  return (
    <div className={styles.permissionTab}>
      <div className={styles.permissionSection}>
        <div className={styles.permissionSectionHeader}>
          <h3 className={styles.permissionSectionTitle}>权限列表</h3>
          {hasPermission('menu:edit') && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddPermission}
            >
              添加权限
            </Button>
          )}
        </div>
        
        {permissions.length > 0 ? (
          <List
            className={styles.permissionList}
            dataSource={permissions}
            renderItem={permission => (
              <List.Item className={styles.permissionItem}>
                <div style={{ width: '100%' }}>
                  <div className={styles.permissionItemHeader}>
                    <div className={styles.permissionItemTitle}>
                      {getPermissionIcon(permission.type)}
                      <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
                        {permission.title}
                      </span>
                      <Tag 
                        color={permission.typeColor} 
                        className={styles.permissionItemType}
                      >
                        {permission.typeLabel}
                      </Tag>
                    </div>
                    {hasPermission('menu:edit') && (
                      <Space className={styles.permissionItemActions}>
                        <Button 
                          type="text" 
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditPermission(permission)}
                        >
                          编辑
                        </Button>
                        <Popconfirm
                          title="确定要删除这个权限吗？"
                          onConfirm={() => onPermissionDelete(menuInfo.id, permission.id)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button 
                            type="text" 
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                          >
                            删除
                          </Button>
                        </Popconfirm>
                      </Space>
                    )}
                  </div>
                  <div className={styles.permissionItemContent}>
                    <div className={styles.permissionItemDesc}>
                      权限标识: {permission.key}
                    </div>
                    {permission.description && (
                      <div className={styles.permissionItemDesc}>
                        描述: {permission.description}
                      </div>
                    )}
                    {permission.dataScope && (
                      <div className={styles.permissionItemScope}>
                        <span className={styles.permissionItemScopeLabel}>数据权限:</span>
                        {getDataScopeTag(permission.dataScope)}
                        {permission.dataScope === 'custom' && permission.customDeptIds && (
                          <span style={{ marginLeft: 8, fontSize: '12px', color: '#666' }}>
                            ({permission.customDeptIds.length}个部门)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description="暂无权限配置" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
      
      {/* 权限配置模态框 */}
      <PermissionFormModal
        visible={permissionModalVisible}
        editingPermission={editingPermission}
        onSave={handleSavePermission}
        onCancel={handleCancelPermission}
      />
    </div>
  )
}

export default PermissionTab