import React, { useState, useEffect, useMemo } from 'react'
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message,
  Popconfirm,
  Row,
  Col,
  Tree,
  Spin,
  Empty,
  Badge,
  Typography,
  Divider
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import { useDeptStore } from '@/stores'
import { DeptSelector } from '@/components'
import UserManageDeptTree from '@/components/UserManageDeptTree'
import { userAPI } from '@/api'

const { Option } = Select
const { Search } = Input
const { Title, Text } = Typography

/**
 * 用户管理页面
 */
const UserManage = () => {
  const { hasPermission } = usePermission()
  const { depts, deptTree, fetchDepts, fetchDeptTree } = useDeptStore()
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedDeptId, setSelectedDeptId] = useState(null)
  const [selectedDeptInfo, setSelectedDeptInfo] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [form] = Form.useForm()
  
  // 模拟用户数据
  const [users, setUsers] = useState([
    {
      id: '1',
      username: 'admin',
      name: '系统管理员',
      email: 'admin@example.com',
      phone: '18888888888',
      deptId: '1',
      deptName: '总公司',
      status: 'active',
      roles: ['super_admin'],
      createdAt: '2024-01-01 10:00:00',
    },
    {
      id: '2',
      username: 'user001',
      name: '张三',
      email: 'zhang@example.com',
      phone: '18666666666',
      deptId: '2',
      deptName: '技术部',
      status: 'active',
      roles: ['user'],
      createdAt: '2024-01-02 15:30:00',
    },
    {
      id: '3',
      username: 'user002',
      name: '李四',
      email: 'li@example.com',
      phone: '18777777777',
      deptId: '3',
      deptName: '前端组',
      status: 'active',
      roles: ['user'],
      createdAt: '2024-01-03 09:15:00',
    },
    {
      id: '4',
      username: 'user003',
      name: '王五',
      email: 'wang@example.com',
      phone: '18555555555',
      deptId: '4',
      deptName: '后端组',
      status: 'active',
      roles: ['user'],
      createdAt: '2024-01-04 14:20:00',
    },
    {
      id: '5',
      username: 'user004',
      name: '赵六',
      email: 'zhao@example.com',
      phone: '18444444444',
      deptId: '5',
      deptName: '人事部',
      status: 'inactive',
      roles: ['user'],
      createdAt: '2024-01-05 11:45:00',
    },
    {
      id: '6',
      username: 'user005',
      name: '孙七',
      email: 'sun@example.com',
      phone: '18333333333',
      deptId: '6',
      deptName: '财务部',
      status: 'active',
      roles: ['admin'],
      createdAt: '2024-01-06 08:30:00',
    },
    {
      id: '7',
      username: 'user006',
      name: '周八',
      email: 'zhou@example.com',
      phone: '18222222222',
      deptId: '2',
      deptName: '技术部',
      status: 'active',
      roles: ['user'],
      createdAt: '2024-01-07 16:10:00',
    },
  ])
  
  // 获取部门数据
  useEffect(() => {
    fetchDepts()
    fetchDeptTree()
  }, [fetchDepts, fetchDeptTree])
  
  // 根据选中的部门过滤用户
  const filteredUsers = useMemo(() => {
    let filtered = users
    
    // 按部门过滤
    if (selectedDeptId) {
      filtered = filtered.filter(user => user.deptId === selectedDeptId)
    }
    
    // 按关键词过滤
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(keyword) ||
        user.username.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.includes(keyword)
      )
    }
    
    return filtered
  }, [users, selectedDeptId, searchKeyword])
  
  // 部门用户统计
  const deptUserStats = useMemo(() => {
    const stats = {}
    users.forEach(user => {
      if (!stats[user.deptId]) {
        stats[user.deptId] = { total: 0, active: 0, inactive: 0 }
      }
      stats[user.deptId].total += 1
      if (user.status === 'active') {
        stats[user.deptId].active += 1
      } else {
        stats[user.deptId].inactive += 1
      }
    })
    return stats
  }, [users])
  
  // 部门树选中处理
  const handleDeptSelect = (selectedKeys, info) => {
    const deptId = selectedKeys[0]
    setSelectedDeptId(deptId)
    
    if (deptId) {
      const dept = depts.find(d => d.id === deptId)
      setSelectedDeptInfo(dept)
    } else {
      setSelectedDeptInfo(null)
    }
  }
  
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
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          )}
          {hasPermission('user:delete') && record.id !== '1' && (
            <Popconfirm
              title="确定要删除这个用户吗？"
              onConfirm={() => handleDelete(record.id)}
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
  
  // 添加用户
  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    // 如果当前选中了部门，设置为默认部门
    if (selectedDeptId) {
      form.setFieldsValue({ deptId: selectedDeptId })
    }
    setModalVisible(true)
  }
  
  // 编辑用户
  const handleEdit = (user) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setModalVisible(true)
  }
  
  // 删除用户
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id))
    message.success('用户删除成功')
  }
  
  // 保存用户
  const handleSave = async (values) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingUser) {
        // 编辑
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values }
            : user
        ))
        message.success('用户更新成功')
      } else {
        // 新增
        const newUser = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toLocaleString(),
        }
        setUsers([...users, newUser])
        message.success('用户创建成功')
      }
      
      setModalVisible(false)
      setEditingUser(null)
      form.resetFields()
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 权限检查
  if (!hasPermission('user:view')) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>您没有权限访问用户管理</h3>
          <p>请联系管理员获取相应权限</p>
        </div>
      </Card>
    )
  }
  
  return (
    <div>
      <Row gutter={16}>
        {/* 左侧部门树 */}
        <Col xs={24} sm={24} md={6} lg={6} xl={5}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <span>部门结构</span>
              </Space>
            }
            size="small"
            style={{ height: 'calc(100vh - 200px)', overflow: 'hidden' }}
            bodyStyle={{ 
              padding: '12px',
              height: 'calc(100vh - 260px)',
              overflow: 'auto'
            }}
          >
            <div style={{ marginBottom: 8 }}>
              <Button 
                type="link" 
                size="small"
                onClick={() => {
                  setSelectedDeptId(null)
                  setSelectedDeptInfo(null)
                }}
                style={{ padding: 0, height: 'auto' }}
              >
                显示全部
              </Button>
            </div>
            
            <UserManageDeptTree
              deptData={depts}
              userStats={deptUserStats}
              onSelect={handleDeptSelect}
              selectedKeys={selectedDeptId ? [selectedDeptId] : []}
              loading={loading}
            />
          </Card>
        </Col>
        
        {/* 右侧用户列表 */}
        <Col xs={24} sm={24} md={18} lg={18} xl={19}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>
                  {selectedDeptInfo ? `${selectedDeptInfo.name} - 用户列表` : '用户列表'}
                </span>
                {selectedDeptInfo && (
                  <Tag color="blue">
                    {filteredUsers.length} 人
                  </Tag>
                )}
              </Space>
            }
            extra={
              <Space>
                <Search
                  placeholder="搜索用户"
                  allowClear
                  style={{ width: 200 }}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onSearch={setSearchKeyword}
                />
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    message.info('刷新数据')
                    setSearchKeyword('')
                  }}
                >
                  刷新
                </Button>
                {hasPermission('user:create') && (
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                  >
                    新增用户
                  </Button>
                )}
              </Space>
            }
            size="small"
          >
            {/* 部门信息显示 */}
            {selectedDeptInfo && (
              <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
                <Space split={<Divider type="vertical" />}>
                  <Text>
                    <Text type="secondary">部门：</Text>
                    <Text strong>{selectedDeptInfo.name}</Text>
                  </Text>
                  <Text>
                    <Text type="secondary">总人数：</Text>
                    <Text strong>{filteredUsers.length}</Text>
                  </Text>
                  <Text>
                    <Text type="secondary">正常：</Text>
                    <Text strong style={{ color: '#52c41a' }}>
                      {filteredUsers.filter(u => u.status === 'active').length}
                    </Text>
                  </Text>
                  <Text>
                    <Text type="secondary">禁用：</Text>
                    <Text strong style={{ color: '#ff4d4f' }}>
                      {filteredUsers.filter(u => u.status === 'inactive').length}
                    </Text>
                  </Text>
                </Space>
              </div>
            )}
            
            <Table
              columns={columns}
              dataSource={filteredUsers}
              rowKey="id"
              loading={loading}
              size="small"
              locale={{
                emptyText: selectedDeptInfo ? 
                  `${selectedDeptInfo.name}暂无用户数据` : 
                  <Empty description="请选择部门查看用户" />
              }}
              pagination={{
                total: filteredUsers.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                size: 'small'
              }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 用户表单模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingUser(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          <Form.Item
            name="deptId"
            label="所属部门"
            rules={[{ required: true, message: '请选择所属部门' }]}
          >
            <DeptSelector 
              placeholder="请选择所属部门" 
              showSearch
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">正常</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="roles"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select mode="multiple" placeholder="请选择角色">
              <Option value="super_admin">超级管理员</Option>
              <Option value="admin">管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManage