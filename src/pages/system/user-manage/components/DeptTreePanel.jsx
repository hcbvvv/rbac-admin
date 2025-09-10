import React from 'react'
import { Card, Button, Space } from 'antd'
import { TeamOutlined, HomeOutlined } from '@ant-design/icons'
import UserManageDeptTree from '@/components/UserManageDeptTree'
import styles from '../userManage.module.less'

/**
 * 部门树面板组件
 */
const DeptTreePanel = ({
  depts,
  deptUserStats,
  selectedDeptId,
  loading,
  onDeptSelect,
  onResetDept,
}) => {
  return (
    <Card 
      title={
        <div className={styles.deptTreeHeader}>
          <Space>
            <TeamOutlined />
            <span>部门结构</span>
          </Space>
          <Button 
            type="text" 
            size="small"
            icon={<HomeOutlined />}
            onClick={onResetDept}
            title="显示全部用户"
            className={styles.resetButton}
          />
        </div>
      }
      size="small"
      className={styles.deptTreeCard}
      styles={{ 
        body: { 
          padding: '12px',
          height: 'calc(100vh - 100px)',
          overflow: 'auto'
        }
      }}
    >
      <UserManageDeptTree
        deptData={depts}
        userStats={deptUserStats}
        onSelect={onDeptSelect}
        selectedKeys={selectedDeptId ? [selectedDeptId] : []}
        loading={loading}
      />
    </Card>
  )
}

export default DeptTreePanel