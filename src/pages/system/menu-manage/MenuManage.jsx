import React, { useState } from 'react'
import { Row, Col, Card } from 'antd'
import { usePermission } from '@/hooks/usePermission'
import { useMenuManage } from './hooks/useMenuManage'
import MenuTreePanel from './components/MenuTreePanel'
import MenuDetailPanel from './components/MenuDetailPanel'
import MenuFormModal from './components/MenuFormModal'
import styles from './menuManage.module.css'

/**
 * 菜单管理页面
 */
const MenuManage = () => {
  const { hasPermission } = usePermission()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  
  const {
    // 数据
    menus,
    menuTree,
    selectedMenuId,
    selectedMenuInfo,
    expandedKeys,
    loading,
    
    // 方法
    setExpandedKeys,
    handleSelectMenu,
    handleDelete,
    handleSave,
    handleSavePermission,
    handleDeletePermission,
    handleRefresh,
  } = useMenuManage()
  
  // 添加菜单
  const handleAdd = (parentMenu = null) => {
    setEditingMenu(null)
    if (parentMenu) {
      // 如果有父菜单，设置parentId
      setEditingMenu({ parentId: parentMenu.id })
    }
    setModalVisible(true)
  }
  
  // 编辑菜单
  const handleEdit = (menu) => {
    setEditingMenu(menu)
    setModalVisible(true)
  }
  
  // 保存菜单
  const handleSaveMenu = async (values, editingMenu) => {
    const success = await handleSave(values, editingMenu)
    if (success) {
      setModalVisible(false)
      setEditingMenu(null)
    }
    return success
  }
  
  // 取消菜单模态框
  const handleCancelMenu = () => {
    setModalVisible(false)
    setEditingMenu(null)
  }
  
  // 权限配置（这个功能在MenuDetailPanel的PermissionTab中实现）
  const handlePermissionConfig = (menu) => {
    // 这个方法主要用于未来扩展，当前权限配置在详情面板中
    console.log('配置权限:', menu)
  }
  
  // 权限检查
  if (!hasPermission('menu:view')) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>您没有权限访问菜单管理</h3>
          <p>请联系管理员获取相应权限</p>
        </div>
      </Card>
    )
  }
  
  return (
    <div className={styles.menuManageContainer}>
      <Row gutter={16} className={styles.menuManageRow}>
        {/* 左侧菜单树 */}
        <Col xs={24} lg={6} xl={5} className={styles.leftPanel}>
          <MenuTreePanel
            menuTree={menuTree}
            selectedMenuId={selectedMenuId}
            expandedKeys={expandedKeys}
            loading={loading}
            onSelect={handleSelectMenu}
            onExpand={setExpandedKeys}
            onRefresh={handleRefresh}
            onAdd={handleAdd}
          />
        </Col>
        
        {/* 右侧菜单详情 */}
        <Col xs={24} lg={18} xl={19} className={styles.rightPanel}>
          <MenuDetailPanel
            selectedMenuInfo={selectedMenuInfo}
            menuTree={menuTree}
            onAddChild={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPermissionConfig={handlePermissionConfig}
            onPermissionSave={handleSavePermission}
            onPermissionDelete={handleDeletePermission}
          />
        </Col>
      </Row>
      
      {/* 菜单表单模态框 */}
      <MenuFormModal
        visible={modalVisible}
        editingMenu={editingMenu}
        menus={menus}
        loading={loading}
        onSave={handleSaveMenu}
        onCancel={handleCancelMenu}
      />
    </div>
  )
}

export default MenuManage