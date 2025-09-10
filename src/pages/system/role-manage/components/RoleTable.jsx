import React from 'react'
import { Table, Button, Space, Tag, Popconfirm } from 'antd'
import { 
  SafetyOutlined,
  EditOutlined, 
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import styles from '../roleManage.module.less'

/**
 * 角色列表表格组件
 */
const RoleTable = ({
  dataSource,
  loading,
  onPermissionConfig,
  onUserAssign,
  onEdit,
  onDelete,
}) => {
  const { hasPermission } = usePermission()
  
  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'system' ? 'blue' : 'green'}>
          {type === 'system' ? '系统角色' : '自定义角色'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count) => <span>{count} 人</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<SafetyOutlined />}
            onClick={() => onPermissionConfig(record)}
          >
            权限配置
          </Button>
          <Button
            type="link"
            size="small"
            icon={<UserOutlined />}
            onClick={() => onUserAssign(record)}
          >
            分配人员
          </Button>
          {hasPermission('role:edit') && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
          )}
          {hasPermission('role:delete') && record.type !== 'system' && (
            <Popconfirm
              title="确定要删除这个角色吗？"
              onConfirm={() => onDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]
  
  return (
    <Table
      className={styles.roleTable}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      loading={loading}
      pagination={{
        total: dataSource.length,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
    />
  )
}

export default RoleTable