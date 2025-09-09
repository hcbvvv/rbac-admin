import React, { useState } from 'react'
import { Card, Button, Space, Popconfirm, Tabs, Empty } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import BasicInfoTab from './BasicInfoTab'
import PermissionTab from './PermissionTab'
import ChildrenTab from './ChildrenTab'
import styles from '../menuManage.module.css'

/**
 * 菜单详情面板组件
 */
const MenuDetailPanel = ({
  selectedMenuInfo,
  menuTree,
  onAddChild,
  onEdit,
  onDelete,
  onPermissionConfig,
  onPermissionSave,
  onPermissionDelete,
}) => {
  const { hasPermission } = usePermission()
  const [activeTab, setActiveTab] = useState('basic')
  
  const tabItems = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <BasicInfoTab 
          menuInfo={selectedMenuInfo}
        />
      ),
    },
    {
      key: 'permissions',
      label: '权限配置',
      children: (
        <PermissionTab 
          menuInfo={selectedMenuInfo}
          onPermissionSave={onPermissionSave}
          onPermissionDelete={onPermissionDelete}
        />
      ),
    },
    {
      key: 'children',
      label: '子菜单',
      children: (
        <ChildrenTab 
          menuInfo={selectedMenuInfo}
          menuTree={menuTree}
        />
      ),
    },
  ]
  
  return (
    <Card
      title="菜单详情"
      extra={
        selectedMenuInfo && (
          <Space>
            {hasPermission('menu:create') && (
              <Button 
                icon={<PlusOutlined />}
                onClick={() => onAddChild(selectedMenuInfo)}
              >
                添加子菜单
              </Button>
            )}
            {hasPermission('menu:edit') && (
              <Button 
                icon={<SafetyOutlined />}
                onClick={() => onPermissionConfig(selectedMenuInfo)}
              >
                权限配置
              </Button>
            )}
            {hasPermission('menu:edit') && (
              <Button 
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit(selectedMenuInfo)}
              >
                编辑
              </Button>
            )}
            {hasPermission('menu:delete') && (
              <Popconfirm
                title="确定要删除这个菜单吗？"
                description="删除后将无法恢复，请谨慎操作"
                onConfirm={() => onDelete(selectedMenuInfo)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  danger
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        )
      }
      className={styles.menuDetailCard}
    >
      {selectedMenuInfo ? (
        <Tabs 
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.menuDetailTabs}
        />
      ) : (
        <div className={styles.menuDetailEmpty}>
          <Empty 
            description="请在左侧选择菜单查看详情" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </Card>
  )
}

export default MenuDetailPanel