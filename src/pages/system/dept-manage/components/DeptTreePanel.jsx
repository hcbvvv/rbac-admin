import React from 'react'
import { Card, Tree, Button, Space, Tag, Empty } from 'antd'
import { 
  PlusOutlined, 
  ReloadOutlined,
  TeamOutlined,
  FolderOutlined,
  ApartmentOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import { DEPT_STATUS_OPTIONS } from '@/constants'
import styles from '../deptManage.module.css'

/**
 * 部门树面板组件
 */
const DeptTreePanel = ({
  deptTree,
  expandedKeys,
  loading,
  onSelect,
  onExpand,
  onRefresh,
  onAdd,
}) => {
  const { hasPermission } = usePermission()
  
  // 构建树形数据
  const buildTreeData = (depts) => {
    return depts.map(dept => ({
      title: (
        <div className={styles.deptTreeNode}>
          {dept.type === 'company' && <ApartmentOutlined style={{ color: '#1890ff' }} className={styles.deptNodeIcon} />}
          {dept.type === 'department' && <FolderOutlined style={{ color: '#52c41a' }} className={styles.deptNodeIcon} />}
          {dept.type === 'team' && <TeamOutlined style={{ color: '#faad14' }} className={styles.deptNodeIcon} />}
          <span className={styles.deptNodeName}>{dept.name}</span>
          <Tag 
            color={dept.status === 'active' ? 'green' : 'red'} 
            size="small"
            className={styles.deptNodeStatus}
          >
            {dept.status === 'active' ? '正常' : '禁用'}
          </Tag>
        </div>
      ),
      key: dept.id,
      children: dept.children ? buildTreeData(dept.children) : undefined,
      data: dept,
    }))
  }
  
  const treeData = buildTreeData(deptTree)
  
  return (
    <Card
      title={
        <div className={styles.deptTreeHeader}>
          <span className={styles.deptTreeTitle}>部门结构</span>
        </div>
      }
      extra={
        <Space className={styles.deptTreeExtra}>
          <Button 
            size="small"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          />
          {hasPermission('dept:create') && (
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
      className={styles.deptTreeCard}
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
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          showIcon={false}
          blockNode
        />
      ) : (
        <Empty description="暂无部门数据" />
      )}
    </Card>
  )
}

export default DeptTreePanel