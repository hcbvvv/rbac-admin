import React, { useState,useEffect } from 'react'
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
  Tree,
  Alert,
  Typography,
  Transfer,
  Row,
  Col,
  Checkbox
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  SafetyOutlined,
  MenuOutlined,
  ControlOutlined,
  ApiOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'

const { Option } = Select
const { TextArea } = Input
const { Text } = Typography

/**
 * 角色管理页面 - 包含权限配置、人员分配、查询等功能
 */
const RoleManage = () => {
  const { hasPermission } = usePermission()
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [userAssignModalVisible, setUserAssignModalVisible] = useState(false)
  const [advancedSearchModalVisible, setAdvancedSearchModalVisible] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [checkedPermissions, setCheckedPermissions] = useState([])
  const [form] = Form.useForm()
  const [advancedSearchForm] = Form.useForm()
  
  // 查询相关状态
  const [basicSearchParams, setBasicSearchParams] = useState({
    name: '',
    status: ''
  })
  const [advancedSearchParams, setAdvancedSearchParams] = useState({
    code: '',
    type: '',
    userCountMin: '',
    userCountMax: '',
    createdAtStart: '',
    createdAtEnd: ''
  })
  const [filteredRoles, setFilteredRoles] = useState([])
  
  // 人员分配相关状态
  const [assignedUsers, setAssignedUsers] = useState([])
  const [availableUsers, setAvailableUsers] = useState([])
  
  // 模拟角色数据（移除数据权限相关字段）
  const [roles, setRoles] = useState([
    {
      id: '1',
      name: '超级管理员',
      code: 'super_admin',
      description: '拥有系统所有权限',
      type: 'system',
      status: 'active',
      userCount: 1,
      createdAt: '2024-01-01 10:00:00',
    },
    {
      id: '2',
      name: '管理员',
      code: 'admin',
      description: '拥有大部分管理权限',
      type: 'system',
      status: 'active',
      userCount: 3,
      createdAt: '2024-01-01 11:00:00',
    },
    {
      id: '3',
      name: '普通用户',
      code: 'user',
      description: '基础用户权限',
      type: 'system',
      status: 'active',
      userCount: 25,
      createdAt: '2024-01-01 12:00:00',
    },
  ])
  
  // 模拟用户数据
  const [users, setUsers] = useState([
    { id: '1', name: '张三', username: 'zhangsan', email: 'zhangsan@example.com', phone: '13800138001', deptName: '技术部', status: 'active', roleIds: ['1'] },
    { id: '2', name: '李四', username: 'lisi', email: 'lisi@example.com', phone: '13800138002', deptName: '产品部', status: 'active', roleIds: ['2'] },
    { id: '3', name: '王五', username: 'wangwu', email: 'wangwu@example.com', phone: '13800138003', deptName: '运营部', status: 'active', roleIds: ['3'] },
    { id: '4', name: '赵六', username: 'zhaoliu', email: 'zhaoliu@example.com', phone: '13800138004', deptName: '技术部', status: 'inactive', roleIds: [] },
    { id: '5', name: '孙七', username: 'sunqi', email: 'sunqi@example.com', phone: '13800138005', deptName: '人事部', status: 'active', roleIds: ['2', '3'] },
    { id: '6', name: '周八', username: 'zhouba', email: 'zhouba@example.com', phone: '13800138006', deptName: '财务部', status: 'active', roleIds: ['3'] },
    { id: '7', name: '吴九', username: 'wujiu', email: 'wujiu@example.com', phone: '13800138007', deptName: '技术部', status: 'active', roleIds: [] },
    { id: '8', name: '郑十', username: 'zhengshi', email: 'zhengshi@example.com', phone: '13800138008', deptName: '市场部', status: 'active', roleIds: ['3'] }
  ])
  
  // 初始化数据
  useEffect(() => {
    setFilteredRoles(roles)
    loadUserData()
  }, [roles])
  
  // 加载用户数据
  const loadUserData = () => {
    // 模拟加载用户数据
    setAvailableUsers(users.map(user => ({
      key: user.id,
      title: `${user.name}(${user.username})`,
      description: `${user.deptName} | ${user.email}`,
      disabled: user.status === 'inactive'
    })))
  }
  
  // 模拟权限树数据（包含目录、菜单、按钮、接口）
  const permissionTree = [
    {
      title: '系统管理',
      key: 'system',
      icon: <MenuOutlined />,
      children: [
        {
          title: '用户管理',
          key: 'user-module',
          icon: <MenuOutlined style={{ color: '#52c41a' }} />,
          children: [
            { 
              title: '用户管理页面', 
              key: '/system/user', 
              icon: <MenuOutlined style={{ color: '#52c41a' }} />
            },
            { 
              title: '新增用户', 
              key: 'user:create', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '编辑用户', 
              key: 'user:edit', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '删除用户', 
              key: 'user:delete', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '获取用户列表接口', 
              key: 'GET /api/users', 
              icon: <ApiOutlined style={{ color: '#722ed1' }} />
            },
            { 
              title: '创建用户接口', 
              key: 'POST /api/users', 
              icon: <ApiOutlined style={{ color: '#722ed1' }} />
            },
          ],
        },
        {
          title: '角色管理',
          key: 'role-module',
          icon: <MenuOutlined style={{ color: '#52c41a' }} />,
          children: [
            { 
              title: '角色管理页面', 
              key: '/system/role', 
              icon: <MenuOutlined style={{ color: '#52c41a' }} />
            },
            { 
              title: '新增角色', 
              key: 'role:create', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '编辑角色', 
              key: 'role:edit', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '删除角色', 
              key: 'role:delete', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '获取角色列表接口', 
              key: 'GET /api/roles', 
              icon: <ApiOutlined style={{ color: '#722ed1' }} />
            },
          ],
        },
        {
          title: '菜单管理',
          key: 'menu-module',
          icon: <MenuOutlined style={{ color: '#52c41a' }} />,
          children: [
            { 
              title: '菜单管理页面', 
              key: '/system/menu', 
              icon: <MenuOutlined style={{ color: '#52c41a' }} />
            },
            { 
              title: '新增菜单', 
              key: 'menu:create', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '编辑菜单', 
              key: 'menu:edit', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '删除菜单', 
              key: 'menu:delete', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '获取菜单树接口', 
              key: 'GET /api/menus/tree', 
              icon: <ApiOutlined style={{ color: '#722ed1' }} />
            },
          ],
        },
      ],
    },
  ]
  
  // 表格列定义（移除数据权限相关列）
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
            onClick={() => handlePermission(record)}
          >
            权限配置
          </Button>
          <Button
            type="link"
            size="small"
            icon={<UserOutlined />}
            onClick={() => handleUserAssign(record)}
          >
            分配人员
          </Button>
          {hasPermission('role:edit') && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          )}
          {hasPermission('role:delete') && record.type !== 'system' && (
            <Popconfirm
              title="确定要删除这个角色吗？"
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
  
  // 添加角色
  const handleAdd = () => {
    setEditingRole(null)
    form.resetFields()
    setModalVisible(true)
  }
  
  // 编辑角色
  const handleEdit = (role) => {
    setEditingRole(role)
    form.setFieldsValue(role)
    setModalVisible(true)
  }
  
  // 删除角色
  const handleDelete = (id) => {
    setRoles(roles.filter(role => role.id !== id))
    message.success('角色删除成功')
  }
  
  // 权限配置
  const handlePermission = (role) => {
    setSelectedRole(role)
    // 模拟获取角色已有权限
    setCheckedPermissions(['user:view', 'user:create'])
    setPermissionModalVisible(true)
  }
  
  // 人员分配
  const handleUserAssign = (role) => {
    setSelectedRole(role)
    // 获取当前角色已分配的用户
    const assignedUserIds = users.filter(user => user.roleIds.includes(role.id)).map(user => user.id)
    setAssignedUsers(assignedUserIds)
    setUserAssignModalVisible(true)
  }
  
  // 保存人员分配
  const handleSaveUserAssign = async () => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新用户角色关系
      const updatedUsers = users.map(user => {
        const newRoleIds = [...user.roleIds.filter(id => id !== selectedRole.id)]
        if (assignedUsers.includes(user.id)) {
          newRoleIds.push(selectedRole.id)
        }
        return { ...user, roleIds: newRoleIds }
      })
      
      setUsers(updatedUsers)
      
      // 更新角色的用户数量
      const updatedRoles = roles.map(role => {
        if (role.id === selectedRole.id) {
          const userCount = updatedUsers.filter(user => user.roleIds.includes(role.id)).length
          return { ...role, userCount }
        }
        return role
      })
      
      setRoles(updatedRoles)
      setFilteredRoles(updatedRoles)
      
      message.success('人员分配保存成功')
      setUserAssignModalVisible(false)
      setSelectedRole(null)
    } catch (error) {
      message.error('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 基础查询功能（实时查询）
  const handleBasicSearch = (params) => {
    const newBasicParams = { ...basicSearchParams, ...params }
    setBasicSearchParams(newBasicParams)
    performSearch(newBasicParams, advancedSearchParams)
  }
  
  // 高级查询功能
  const handleAdvancedSearch = (values) => {
    setAdvancedSearchParams(values)
    performSearch(basicSearchParams, values)
    setAdvancedSearchModalVisible(false)
    message.success('高级查询条件已应用')
  }
  
  // 执行查询
  const performSearch = (basic, advanced) => {
    let filtered = roles
    
    // 基础查询条件
    if (basic.name) {
      filtered = filtered.filter(role => 
        role.name.toLowerCase().includes(basic.name.toLowerCase())
      )
    }
    
    if (basic.status) {
      filtered = filtered.filter(role => role.status === basic.status)
    }
    
    // 高级查询条件
    if (advanced.code) {
      filtered = filtered.filter(role => 
        role.code.toLowerCase().includes(advanced.code.toLowerCase())
      )
    }
    
    if (advanced.type) {
      filtered = filtered.filter(role => role.type === advanced.type)
    }
    
    if (advanced.userCountMin) {
      filtered = filtered.filter(role => role.userCount >= parseInt(advanced.userCountMin))
    }
    
    if (advanced.userCountMax) {
      filtered = filtered.filter(role => role.userCount <= parseInt(advanced.userCountMax))
    }
    
    // 日期范围查询可以在这里扩展
    
    setFilteredRoles(filtered)
  }
  
  // 清除所有查询条件
  const handleClearAllSearch = () => {
    setBasicSearchParams({ name: '', status: '' })
    setAdvancedSearchParams({ code: '', type: '', userCountMin: '', userCountMax: '', createdAtStart: '', createdAtEnd: '' })
    advancedSearchForm.resetFields()
    setFilteredRoles(roles)
    message.info('已清除所有查询条件')
  }
  

  
  // 保存角色
  const handleSave = async (values) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingRole) {
        // 编辑
        setRoles(roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...values }
            : role
        ))
        message.success('角色更新成功')
      } else {
        // 新增
        const newRole = {
          id: Date.now().toString(),
          ...values,
          type: 'custom',
          userCount: 0,
          createdAt: new Date().toLocaleString(),
        }
        setRoles([...roles, newRole])
        message.success('角色创建成功')
      }
      
      setModalVisible(false)
      setEditingRole(null)
      form.resetFields()
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 保存权限配置
  const handleSavePermissions = async () => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success('权限配置保存成功')
      setPermissionModalVisible(false)
      setSelectedRole(null)
    } catch (error) {
      message.error('保存失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 权限检查
  if (!hasPermission('role:view')) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>您没有权限访问角色管理</h3>
          <p>请联系管理员获取相应权限</p>
        </div>
      </Card>
    )
  }
  
  return (
    <div>
      <Card styles={{body:{height:'calc(100vh - 96px)'}}}>
        {/* 顶部操作栏 - 包含基础查询和新增按钮 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <h2 style={{ margin: 0 }}>角色管理</h2>
            
            {/* 基础查询 */}
            <Input.Search
              placeholder="请输入角色名称"
              value={basicSearchParams.name}
              onChange={(e) => handleBasicSearch({ name: e.target.value })}
              style={{ width: 200 }}
              allowClear
            />
            
            <Select
              placeholder="请选择状态"
              value={basicSearchParams.status || undefined}
              onChange={(value) => handleBasicSearch({ status: value || '' })}
              style={{ width: 120 }}
              allowClear
            >
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
            
            <Button 
              icon={<FilterOutlined />}
              onClick={() => setAdvancedSearchModalVisible(true)}
              type={Object.values(advancedSearchParams).some(v => v) ? 'primary' : 'default'}
            >
              高级查询
              {Object.values(advancedSearchParams).some(v => v) && (
                <span style={{ marginLeft: 4, fontSize: '12px' }}>(已启用)</span>
              )}
            </Button>
            
            {(Object.values(basicSearchParams).some(v => v) || Object.values(advancedSearchParams).some(v => v)) && (
              <Button 
                type="text" 
                onClick={handleClearAllSearch}
                style={{ color: '#ff4d4f' }}
              >
                清除筛选
              </Button>
            )}
          </div>
          
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => {
                setFilteredRoles(roles)
                message.info('刷新数据')
              }}
            >
              刷新
            </Button>
            {hasPermission('role:create') && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                新增角色
              </Button>
            )}
          </Space>
        </div>
        
        {/* 查询结果统计 */}
        {(Object.values(basicSearchParams).some(v => v) || Object.values(advancedSearchParams).some(v => v)) && (
          <Alert
            message={`当前显示 ${filteredRoles.length} 条结果，共 ${roles.length} 条数据`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            closable={false}
          />
        )}
        
        <Table
          columns={columns}
          dataSource={filteredRoles}
          rowKey="id"
          pagination={{
            total: filteredRoles.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
      
      {/* 角色表单模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '新增角色'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingRole(null)
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
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="角色代码"
            rules={[
              { required: true, message: '请输入角色代码' },
              { pattern: /^[a-z_]+$/, message: '角色代码只能包含小写字母和下划线' },
            ]}
          >
            <Input placeholder="请输入角色代码" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="角色描述"
          >
            <TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRole ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 权限配置模态框 */}
      <Modal
        title={`配置角色权限 - ${selectedRole?.name}`}
        open={permissionModalVisible}
        onCancel={() => {
          setPermissionModalVisible(false)
          setSelectedRole(null)
        }}
        onOk={handleSavePermissions}
        confirmLoading={loading}
        width={700}
      >
        <Alert
          message="权限配置说明"
          description="请为角色选择相应的菜单、按钮和接口权限。角色不分配数据权限，数据权限由菜单和接口单独管理。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <div style={{ maxHeight: 450, overflow: 'auto' }}>
          <Tree
            checkable
            treeData={permissionTree}
            checkedKeys={checkedPermissions}
            onCheck={setCheckedPermissions}
            defaultExpandAll
          />
        </div>
      </Modal>
      
      {/* 人员分配模态框 */}
      <Modal
        title={`分配人员 - ${selectedRole?.name}`}
        open={userAssignModalVisible}
        onCancel={() => {
          setUserAssignModalVisible(false)
          setSelectedRole(null)
          setAssignedUsers([])
        }}
        onOk={handleSaveUserAssign}
        confirmLoading={loading}
        width={800}
      >
        <Alert
          message="人员分配说明"
          description="选择需要分配给该角色的用户。用户可以同时拥有多个角色，禁用的用户不可分配。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ 
                padding: '8px 12px', 
                background: '#f6f8fa', 
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                可分配用户
              </div>
            </Col>
            <Col span={12}>
              <div style={{ 
                padding: '8px 12px', 
                background: '#e6f7ff', 
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                已分配用户
              </div>
            </Col>
          </Row>
        </div>
        
        <Transfer
          dataSource={availableUsers}
          titles={['可选用户', '已分配用户']}
          targetKeys={assignedUsers}
          onChange={setAssignedUsers}
          render={item => (
            <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
              </div>
            </div>
          )}
          listStyle={{
            width: 350,
            height: 400
          }}
          showSearch
          showSelectAll
          filterOption={(inputValue, item) => {
            const searchText = inputValue.toLowerCase()
            return item.title.toLowerCase().includes(searchText) ||
                   item.description.toLowerCase().includes(searchText)
          }}
          locale={{
            itemUnit: '人',
            itemsUnit: '人',
            searchPlaceholder: '搜索用户',
            notFoundContent: '无匹配用户'
          }}
        />
        
        {/* 统计信息 */}
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#f6f8fa', 
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <Space size="large">
            <div>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                {availableUsers.length - assignedUsers.length}
              </span>
              <div style={{ fontSize: '12px', color: '#666' }}>未分配</div>
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                {assignedUsers.length}
              </span>
              <div style={{ fontSize: '12px', color: '#666' }}>已分配</div>
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#faad14' }}>
                {availableUsers.length}
              </span>
              <div style={{ fontSize: '12px', color: '#666' }}>总用户数</div>
            </div>
          </Space>
        </div>
      </Modal>
      
      {/* 高级查询模态框 */}
      <Modal
        title="高级查询"
        open={advancedSearchModalVisible}
        onCancel={() => {
          setAdvancedSearchModalVisible(false)
        }}
        footer={[
          <Button key="clear" onClick={() => {
            advancedSearchForm.resetFields()
            setAdvancedSearchParams({ code: '', type: '', userCountMin: '', userCountMax: '', createdAtStart: '', createdAtEnd: '' })
            performSearch(basicSearchParams, { code: '', type: '', userCountMin: '', userCountMax: '', createdAtStart: '', createdAtEnd: '' })
            setAdvancedSearchModalVisible(false)
            message.info('已清除高级查询条件')
          }}>
            清除条件
          </Button>,
          <Button key="cancel" onClick={() => setAdvancedSearchModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => advancedSearchForm.submit()}>
            应用筛选
          </Button>
        ]}
        width={600}
      >
        <Alert
          message="高级查询说明"
          description="设置更多的筛选条件，与基础查询同时生效。留空的条件将被忽略。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form
          form={advancedSearchForm}
          layout="vertical"
          onFinish={handleAdvancedSearch}
          initialValues={advancedSearchParams}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="角色代码"
              >
                <Input placeholder="请输入角色代码" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="角色类型"
              >
                <Select placeholder="请选择角色类型" allowClear>
                  <Select.Option value="system">系统角色</Select.Option>
                  <Select.Option value="custom">自定义角色</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="userCountMin"
                label="最少用户数"
              >
                <Input type="number" placeholder="请输入最少用户数" min="0" allowClear />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="userCountMax"
                label="最多用户数"
              >
                <Input type="number" placeholder="请输入最多用户数" min="0" allowClear />
              </Form.Item>
            </Col>
          </Row>
          
          {/* 日期范围可以在这里扩展 */}
          <Row gutter={16}>
            <Col span={24}>
              <Alert
                message="更多筛选条件（如创建日期范围、最后修改日期等）可根据需要扩展"
                type="success"
                style={{ fontSize: '12px' }}
              />
            </Col>
          </Row>
        </Form>
      </Modal>

    </div>
  )
}

export default RoleManage