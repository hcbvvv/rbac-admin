import React from 'react'
import { List, Tag, Badge, Empty, Space } from 'antd'
import MenuIcon from '@/components/MenuIcon'
import styles from '../menuManage.module.less'

/**
 * 子菜单标签页组件
 */
const ChildrenTab = ({ menuInfo, menuTree }) => {
  if (!menuInfo) return null
  
  // 查找当前菜单的子菜单
  const findChildrenMenus = (menus, parentId) => {
    const findMenu = (items) => {
      for (const item of items) {
        if (item.id === parentId) {
          return item.children || []
        }
        if (item.children) {
          const found = findMenu(item.children)
          if (found.length > 0) return found
        }
      }
      return []
    }
    return findMenu(menus)
  }
  
  const childrenMenus = findChildrenMenus(menuTree, menuInfo.id)
  
  // 获取菜单类型标签
  const getTypeTag = (type) => {
    const typeMap = {
      directory: { label: '目录', color: 'orange' },
      menu: { label: '菜单', color: 'blue' },
      button: { label: '按钮', color: 'green' },
      api: { label: '接口', color: 'purple' }
    }
    const typeInfo = typeMap[type] || { label: type, color: 'default' }
    return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
  }
  
  return (
    <div className={styles.childrenTab}>
      {childrenMenus.length > 0 ? (
        <List
          dataSource={childrenMenus}
          renderItem={child => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  child.icon ? 
                    <MenuIcon type={child.icon} /> : 
                    <div style={{ width: 20, height: 20 }} />
                }
                title={
                  <Space>
                    <span>{child.title}</span>
                    {getTypeTag(child.type)}
                    <Tag color={child.status === 'active' ? 'green' : 'red'} size="small">
                      {child.status === 'active' ? '启用' : '禁用'}
                    </Tag>
                    {child.hidden && (
                      <Tag color="orange" size="small">隐藏</Tag>
                    )}
                  </Space>
                }
                description={
                  <div>
                    {child.path && (
                      <div style={{ marginBottom: 4 }}>
                        路径: {child.path}
                      </div>
                    )}
                    {child.permissions?.list?.length > 0 && (
                      <Badge 
                        count={child.permissions.list.length} 
                        text="个权限"
                        style={{ backgroundColor: '#52c41a' }}
                      />
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description="暂无子菜单" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  )
}

export default ChildrenTab