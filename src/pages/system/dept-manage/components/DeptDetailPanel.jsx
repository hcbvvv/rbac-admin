import React from 'react'
import { Card, Button, Space, Popconfirm, Descriptions, Tag, Empty } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import { DEPT_TYPE_OPTIONS, DEPT_STATUS_OPTIONS } from '@/constants'
import styles from '../deptManage.module.less'

/**
 * 部门详情面板组件
 */
const DeptDetailPanel = ({
  selectedDept,
  onAddChild,
  onEdit,
  onDelete,
}) => {
  const { hasPermission } = usePermission()
  
  return (
    <Card
      title={
        <div className={styles.deptDetailHeader}>
          <span className={styles.deptDetailTitle}>部门详情</span>
        </div>
      }
      extra={
        selectedDept && (
          <Space className={styles.deptDetailExtra}>
            {hasPermission('dept:create') && (
              <Button 
                icon={<PlusOutlined />}
                onClick={() => onAddChild(selectedDept)}
              >
                添加子部门
              </Button>
            )}
            {hasPermission('dept:edit') && (
              <Button 
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit(selectedDept)}
              >
                编辑
              </Button>
            )}
            {hasPermission('dept:delete') && selectedDept.type !== 'company' && (
              <Popconfirm
                title="确定要删除这个部门吗？"
                description="删除后将无法恢复，请谨慎操作"
                onConfirm={() => onDelete(selectedDept)}
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
      className={styles.deptDetailCard}
      styles={{
        body: {
          padding: '24px'
        }
      }}
    >
      {selectedDept ? (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="部门名称">
            {selectedDept.name}
          </Descriptions.Item>
          <Descriptions.Item label="部门编码">
            {selectedDept.code}
          </Descriptions.Item>
          <Descriptions.Item label="部门类型">
            <Tag color="blue">
              {DEPT_TYPE_OPTIONS.find(item => item.value === selectedDept.type)?.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={selectedDept.status === 'active' ? 'green' : 'red'}>
              {DEPT_STATUS_OPTIONS.find(item => item.value === selectedDept.status)?.label}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="负责人">
            {selectedDept.leaderName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            {selectedDept.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {selectedDept.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="排序">
            {selectedDept.sort}
          </Descriptions.Item>
          <Descriptions.Item label="地址" span={2}>
            {selectedDept.address || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {selectedDept.description || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={2}>
            {selectedDept.createdAt}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div className={styles.deptDetailEmpty}>
          <Empty 
            description="请在左侧选择部门查看详情" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </Card>
  )
}

export default DeptDetailPanel