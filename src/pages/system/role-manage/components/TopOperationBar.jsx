import React from 'react'
import { Space, Button, Input, Select, Alert } from 'antd'
import { 
  PlusOutlined,
  ReloadOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import styles from '../roleManage.module.css'

const { Search } = Input
const { Option } = Select

/**
 * 顶部操作栏组件
 */
const TopOperationBar = ({
  basicSearchParams,
  advancedSearchParams,
  roles,
  filteredRoles,
  onBasicSearch,
  onAdvancedSearch,
  onClearSearch,
  onRefresh,
  onAdd,
}) => {
  const { hasPermission } = usePermission()
  
  // 检查是否有查询条件
  const hasBasicSearch = Object.values(basicSearchParams).some(v => v)
  const hasAdvancedSearch = Object.values(advancedSearchParams).some(v => v)
  const hasAnySearch = hasBasicSearch || hasAdvancedSearch
  
  return (
    <div>
      <div className={styles.topOperationBar}>
        <div className={styles.leftSearchSection}>
          <h2 className={styles.pageTitle}>角色管理</h2>
          
          {/* 基础查询 */}
          <Search
            className={styles.basicSearchInput}
            placeholder="请输入角色名称"
            value={basicSearchParams.name}
            onChange={(e) => onBasicSearch({ name: e.target.value })}
            allowClear
          />
          
          <Select
            className={styles.basicSearchSelect}
            placeholder="请选择状态"
            value={basicSearchParams.status || undefined}
            onChange={(value) => onBasicSearch({ status: value || '' })}
            allowClear
          >
            <Option value="active">启用</Option>
            <Option value="inactive">禁用</Option>
          </Select>
          
          <Button 
            className={`${styles.advancedSearchButton} ${hasAdvancedSearch ? styles.advancedSearchActive : ''}`}
            icon={<FilterOutlined />}
            onClick={onAdvancedSearch}
            type={hasAdvancedSearch ? 'primary' : 'default'}
          >
            高级查询
            {hasAdvancedSearch && (
              <span style={{ marginLeft: 4, fontSize: '12px' }}>(已启用)</span>
            )}
          </Button>
          
          {hasAnySearch && (
            <Button 
              type="text" 
              onClick={onClearSearch}
              className={styles.clearFilterButton}
            >
              清除筛选
            </Button>
          )}
        </div>
        
        <Space className={styles.rightActionSection}>
          <Button 
            icon={<ReloadOutlined />}
            onClick={onRefresh}
          >
            刷新
          </Button>
          {hasPermission('role:create') && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={onAdd}
            >
              新增角色
            </Button>
          )}
        </Space>
      </div>
      
      {/* 查询结果统计 */}
      {hasAnySearch && (
        <Alert
          className={styles.searchResultAlert}
          message={`当前显示 ${filteredRoles.length} 条结果，共 ${roles.length} 条数据`}
          type="info"
          showIcon
          closable={false}
        />
      )}
    </div>
  )
}

export default TopOperationBar