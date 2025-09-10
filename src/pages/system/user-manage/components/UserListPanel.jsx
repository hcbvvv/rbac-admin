import React from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Popconfirm,
  Empty,
  Typography
} from 'antd'
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import { Input } from 'antd'
import styles from '../userManage.module.less'

const { Search } = Input
const { Text } = Typography

/**
 * 用户列表面板组件
 */
const UserListPanel = ({
  filteredUsers,
  selectedDeptInfo,
  searchKeyword,
  loading,
  onSearchChange,
  onRefresh,
  onAdd,
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
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => (
        <Space wrap>
          {roles.map(role => (
            <Tag key={role} color="blue">
              {role === 'super_admin' ? '超级管理员' : role === 'admin' ? '管理员' : '普通用户'}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {hasPermission('user:edit') && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
          )}
          {hasPermission('user:delete') && record.id !== '1' && (
            <Popconfirm
              title="确定要删除这个用户吗？"
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
    <Card
      title={
        <Space>
          <UserOutlined />
          <span>
            {selectedDeptInfo ? `${selectedDeptInfo.name} - 用户列表` : '用户列表'}
          </span>
          <Space size="small">
            <Tag color="blue">
              总计 {filteredUsers.length} 人
            </Tag>
            <Tag color="green">
              正常 {filteredUsers.filter(u => u.status === 'active').length} 人
            </Tag>
            <Tag color="red">
              禁用 {filteredUsers.filter(u => u.status === 'inactive').length} 人
            </Tag>
          </Space>
        </Space>
      }
      extra={
        <Space>
          <Search
            placeholder="搜索用户"
            allowClear
            style={{ width: 200 }}
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            onSearch={onSearchChange}
          />
          <Button 
            icon={<ReloadOutlined />}
            onClick={onRefresh}
          >
            刷新
          </Button>
          {hasPermission('user:create') && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={onAdd}
            >
              新增用户
            </Button>
          )}
        </Space>
      }
      size="small"
      className={styles.userListCard}
      styles={{ 
        body: { 
          padding: '24px',
          height: 'calc(100vh - 100px)',
          overflow: 'auto'
        }
      }}
    >
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        size="small"
        style={{ paddingBottom: '20px' }}
        locale={{
          emptyText: selectedDeptInfo ? 
            `${selectedDeptInfo.name}暂无用户数据` : 
            <Empty description="请选择部门查看用户" />
        }}
        pagination={{
          total: filteredUsers.length,
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          size: 'small'
        }}
      />
    </Card>
  )
}

export default UserListPanel