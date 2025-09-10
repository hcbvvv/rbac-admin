import React from 'react'
import { Card, Tree, Button, Space, Badge, Tag, Empty } from 'antd'
import { 
  PlusOutlined, 
  ReloadOutlined,
  MenuOutlined,
  FolderOutlined,
  FileOutlined,
  ControlOutlined,
  ApiOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import MenuIcon from '@/components/MenuIcon'
import styles from '../menuManage.module.less'

/**
 * 菜单树面板组件
 */
const MenuTreePanel = ({
  menuTree,
  selectedMenuId,
  expandedKeys,
  loading,
  onSelect,
  onExpand,
  onRefresh,
  onAdd,
}) => {
  const { hasPermission } = usePermission()
  
  // 获取菜单类型图标
  const getMenuTypeIcon = (type) => {
    switch (type) {
      case 'directory':
        return <FolderOutlined style={{ color: '#faad14' }} />
      case 'menu':
        return <MenuOutlined style={{ color: '#52c41a' }} />
      case 'button':
        return <ControlOutlined style={{ color: '#fa8c16' }} />
      case 'api':
        return <ApiOutlined style={{ color: '#722ed1' }} />
      default:
        return <FileOutlined style={{ color: '#1890ff' }} />
    }
  }
  
  // 构建树形数据
  const buildTreeData = (menus) => {
    return menus.map(menu => ({
      title: (
        <div className={styles.menuTreeNode}>
          <div className={styles.menuNodeIcon}>
            {menu.icon ? <MenuIcon type={menu.icon} /> : getMenuTypeIcon(menu.type)}
          </div>
          <div className={styles.menuNodeContent}>
            <div className={styles.menuNodeTitle}>{menu.title}</div>
            {menu.path && (
              <div className={styles.menuNodePath}>{menu.path}</div>
            )}
          </div>
          <div className={styles.menuNodeBadges}>
            <Tag 
              color={menu.status === 'active' ? 'green' : 'red'} 
              size="small"
              className={styles.menuNodeStatus}
            >
              {menu.status === 'active' ? '启用' : '禁用'}
            </Tag>
            {menu.hidden && (
              <Tag color="orange" size="small">隐藏</Tag>
            )}
          </div>
        </div>
      ),
      key: menu.id,
      children: menu.children ? buildTreeData(menu.children) : undefined,
      data: menu,
    }))
  }
  
  const treeData = buildTreeData(menuTree)
  
  return (
    <Card
      title={
        <div className={styles.menuTreeHeader}>
          <span className={styles.menuTreeTitle}>菜单结构</span>
        </div>
      }
      extra={
        <Space className={styles.menuTreeExtra}>
          <Button 
            size="small"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          />
          {hasPermission('menu:create') && (
            <Button 
              size="small"
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => onAdd()}
            >
              新增
            </Button>
          )}
        </Space>
      }
      className={styles.menuTreeCard}
      styles={{
        body: {
          padding: '12px',
          height: 'calc(100vh - 140px)',
          overflow: 'auto'
        }
      }}
    >
      {treeData.length > 0 ? (
        <Tree
          treeData={treeData}
          onSelect={onSelect}
          selectedKeys={selectedMenuId ? [selectedMenuId] : []}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          showIcon={false}
          blockNode
        />
      ) : (
        <Empty description="暂无菜单数据" />
      )}
    </Card>
  )
}

export default MenuTreePanel