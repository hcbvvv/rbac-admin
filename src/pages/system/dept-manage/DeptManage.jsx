import React, { useState } from 'react'
import { Row, Col, Card } from 'antd'
import { usePermission } from '@/hooks/usePermission'
import { useDeptManage } from './hooks/useDeptManage'
import DeptTreePanel from './components/DeptTreePanel'
import DeptDetailPanel from './components/DeptDetailPanel'
import DeptFormModal from './components/DeptFormModal'
import styles from './deptManage.module.less'

/**
 * 部门管理页面
 */
const DeptManage = () => {
  const { hasPermission } = usePermission()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  
  const {
    // 数据
    depts,
    deptTree,
    selectedDept,
    expandedKeys,
    loading,
    
    // 方法
    setExpandedKeys,
    handleSelectDept,
    handleDelete,
    handleSave,
    handleRefresh,
  } = useDeptManage()
  
  // 添加部门
  const handleAdd = (parentDept = null) => {
    setEditingDept(null)
    if (parentDept) {
      // 如果有父部门，设置parentId（在模态框中处理）
      setEditingDept({ parentId: parentDept.id })
    }
    setModalVisible(true)
  }
  
  // 编辑部门
  const handleEdit = (dept) => {
    setEditingDept(dept)
    setModalVisible(true)
  }
  
  // 保存部门
  const handleSaveDept = async (values, editingDept) => {
    const success = await handleSave(values, editingDept)
    if (success) {
      setModalVisible(false)
      setEditingDept(null)
    }
    return success
  }
  
  // 取消模态框
  const handleCancel = () => {
    setModalVisible(false)
    setEditingDept(null)
  }
  
  // 权限检查
  if (!hasPermission('dept:view')) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>您没有权限访问部门管理</h3>
          <p>请联系管理员获取相应权限</p>
        </div>
      </Card>
    )
  }
  
  return (
    <div className={styles.deptManageContainer}>
      <Row gutter={16} className={styles.deptManageRow}>
        {/* 左侧部门树 */}
        <Col xs={24} md={8} lg={6} className={styles.leftPanel}>
          <DeptTreePanel
            deptTree={deptTree}
            expandedKeys={expandedKeys}
            loading={loading}
            onSelect={handleSelectDept}
            onExpand={setExpandedKeys}
            onRefresh={handleRefresh}
            onAdd={handleAdd}
          />
        </Col>
        
        {/* 右侧部门详情 */}
        <Col xs={24} md={16} lg={18} className={styles.rightPanel}>
          <DeptDetailPanel
            selectedDept={selectedDept}
            onAddChild={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Col>
      </Row>
      
      {/* 部门表单模态框 */}
      <DeptFormModal
        visible={modalVisible}
        editingDept={editingDept}
        depts={depts}
        loading={loading}
        onSave={handleSaveDept}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default DeptManage