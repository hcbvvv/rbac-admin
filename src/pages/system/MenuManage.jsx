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
  TreeSelect,
  Switch,
  Row,
  Col,
  Tree,
  Alert,
  Badge,
  Tooltip,
  Typography,
  Divider,
  Tabs,
  Checkbox,
  Transfer,
  List
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  SafetyOutlined,
  MenuOutlined,
  FolderOutlined,
  FileOutlined,
  ControlOutlined,
  ApiOutlined,
  SettingOutlined,
  BranchesOutlined,
  DatabaseOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import { DATA_SCOPE_OPTIONS } from '@/constants/rbac'
import MenuIcon from '@/components/MenuIcon'
import DeptSelector from '@/components/DeptSelector'

const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs
const { Title, Text } = Typography

/**
 * 菜单管理页面 - 左右分栏布局，支持完整的权限管理
 * 包含资源权限、按钮权限、数据权限管理
 */
const MenuManage = () => {
  const { hasPermission } = usePermission()
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [selectedMenuId, setSelectedMenuId] = useState(null)
  const [selectedMenuInfo, setSelectedMenuInfo] = useState(null)
  const [form] = Form.useForm()
  const [permissionForm] = Form.useForm()
  
  // 模拟菜单数据（包含目录、菜单、按钮、接口）
  const [menus, setMenus] = useState([
    {
      id: '1',
      title: '仪表板',
      name: 'Dashboard',
      path: '/dashboard',
      type: 'menu',
      icon: 'DashboardOutlined',
      parentId: null,
      sort: 1,
      showInCollapsed: true, // 菜单最小化时显示
      keepAlive: true,
      status: 'active',
      // 权限配置
      permissions: {
        list: [
          {
            id: 'resource_dashboard_view',
            type: 'resource',
            typeLabel: '资源权限',
            typeColor: '#1890ff',
            icon: <SafetyOutlined />,
            key: 'dashboard:view',
            title: '仪表板查看',
            description: '访问系统仪表板和统计信息',
            dataScope: null,
            customDeptIds: null
          },
          {
            id: 'api_dashboard_stats',
            type: 'api',
            typeLabel: '接口权限',
            typeColor: '#722ed1',
            icon: <ApiOutlined />,
            key: 'GET /api/dashboard/stats',
            title: '仪表板统计接口',
            description: '获取系统统计数据',
            dataScope: 'all',
            customDeptIds: null
          }
        ]
      },
      createdAt: '2024-01-01 10:00:00'
    },
    {
      id: '2',
      title: '系统管理',
      name: 'System',
      path: '/system',
      type: 'directory',
      icon: 'SettingOutlined',
      parentId: null,
      sort: 2,
      showInCollapsed: false, // 菜单最小化时不显示
      keepAlive: false,
      status: 'active',
      permissions: {
        list: [
          {
            id: 'resource_system_manage',
            type: 'resource',
            typeLabel: '资源权限',
            typeColor: '#1890ff',
            icon: <SafetyOutlined />,
            key: 'system:manage',
            title: '系统管理',
            description: '访问系统管理模块',
            dataScope: null,
            customDeptIds: null
          }
        ]
      },
      createdAt: '2024-01-01 11:00:00'
    },
    {
      id: '3',
      title: '用户管理',
      name: 'UserManage',
      path: '/system/user',
      type: 'menu',
      icon: 'UserOutlined',
      parentId: '2',
      sort: 1,
      showInCollapsed: false, // 菜单最小化时不显示
      keepAlive: true,
      status: 'active',
      permissions: {
        list: [
          {
            id: 'resource_user_view',
            type: 'resource',
            typeLabel: '资源权限',
            typeColor: '#1890ff',
            icon: <SafetyOutlined />,
            key: 'user:view',
            title: '用户查看',
            description: '查看用户列表和详细信息',
            dataScope: null,
            customDeptIds: null
          },
          {
            id: 'button_user_create',
            type: 'button',
            typeLabel: '按钮权限',
            typeColor: '#faad14',
            icon: <ControlOutlined />,
            key: 'user:create',
            title: '新增用户',
            description: '创建新的用户账户',
            dataScope: null,
            customDeptIds: null
          },
          {
            id: 'api_get_users',
            type: 'api',
            typeLabel: '接口权限',
            typeColor: '#722ed1',
            icon: <ApiOutlined />,
            key: 'GET /api/users',
            title: '获取用户列表',
            description: '获取系统用户列表',
            dataScope: 'dept_sub',
            customDeptIds: null
          },
          {
            id: 'data_permission_user',
            type: 'data',
            typeLabel: '数据权限',
            typeColor: '#13c2c2',
            icon: <DatabaseOutlined />,
            key: 'user_data_scope',
            title: '用户数据权限',
            description: '控制用户在此菜单下可以访问的数据范围',
            dataScope: 'dept_sub',
            customDeptIds: null
          }
        ]
      },
      createdAt: '2024-01-01 12:00:00'
    },
    {
      id: '4',
      title: '角色管理',
      name: 'RoleManage',
      path: '/system/role',
      type: 'menu',
      icon: 'TeamOutlined',
      parentId: '2',
      sort: 2,
      showInCollapsed: true, // 角色管理在折叠时显示
      keepAlive: true,
      status: 'active',
      permissions: {
        list: [
          {
            id: 'resource_role_view',
            type: 'resource',
            typeLabel: '资源权限',
            typeColor: '#1890ff',
            icon: <SafetyOutlined />,
            key: 'role:view',
            title: '角色查看',
            description: '查看角色列表和权限配置',
            dataScope: null,
            customDeptIds: null
          }
        ]
      },
      createdAt: '2024-01-01 13:00:00'
    },
    {
      id: '5',
      title: '部门管理',
      name: 'DeptManage',
      path: '/system/dept',
      type: 'menu',
      icon: 'ApartmentOutlined',
      parentId: '2',
      sort: 3,
      showInCollapsed: false, // 部门管理在折叠时不显示
      keepAlive: true,
      status: 'active',
      permissions: {
        list: [
          {
            id: 'resource_dept_view',
            type: 'resource',
            typeLabel: '资源权限',
            typeColor: '#1890ff',
            icon: <SafetyOutlined />,
            key: 'dept:view',
            title: '部门查看',
            description: '查看部门结构和信息',
            dataScope: null,
            customDeptIds: null
          }
        ]
      },
      createdAt: '2024-01-01 14:00:00'
    }
  ])
  
  // 预定义的权限选项
  const resourcePermissions = [
    { key: 'dashboard:view', title: '仪表板查看', description: '访问系统仪表板和统计信息' },
    { key: 'system:manage', title: '系统管理', description: '访问系统管理模块' },
    { key: 'user:view', title: '用户查看', description: '查看用户列表和详细信息' },
    { key: 'role:view', title: '角色查看', description: '查看角色列表和权限配置' },
    { key: 'dept:view', title: '部门查看', description: '查看部门结构和信息' },
    { key: 'menu:view', title: '菜单查看', description: '查看菜单配置和权限设置' }
  ]
  
  const buttonPermissions = [
    { key: 'user:create', title: '新增用户', description: '创建新的用户账户' },
    { key: 'user:edit', title: '编辑用户', description: '修改用户基本信息' },
    { key: 'user:delete', title: '删除用户', description: '删除用户账户' },
    { key: 'user:reset', title: '重置密码', description: '重置用户登录密码' },
    { key: 'role:create', title: '新增角色', description: '创建新的角色' },
    { key: 'role:edit', title: '编辑角色', description: '修改角色信息和权限' },
    { key: 'role:delete', title: '删除角色', description: '删除角色' },
    { key: 'role:assign', title: '分配角色', description: '为用户分配角色' },
    { key: 'dept:create', title: '新增部门', description: '创建新的部门' },
    { key: 'dept:edit', title: '编辑部门', description: '修改部门信息' },
    { key: 'dept:delete', title: '删除部门', description: '删除部门' }
  ]
  
  const apiPermissions = [
    { key: 'GET /api/dashboard/stats', title: '仪表板统计接口', description: '获取系统统计数据' },
    { key: 'GET /api/users', title: '获取用户列表', description: '获取系统用户列表' },
    { key: 'POST /api/users', title: '创建用户', description: '创建新用户接口' },
    { key: 'PUT /api/users/:id', title: '更新用户', description: '更新用户信息接口' },
    { key: 'DELETE /api/users/:id', title: '删除用户', description: '删除用户接口' },
    { key: 'GET /api/roles', title: '获取角色列表', description: '获取系统角色列表' },
    { key: 'POST /api/roles', title: '创建角色', description: '创建新角色接口' },
    { key: 'PUT /api/roles/:id', title: '更新角色', description: '更新角色信息接口' },
    { key: 'DELETE /api/roles/:id', title: '删除角色', description: '删除角色接口' },
    { key: 'GET /api/departments', title: '获取部门列表', description: '获取部门树形结构' },
    { key: 'POST /api/departments', title: '创建部门', description: '创建新部门接口' },
    { key: 'PUT /api/departments/:id', title: '更新部门', description: '更新部门信息接口' }
  ]
  
  // 构建合并的权限数据列表
  const buildPermissionDataSource = () => {
    const allPermissions = []
    
    // 资源权限
    resourcePermissions.forEach(item => {
      allPermissions.push({
        ...item,
        type: 'resource',
        typeLabel: '资源权限',
        typeColor: '#1890ff',
        icon: <SafetyOutlined />
      })
    })
    
    // 按钮权限
    buttonPermissions.forEach(item => {
      allPermissions.push({
        ...item,
        type: 'button',
        typeLabel: '按钮权限',
        typeColor: '#faad14',
        icon: <ControlOutlined />
      })
    })
    
    // 接口权限
    apiPermissions.forEach(item => {
      allPermissions.push({
        ...item,
        type: 'api',
        typeLabel: '接口权限',
        typeColor: '#722ed1',
        icon: <ApiOutlined />
      })
    })
    
    return allPermissions
  }
  
  // 获取所有权限数据源
  const allPermissionDataSource = useMemo(() => buildPermissionDataSource(), [])
  
  // 权限表格相关状态
  const [permissionTableData, setPermissionTableData] = useState([])
  const [addPermissionModalVisible, setAddPermissionModalVisible] = useState(false)
  const [editPermissionModalVisible, setEditPermissionModalVisible] = useState(false)
  const [addPermissionForm] = Form.useForm()
  const [editPermissionForm] = Form.useForm()
  const [editingPermission, setEditingPermission] = useState(null)
  const [permissionScopeModalVisible, setPermissionScopeModalVisible] = useState(false)
  const [currentPermissionForScope, setCurrentPermissionForScope] = useState(null)
  const [permissionScopeForm] = Form.useForm()
  
  // 构建权限表格数据（从表单数据构建）
  const buildPermissionTableData = () => {
    // 直接使用存储在菜单权限中的数据
    const permissions = editingMenu?.permissions || {}
    return permissions.list || []
  }
  
  // 获取当前选中的权限（用于表格数据更新）
  const getCurrentSelectedPermissions = () => {
    return permissionTableData
  }
  
  // 权限表格相关函数
  
  // 添加权限
  const handleAddPermission = () => {
    setEditingPermission(null)
    addPermissionForm.resetFields()
    // 设置默认值
    addPermissionForm.setFieldsValue({
      type: 'resource',
      dataScope: 'all'
    })
    setAddPermissionModalVisible(true)
  }
  
  // 编辑权限
  const handleEditPermission = (record) => {
    setEditingPermission(record)
    editPermissionForm.setFieldsValue({
      type: record.type,
      key: record.key,
      title: record.title,
      description: record.description,
      dataScope: record.dataScope || 'all',
      customDeptIds: record.customDeptIds || []
    })
    setEditPermissionModalVisible(true)
  }
  
  // 删除权限
  const handleDeletePermission = (record) => {
    const updatedPermissions = permissionTableData.filter(p => p.id !== record.id)
    setPermissionTableData(updatedPermissions)
    
    // 更新菜单数据
    const updatedMenu = {
      ...editingMenu,
      permissions: {
        ...editingMenu.permissions,
        list: updatedPermissions
      }
    }
    
    // 更新菜单列表
    setMenus(menus.map(menu => 
      menu.id === editingMenu.id ? updatedMenu : menu
    ))
    
    if (selectedMenuId === editingMenu.id) {
      setSelectedMenuInfo(updatedMenu)
    }
    
    message.success('权限删除成功')
  }
  
  // 保存新增权限
  const handleSaveAddPermission = async (values) => {
    try {
      const newPermission = {
        id: `${values.type}_${Date.now()}`,
        type: values.type,
        typeLabel: getTypeLabel(values.type),
        typeColor: getTypeColor(values.type),
        icon: getTypeIcon(values.type),
        key: values.key,
        title: values.title,
        description: values.description,
        dataScope: (values.type === 'api' || values.type === 'data') ? values.dataScope : null,
        customDeptIds: (values.dataScope === 'custom') ? values.customDeptIds : null
      }
      
      const updatedPermissions = [...permissionTableData, newPermission]
      setPermissionTableData(updatedPermissions)
      
      // 更新菜单数据
      const updatedMenu = {
        ...editingMenu,
        permissions: {
          ...editingMenu.permissions,
          list: updatedPermissions
        }
      }
      
      // 更新菜单列表
      setMenus(menus.map(menu => 
        menu.id === editingMenu.id ? updatedMenu : menu
      ))
      
      if (selectedMenuId === editingMenu.id) {
        setSelectedMenuInfo(updatedMenu)
      }
      
      setAddPermissionModalVisible(false)
      addPermissionForm.resetFields()
      message.success('权限添加成功')
    } catch (error) {
      message.error('添加失败，请重试')
    }
  }
  
  // 保存编辑权限
  const handleSaveEditPermission = async (values) => {
    try {
      const updatedPermission = {
        ...editingPermission,
        type: values.type,
        typeLabel: getTypeLabel(values.type),
        typeColor: getTypeColor(values.type),
        icon: getTypeIcon(values.type),
        key: values.key,
        title: values.title,
        description: values.description,
        dataScope: (values.type === 'api' || values.type === 'data') ? values.dataScope : null,
        customDeptIds: (values.dataScope === 'custom') ? values.customDeptIds : null
      }
      
      const updatedPermissions = permissionTableData.map(p => 
        p.id === editingPermission.id ? updatedPermission : p
      )
      setPermissionTableData(updatedPermissions)
      
      // 更新菜单数据
      const updatedMenu = {
        ...editingMenu,
        permissions: {
          ...editingMenu.permissions,
          list: updatedPermissions
        }
      }
      
      // 更新菜单列表
      setMenus(menus.map(menu => 
        menu.id === editingMenu.id ? updatedMenu : menu
      ))
      
      if (selectedMenuId === editingMenu.id) {
        setSelectedMenuInfo(updatedMenu)
      }
      
      setEditPermissionModalVisible(false)
      editPermissionForm.resetFields()
      setEditingPermission(null)
      message.success('权限更新成功')
    } catch (error) {
      message.error('更新失败，请重试')
    }
  }
  
  // 获取权限类型标签
  const getTypeLabel = (type) => {
    const typeMap = {
      resource: '资源权限',
      button: '按钮权限',
      api: '接口权限',
      data: '数据权限'
    }
    return typeMap[type] || type
  }
  
  // 获取权限类型颜色
  const getTypeColor = (type) => {
    const colorMap = {
      resource: '#1890ff',
      button: '#faad14',
      api: '#722ed1',
      data: '#13c2c2'
    }
    return colorMap[type] || '#666'
  }
  
  // 获取权限类型图标
  const getTypeIcon = (type) => {
    const iconMap = {
      resource: <SafetyOutlined />,
      button: <ControlOutlined />,
      api: <ApiOutlined />,
      data: <DatabaseOutlined />
    }
    return iconMap[type] || <SafetyOutlined />
  }
  
  // 编辑权限范围
  const handleEditPermissionScope = (record) => {
    setCurrentPermissionForScope(record)
    permissionScopeForm.setFieldsValue({
      dataScope: record.dataScope || 'all',
      customDeptIds: record.customDeptIds || []
    })
    setPermissionScopeModalVisible(true)
  }
  
  // 保存权限范围
  const handleSavePermissionScope = async (values) => {
    try {
      const { dataScope, customDeptIds } = values
      
      // 更新权限表格数据
      const updatedPermissions = permissionTableData.map(p => 
        p.id === currentPermissionForScope.id 
          ? {
              ...p,
              dataScope: dataScope,
              customDeptIds: dataScope === 'custom' ? customDeptIds : null
            }
          : p
      )
      
      setPermissionTableData(updatedPermissions)
      
      // 更新菜单数据
      const updatedMenu = {
        ...editingMenu,
        permissions: {
          ...editingMenu.permissions,
          list: updatedPermissions
        }
      }
      
      setMenus(menus.map(menu => 
        menu.id === editingMenu.id ? updatedMenu : menu
      ))
      
      if (selectedMenuId === editingMenu.id) {
        setSelectedMenuInfo(updatedMenu)
      }
      
      setPermissionScopeModalVisible(false)
      setCurrentPermissionForScope(null)
      permissionScopeForm.resetFields()
      message.success('权限范围配置成功')
    } catch (error) {
      message.error('保存失败，请重试')
    }
  }
  
  // 获取权限范围显示文本
  const getDataScopeText = (dataScope, customDeptIds) => {
    if (!dataScope || dataScope === 'all') return null
    
    const option = DATA_SCOPE_OPTIONS.find(opt => opt.value === dataScope)
    if (!option) return dataScope
    
    if (dataScope === 'custom' && customDeptIds?.length) {
      return `${option.label}(${customDeptIds.length}个部门)`
    }
    
    return option.label
  }
  
  // 初始化加载菜单数据
  useEffect(() => {
    loadMenuData()
  }, [])
  
  // 加载菜单数据
  const loadMenuData = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      message.success('菜单数据加载成功')
    } catch (error) {
      message.error('加载菜单数据失败')
    } finally {
      setLoading(false)
    }
  }
  
  // 构建菜单树结构
  const buildMenuTree = (menuList, parentId = null) => {
    return menuList
      .filter(menu => menu.parentId === parentId)
      .sort((a, b) => a.sort - b.sort)
      .map(menu => {
        const children = buildMenuTree(menuList, menu.id)
        return {
          key: menu.id,
          title: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space>
                {getMenuIcon(menu.type, menu.icon)}
                <span>{menu.title}</span>
                {getMenuTypeTag(menu.type)}
                {menu.permissions?.dataScope && (
                  <Badge 
                    count="数据权限" 
                    style={{ 
                      backgroundColor: '#52c41a',
                      fontSize: '10px',
                      height: '16px',
                      lineHeight: '16px'
                    }} 
                  />
                )}
              </Space>
              <Space>
                {menu.showInCollapsed && <Tag color="blue" size="small">折叠显示</Tag>}
                <Tag color={menu.status === 'active' ? 'green' : 'red'} size="small">
                  {menu.status === 'active' ? '启用' : '禁用'}
                </Tag>
                
              </Space>
            </div>
          ),
          children: children.length > 0 ? children : undefined,
          menu: menu
        }
      })
  }
  
  // 获取菜单图标
  const getMenuIcon = (type, iconName) => {
    const iconMap = {
      directory: <FolderOutlined style={{ color: '#1890ff' }} />,
      menu: <FileOutlined style={{ color: '#52c41a' }} />
    }
    
    if (iconName && type === 'menu') {
      return <MenuIcon icon={iconName} />
    }
    
    return iconMap[type] || <MenuOutlined />
  }
  
  // 获取菜单类型标签
  const getMenuTypeTag = (type) => {
    const typeMap = {
      directory: { color: 'blue', text: '目录' },
      menu: { color: 'green', text: '菜单' }
    }
    const config = typeMap[type] || { color: 'default', text: type }
    return <Tag color={config.color} size="small">{config.text}</Tag>
  }
  
  // 菜单树数据
  const menuTreeData = useMemo(() => buildMenuTree(menus), [menus])
  
  // 处理菜单树节点选中
  const handleMenuSelect = (selectedKeys, info) => {
    const menuId = selectedKeys[0]
    setSelectedMenuId(menuId)
    
    if (menuId) {
      const menu = menus.find(m => m.id === menuId)
      setSelectedMenuInfo(menu)
    } else {
      setSelectedMenuInfo(null)
    }
  }
  
  // 渲染菜单详情页面
  const renderMenuDetail = () => {
    if (!selectedMenuInfo) {
      return (
        <Card style={{ height: 'calc(100vh-96px)' }}>
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
            <MenuOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <p>请在左侧选择一个菜单项查看详情</p>
          </div>
        </Card>
      )
    }
    
    return (
      <Card 
        title={
          <Space>
            {getMenuIcon(selectedMenuInfo.type, selectedMenuInfo.icon)}
            <span>{selectedMenuInfo.title}</span>
            {getMenuTypeTag(selectedMenuInfo.type)}
          </Space>
        }
        extra={
          <Space>
            {hasPermission('menu:edit') && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(selectedMenuInfo)}
              >
                编辑
              </Button>
            )}
            <Button
              icon={<SafetyOutlined />}
              onClick={() => handlePermissionManage(selectedMenuInfo)}
            >
              权限管理
            </Button>
            {hasPermission('menu:delete') && (
              <Popconfirm
                title="确定要删除这个菜单吗？"
                onConfirm={() => handleDelete(selectedMenuInfo.id)}
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
        }
      >
        {/* 基本信息 */}
        {renderBasicInfo()}
        
        {/* 权限配置信息 */}
        <Divider orientation="left">
          <Space>
            <SafetyOutlined style={{ color: '#1890ff' }} />
            <span>权限配置</span>
          </Space>
        </Divider>
        {renderPermissionInfo()}
        
        {/* 子菜单信息 */}
        {selectedMenuInfo.type === 'directory' && (
          <>
            <Divider orientation="left">
              <Space>
                <BranchesOutlined style={{ color: '#1890ff' }} />
                <span>子菜单</span>
              </Space>
            </Divider>
            {renderChildrenInfo()}
          </>
        )}
      </Card>
    )
  }
  
  // 渲染基本信息
  const renderBasicInfo = () => {
    const info = selectedMenuInfo
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>ID：</Text>
              <Text code>{info.id}</Text>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>菜单标题：</Text>
              <Text>{info.title}</Text>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>菜单名称：</Text>
              <Text code>{info.name}</Text>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>路径：</Text>
              <Text code>{info.path || '-'}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>类型：</Text>
              {getMenuTypeTag(info.type)}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>图标：</Text>
              <Text>{info.icon || '-'}</Text>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>排序：</Text>
              <Text>{info.sort}</Text>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>状态：</Text>
              <Tag color={info.status === 'active' ? 'green' : 'red'}>
                {info.status === 'active' ? '启用' : '禁用'}
              </Tag>
            </div>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>折叠时显示：</Text>
              <Tag color={info.showInCollapsed ? 'blue' : 'default'}>
                {info.showInCollapsed ? '是' : '否'}
              </Tag>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>创建时间：</Text>
              <Text>{info.createdAt}</Text>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
  
  // 渲染权限配置信息
  const renderPermissionInfo = () => {
    const permissions = selectedMenuInfo.permissions || {}
    const permissionList = permissions.list || []
    
    // 按类型分组
    const resourcePermissions = permissionList.filter(p => p.type === 'resource')
    const buttonPermissions = permissionList.filter(p => p.type === 'button')
    const apiPermissions = permissionList.filter(p => p.type === 'api')
    const dataPermissions = permissionList.filter(p => p.type === 'data')
    
    return (
      <div>
        {/* 资源权限列表 */}
        <Card 
          title={
            <Space>
              <SafetyOutlined style={{ color: '#1890ff' }} />
              <span>资源权限</span>
              <Badge count={resourcePermissions.length} />
            </Space>
          }
          size="small"
          style={{ marginBottom: 16 }}
          extra={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              控制用户可以访问的页面和功能模块
            </Text>
          }
        >
          {resourcePermissions.length > 0 ? (
            <List
              size="small"
              dataSource={resourcePermissions}
              renderItem={permission => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <SafetyOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                    }
                    title={permission.title}
                    description={permission.description || '无描述'}
                  />
                  <Tag color="blue">{permission.key}</Tag>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
              <SafetyOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
              <p>未配置资源权限</p>
            </div>
          )}
        </Card>

        {/* 按钮权限列表 */}
        <Card 
          title={
            <Space>
              <ControlOutlined style={{ color: '#faad14' }} />
              <span>按钮权限</span>
              <Badge count={buttonPermissions.length} />
            </Space>
          }
          size="small"
          style={{ marginBottom: 16 }}
          extra={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              控制用户可以执行的操作按钮
            </Text>
          }
        >
          {buttonPermissions.length > 0 ? (
            <List
              size="small"
              dataSource={buttonPermissions}
              renderItem={permission => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <ControlOutlined style={{ color: '#faad14', fontSize: '16px' }} />
                    }
                    title={permission.title}
                    description={permission.description || '无描述'}
                  />
                  <Tag color="orange">{permission.key}</Tag>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
              <ControlOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
              <p>未配置按钮权限</p>
            </div>
          )}
        </Card>

        {/* 接口权限列表 */}
        <Card 
          title={
            <Space>
              <ApiOutlined style={{ color: '#722ed1' }} />
              <span>接口权限</span>
              <Badge count={apiPermissions.length} />
            </Space>
          }
          size="small"
          style={{ marginBottom: 16 }}
          extra={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              控制用户可以调用的API接口
            </Text>
          }
        >
          {apiPermissions.length > 0 ? (
            <List
              size="small"
              dataSource={apiPermissions}
              renderItem={permission => {
                const dataScopeOption = DATA_SCOPE_OPTIONS.find(option => option.value === permission.dataScope)
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <ApiOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
                      }
                      title={
                        <div>
                          <span>{permission.title}</span>
                          {permission.dataScope && permission.dataScope !== 'all' && (
                            <Tag color="purple" size="small" style={{ marginLeft: '8px' }}>
                              {dataScopeOption?.label || permission.dataScope}
                            </Tag>
                          )}
                        </div>
                      }
                      description={permission.description || '无描述'}
                    />
                    <Tag color="purple">{permission.key}</Tag>
                  </List.Item>
                )
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
              <ApiOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
              <p>未配置接口权限</p>
            </div>
          )}
        </Card>

        {/* 数据权限列表 */}
        <Card 
          title={
            <Space>
              <DatabaseOutlined style={{ color: '#13c2c2' }} />
              <span>数据权限</span>
              <Badge count={dataPermissions.length} />
            </Space>
          }
          size="small"
          style={{ marginBottom: 16 }}
          extra={
            <Text type="secondary" style={{ fontSize: '12px' }}>
              控制用户在此菜单下可以访问的数据范围
            </Text>
          }
        >
          {dataPermissions.length > 0 ? (
            <List
              size="small"
              dataSource={dataPermissions}
              renderItem={permission => {
                const dataScopeOption = DATA_SCOPE_OPTIONS.find(option => option.value === permission.dataScope)
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <DatabaseOutlined style={{ color: '#13c2c2', fontSize: '16px' }} />
                      }
                      title={
                        <div>
                          <span>{permission.title}</span>
                          <Tag color="cyan" size="small" style={{ marginLeft: '8px' }}>
                            {dataScopeOption?.label || permission.dataScope}
                          </Tag>
                        </div>
                      }
                      description={permission.description || '无描述'}
                    />
                    <div>
                      {permission.dataScope === 'custom' && permission.customDeptIds?.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <Text strong style={{ fontSize: '12px' }}>自定义部门：</Text>
                          {permission.customDeptIds.map(deptId => (
                            <Tag key={deptId} size="small" color="cyan" style={{ marginLeft: '4px' }}>
                              部门 {deptId}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </List.Item>
                )
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>
              <DatabaseOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
              <p>未配置数据权限</p>
            </div>
          )}
        </Card>
        
        {/* 权限配置综合说明 */}
        <Alert
          message="权限配置说明"
          description={
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><strong>资源权限：</strong>控制用户可以访问的页面和功能模块</li>
              <li><strong>按钮权限：</strong>控制用户可以执行的操作按钮</li>
              <li><strong>接口权限：</strong>控制用户可以调用的API接口，并可单独设置接口数据范围</li>
              <li><strong>数据权限：</strong>控制用户在此菜单下可以访问的数据范围</li>
            </ul>
          }
          type="info"
          showIcon
          size="small"
        />
      </div>
    )
  }
  
  // 渲染子菜单信息
  const renderChildrenInfo = () => {
    const children = menus.filter(menu => menu.parentId === selectedMenuInfo.id)
    
    if (children.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '30px 0', color: '#999' }}>
          <BranchesOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
          <p>暂无子菜单</p>
        </div>
      )
    }
    
    const columns = [
      {
        title: '菜单标题',
        dataIndex: 'title',
        key: 'title',
        render: (title, record) => (
          <Space>
            {getMenuIcon(record.type, record.icon)}
            <span>{title}</span>
          </Space>
        )
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (type) => getMenuTypeTag(type)
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
        render: (path) => <Text code>{path || '-'}</Text>
      },
      {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
        width: 80
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 'active' ? 'green' : 'red'}>
            {status === 'active' ? '启用' : '禁用'}
          </Tag>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedMenuId(record.id)
                setSelectedMenuInfo(record)
              }}
            >
              查看
            </Button>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Space>
        )
      }
    ]
    
    return (
      <Table
        columns={columns}
        dataSource={children}
        rowKey="id"
        size="small"
        pagination={false}
      />
    )
  }
  
  // 添加菜单
  const handleAdd = () => {
    setEditingMenu(null)
    form.resetFields()
    // 如果当前选中了菜单，设置为默认父级菜单
    if (selectedMenuInfo) {
      form.setFieldsValue({ parentId: selectedMenuInfo.id })
    }
    setModalVisible(true)
  }
  
  // 编辑菜单
  const handleEdit = (menu) => {
    setEditingMenu(menu)
    form.setFieldsValue(menu)
    setModalVisible(true)
  }
  
  // 权限管理
  const handlePermissionManage = (menu) => {
    setEditingMenu(menu)
    
    // 初始化权限表格数据（使用菜单中的权限列表）
    const permissions = menu.permissions || {}
    const permissionList = permissions.list || []
    setPermissionTableData(permissionList)
    
    setPermissionModalVisible(true)
  }
  
  // 监听表单字段变化（不再需要）
  const handleFormValuesChange = () => {
    // 不再需要自动更新表格数据
  }
  
  // 删除菜单
  const handleDelete = (id) => {
    // 检查是否有子菜单
    const hasChildren = menus.some(m => m.parentId === id)
    if (hasChildren) {
      message.error('该菜单下还有子菜单，无法删除')
      return
    }
    
    setMenus(menus.filter(menu => menu.id !== id))
    message.success('菜单删除成功')
    
    // 如果删除的是当前选中的菜单，清空选中状态
    if (selectedMenuId === id) {
      setSelectedMenuId(null)
      setSelectedMenuInfo(null)
    }
  }
  
  // 保存菜单
  const handleSave = async (values) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingMenu) {
        // 编辑
        setMenus(menus.map(menu => 
          menu.id === editingMenu.id 
            ? { ...menu, ...values }
            : menu
        ))
        message.success('菜单更新成功')
        
        // 如果编辑的是当前选中的菜单，更新选中信息
        if (selectedMenuId === editingMenu.id) {
          setSelectedMenuInfo({ ...editingMenu, ...values })
        }
      } else {
        // 新增
        const newMenu = {
          id: Date.now().toString(),
          ...values,
          permissions: {
            resource: [],
            buttons: [],
            apis: [],
            dataScope: 'all',
            customDeptIds: []
          },
          createdAt: new Date().toLocaleString(),
        }
        setMenus([...menus, newMenu])
        message.success('菜单创建成功')
      }
      
      setModalVisible(false)
      setEditingMenu(null)
      form.resetFields()
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 保存权限配置
  const handlePermissionSave = async (values) => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 保存权限列表数据
      const newPermissions = {
        list: permissionTableData
      }
      
      setMenus(menus.map(menu => 
        menu.id === editingMenu.id 
          ? { ...menu, permissions: newPermissions }
          : menu
      ))
      
      // 更新当前选中的菜单信息
      if (selectedMenuId === editingMenu.id) {
        setSelectedMenuInfo({ ...selectedMenuInfo, permissions: newPermissions })
      }
      
      message.success('权限配置成功')
      setPermissionModalVisible(false)
      setEditingMenu(null)
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 构建菜单选择器数据（用于父级菜单选择）
  const buildMenuSelectData = (menuList, parentId = null, excludeId = null) => {
    return menuList
      .filter(menu => 
        menu.parentId === parentId && 
        menu.id !== excludeId && 
        (menu.type === 'directory' || menu.type === 'menu')
      )
      .sort((a, b) => a.sort - b.sort)
      .map(menu => ({
        title: menu.title,
        value: menu.id,
        key: menu.id,
        children: buildMenuSelectData(menuList, menu.id, excludeId),
      }))
  }
  
  // 权限检查
  if (!hasPermission('menu:view')) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>您没有权限访问菜单管理</h3>
          <p>请联系管理员获取相应权限</p>
        </div>
      </Card>
    )
  }
  
  const menuSelectData = buildMenuSelectData(menus, null, editingMenu?.id)
  
  return (
    <div>
      {/* 顶部操作栏 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                <MenuOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                菜单权限管理
              </Title>
              <Alert
                message="左侧树形结构显示目录、菜单、按钮、接口，右侧显示详情和权限管理"
                type="info"
                size="small"
                showIcon
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadMenuData}
                loading={loading}
              >
                刷新
              </Button>
              {hasPermission('menu:create') && (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                >
                  新增菜单
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>
      
      <Row gutter={16}>
        {/* 左侧菜单树 */}
        <Col xs={24} sm={24} md={8} lg={6} xl={6}>
          <Card 
            title={
              <Space>
                <FolderOutlined />
                <span>菜单结构</span>
                <Badge 
                  count={menus.length} 
                  style={{ backgroundColor: '#52c41a' }}
                  showZero
                />
              </Space>
            }
            size="small"
            style={{ height: 'calc(100vh - 176px)', overflow: 'hidden' }}
            styles={{body:{ 
              padding: '12px',
              height: 'calc(100vh - 180px)',
              overflow: 'auto'
            }}}
            extra={
              <Tooltip title="展开/折叠所有">
                <Button 
                  type="text" 
                  size="small"
                  icon={<MenuOutlined />}
                />
              </Tooltip>
            }
          >
            {menuTreeData.length > 0 ? (
              <Tree
                treeData={menuTreeData}
                selectedKeys={selectedMenuId ? [selectedMenuId] : []}
                onSelect={handleMenuSelect}
                defaultExpandAll
                showLine
                blockNode
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
                <MenuOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
                <p>暂无菜单数据</p>
              </div>
            )}
          </Card>
        </Col>
        
        {/* 右侧菜单详情 */}
        <Col xs={24} sm={24} md={16} lg={18} xl={18}>
          <div style={{ height: 'calc(100vh - 176px)', overflow: 'auto' }}>
            {renderMenuDetail()}
          </div>
        </Col>
      </Row>
      
      {/* 菜单编辑模态框 */}
      <Modal
        title={editingMenu ? '编辑菜单' : '新增菜单'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingMenu(null)
          form.resetFields()
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            type: 'menu',
            sort: 1,
            showInCollapsed: false,
            keepAlive: false,
            status: 'active',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="菜单标题"
                rules={[{ required: true, message: '请输入菜单标题' }]}
              >
                <Input placeholder="请输入菜单标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="菜单名称/权限代码"
                rules={[{ required: true, message: '请输入菜单名称' }]}
              >
                <Input placeholder="如：UserManage 或 user:create" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="类型"
                rules={[{ required: true, message: '请选择类型' }]}
              >
                <Select placeholder="请选择类型">
                  <Option value="directory">目录</Option>
                  <Option value="menu">菜单</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="parentId"
                label="父级菜单"
              >
                <TreeSelect
                  placeholder="请选择父级菜单"
                  allowClear
                  treeData={menuSelectData}
                  treeDefaultExpandAll
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="path"
                label="路径"
                tooltip="菜单路径或接口路径"
              >
                <Input placeholder="如：/system/user 或 /api/users" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="icon"
                label="图标"
              >
                <Input placeholder="请输入图标名称" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="sort"
                label="排序"
                rules={[{ required: true, message: '请输入排序值' }]}
              >
                <Input type="number" placeholder="请输入排序值" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="showInCollapsed"
                label="折叠时显示"
                valuePropName="checked"
                tooltip="设置菜单在侧边栏折叠时是否显示"
              >
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
              </Form.Item>
            </Col>
            <Col span={8}>
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
            </Col>
          </Row>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingMenu ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 权限配置模态框 */}
      <Modal
        title={`权限配置 - ${editingMenu?.title || ''}`}
        open={permissionModalVisible}
        onCancel={() => {
          setPermissionModalVisible(false)
          setEditingMenu(null)
          permissionForm.resetFields()
        }}
        footer={null}
        width={1300}
        destroyOnHidden
        style={{ top: '100px' }}
      >
        <div style={{ padding: '0 30px 30px' }}>
          <Alert
            message="权限配置说明"
            description="通过表格管理当前菜单的所有权限配置。可以手动添加、编辑、删除权限，并为接口权限和数据权限设置不同的范围。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Card 
            title={
              <Space>
                <SafetyOutlined style={{ color: '#52c41a' }} />
                <span>权限配置</span>
                <Badge count={permissionTableData.length} />
              </Space>
            }
            size="small"
            style={{ marginBottom: 24 }}
            extra={
              <Space>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  管理菜单所需的所有权限配置
                </Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={handleAddPermission}
                >
                  新增权限
                </Button>
              </Space>
            }
          >
            <Table
              dataSource={permissionTableData}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ y: 400 }}
              columns={[
                {
                  title: '权限类型',
                  dataIndex: 'type',
                  key: 'type',
                  width: 100,
                  render: (type, record) => (
                    <Space>
                      <div style={{ color: record.typeColor, fontSize: '16px' }}>
                        {record.icon}
                      </div>
                      <Tag color={record.typeColor} size="small">
                        {record.typeLabel}
                      </Tag>
                    </Space>
                  )
                },
                {
                  title: '权限名称',
                  dataIndex: 'title',
                  key: 'title',
                  ellipsis: true,
                  width: 250,
                  render: (title, record) => (
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                        {title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {record.description}
                      </div>
                    </div>
                  )
                },
                {
                  title: '权限标识',
                  dataIndex: 'key',
                  key: 'key',
                  width: 180,
                  render: (key) => <Text code>{key}</Text>
                },
                {
                  title: '权限范围',
                  dataIndex: 'dataScope',
                  key: 'dataScope',
                  width: 150,
                  render: (dataScope, record) => {
                    const scopeText = getDataScopeText(dataScope, record.customDeptIds)
                    
                    if (!scopeText) {
                      return (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          无需配置
                        </Text>
                      )
                    }
                    
                    return (
                      <Tag color={dataScope === 'all' ? 'green' : 'blue'} size="small">
                        {scopeText}
                      </Tag>
                    )
                  }
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 200,
                  render: (_, record) => (
                    <Space>
                      <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditPermission(record)}
                      >
                        编辑
                      </Button>
                      {(record.type === 'api' || record.type === 'data') && (
                        <Button
                          type="link"
                          size="small"
                          icon={<SettingOutlined />}
                          onClick={() => handleEditPermissionScope(record)}
                        >
                          设置范围
                        </Button>
                      )}
                      <Popconfirm
                        title="确定要删除这个权限吗？"
                        onConfirm={() => handleDeletePermission(record)}
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
                    </Space>
                  )
                }
              ]}
              locale={{
                emptyText: (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <SafetyOutlined style={{ fontSize: '32px', marginBottom: '12px' }} />
                    <p>暂无权限配置</p>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={handleAddPermission}
                    >
                      添加权限
                    </Button>
                  </div>
                )
              }}
            />
            
            {/* 权限统计信息 */}
            {permissionTableData.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#f6f8fa', borderRadius: '6px' }}>
                <Row gutter={24}>
                  <Col span={6}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                        {permissionTableData.filter(p => p.type === 'resource').length}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>资源权限</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>
                        {permissionTableData.filter(p => p.type === 'button').length}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>按钮权限</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#722ed1' }}>
                        {permissionTableData.filter(p => p.type === 'api').length}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>接口权限</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#13c2c2' }}>
                        {permissionTableData.filter(p => p.type === 'data').length}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>数据权限</div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Card>

          
          <div style={{ textAlign: 'right', marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <Space>
              <Button onClick={() => setPermissionModalVisible(false)}>
                取消
              </Button>
              <Button 
                type="primary" 
                onClick={handlePermissionSave}
                loading={loading}
              >
                保存权限配置
              </Button>
            </Space>
          </div>
        </div>
      </Modal>
      
      {/* 权限新增弹窗 */}
      <Modal
        title="新增权限"
        open={addPermissionModalVisible}
        onCancel={() => {
          setAddPermissionModalVisible(false)
          addPermissionForm.resetFields()
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Alert
          message="权限新增说明"
          description="手动填写权限信息，包括权限类型、权限标识、权限名称和描述。接口权限和数据权限可以设置数据范围。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Form
          form={addPermissionForm}
          layout="vertical"
          onFinish={handleSaveAddPermission}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="权限类型"
                rules={[{ required: true, message: '请选择权限类型' }]}
              >
                <Select placeholder="请选择权限类型">
                  <Option value="resource">
                    <Space>
                      <SafetyOutlined style={{ color: '#1890ff' }} />
                      <span>资源权限</span>
                    </Space>
                  </Option>
                  <Option value="button">
                    <Space>
                      <ControlOutlined style={{ color: '#faad14' }} />
                      <span>按钮权限</span>
                    </Space>
                  </Option>
                  <Option value="api">
                    <Space>
                      <ApiOutlined style={{ color: '#722ed1' }} />
                      <span>接口权限</span>
                    </Space>
                  </Option>
                  <Option value="data">
                    <Space>
                      <DatabaseOutlined style={{ color: '#13c2c2' }} />
                      <span>数据权限</span>
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="key"
                label="权限标识"
                rules={[{ required: true, message: '请输入权限标识' }]}
              >
                <Input placeholder="如：user:create、GET /api/users" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="title"
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="请输入权限名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="权限描述"
          >
            <TextArea 
              placeholder="请输入权限描述"
              rows={3}
            />
          </Form.Item>
          
          {/* 数据权限范围配置 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.type !== currentValues.type
            }
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type')
              
              if (type === 'api' || type === 'data') {
                return (
                  <>
                    <Divider orientation="left">数据权限范围</Divider>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="dataScope"
                          label="数据范围"
                        >
                          <Select 
                            placeholder="请选择数据范围"
                            onChange={(value) => {
                              if (value !== 'custom') {
                                addPermissionForm.setFieldsValue({ customDeptIds: [] })
                              }
                            }}
                          >
                            {DATA_SCOPE_OPTIONS.map(option => (
                              <Option key={option.value} value={option.value}>
                                <div>
                                  <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                                  <div style={{ color: '#666', fontSize: '12px' }}>{option.description}</div>
                                </div>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => 
                            prevValues.dataScope !== currentValues.dataScope
                          }
                        >
                          {({ getFieldValue: getAddFieldValue }) => {
                            return getAddFieldValue('dataScope') === 'custom' ? (
                              <Form.Item
                                name="customDeptIds"
                                label="自定义部门"
                                rules={[{ required: true, message: '请选择自定义部门' }]}
                              >
                                <DeptSelector 
                                  placeholder="请选择自定义部门"
                                  mode="multiple"
                                />
                              </Form.Item>
                            ) : null
                          }}
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )
              }
              
              return null
            }}
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setAddPermissionModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                添加权限
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 权限编辑弹窗 */}
      <Modal
        title="编辑权限"
        open={editPermissionModalVisible}
        onCancel={() => {
          setEditPermissionModalVisible(false)
          editPermissionForm.resetFields()
          setEditingPermission(null)
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Alert
          message="权限编辑说明"
          description="修改权限信息，包括权限类型、权限标识、权限名称和描述。接口权限和数据权限可以设置数据范围。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Form
          form={editPermissionForm}
          layout="vertical"
          onFinish={handleSaveEditPermission}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="权限类型"
                rules={[{ required: true, message: '请选择权限类型' }]}
              >
                <Select placeholder="请选择权限类型">
                  <Option value="resource">
                    <Space>
                      <SafetyOutlined style={{ color: '#1890ff' }} />
                      <span>资源权限</span>
                    </Space>
                  </Option>
                  <Option value="button">
                    <Space>
                      <ControlOutlined style={{ color: '#faad14' }} />
                      <span>按钮权限</span>
                    </Space>
                  </Option>
                  <Option value="api">
                    <Space>
                      <ApiOutlined style={{ color: '#722ed1' }} />
                      <span>接口权限</span>
                    </Space>
                  </Option>
                  <Option value="data">
                    <Space>
                      <DatabaseOutlined style={{ color: '#13c2c2' }} />
                      <span>数据权限</span>
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="key"
                label="权限标识"
                rules={[{ required: true, message: '请输入权限标识' }]}
              >
                <Input placeholder="如：user:create、GET /api/users" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="title"
            label="权限名称"
            rules={[{ required: true, message: '请输入权限名称' }]}
          >
            <Input placeholder="请输入权限名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="权限描述"
          >
            <TextArea 
              placeholder="请输入权限描述"
              rows={3}
            />
          </Form.Item>
          
          {/* 数据权限范围配置 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.type !== currentValues.type
            }
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type')
              
              if (type === 'api' || type === 'data') {
                return (
                  <>
                    <Divider orientation="left">数据权限范围</Divider>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="dataScope"
                          label="数据范围"
                        >
                          <Select 
                            placeholder="请选择数据范围"
                            onChange={(value) => {
                              if (value !== 'custom') {
                                editPermissionForm.setFieldsValue({ customDeptIds: [] })
                              }
                            }}
                          >
                            {DATA_SCOPE_OPTIONS.map(option => (
                              <Option key={option.value} value={option.value}>
                                <div>
                                  <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                                  <div style={{ color: '#666', fontSize: '12px' }}>{option.description}</div>
                                </div>
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) => 
                            prevValues.dataScope !== currentValues.dataScope
                          }
                        >
                          {({ getFieldValue: getEditFieldValue }) => {
                            return getEditFieldValue('dataScope') === 'custom' ? (
                              <Form.Item
                                name="customDeptIds"
                                label="自定义部门"
                                rules={[{ required: true, message: '请选择自定义部门' }]}
                              >
                                <DeptSelector 
                                  placeholder="请选择自定义部门"
                                  mode="multiple"
                                />
                              </Form.Item>
                            ) : null
                          }}
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )
              }
              
              return null
            }}
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setEditPermissionModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 权限范围设置弹窗 */}
      <Modal
        title={`权限范围设置 - ${currentPermissionForScope?.title || ''}`}
        open={permissionScopeModalVisible}
        onCancel={() => {
          setPermissionScopeModalVisible(false)
          setCurrentPermissionForScope(null)
          permissionScopeForm.resetFields()
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        {currentPermissionForScope && (
          <>
            <Alert
              message="权限范围设置"
              description={`为 ${currentPermissionForScope.typeLabel} "${currentPermissionForScope.title}" 设置数据访问范围，控制该权限可以访问的数据范围。`}
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Form
              form={permissionScopeForm}
              layout="vertical"
              onFinish={handleSavePermissionScope}
            >
              <Form.Item
                name="dataScope"
                label="数据权限范围"
                rules={[{ required: true, message: '请选择数据权限范围' }]}
              >
                <Select 
                  placeholder="请选择数据权限范围"
                  onChange={(value) => {
                    if (value !== 'custom') {
                      permissionScopeForm.setFieldsValue({ customDeptIds: [] })
                    }
                  }}
                >
                  {DATA_SCOPE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: option.value === 'all' ? '#52c41a' : '#1890ff' }}>
                          {option.label}
                        </div>
                        <div style={{ color: '#666', fontSize: '12px' }}>{option.description}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => 
                  prevValues.dataScope !== currentValues.dataScope
                }
              >
                {({ getFieldValue }) => {
                  return getFieldValue('dataScope') === 'custom' ? (
                    <Form.Item
                      name="customDeptIds"
                      label="自定义部门"
                      rules={[{ required: true, message: '请选择自定义部门' }]}
                    >
                      <DeptSelector 
                        placeholder="请选择自定义部门"
                        mode="multiple"
                      />
                    </Form.Item>
                  ) : null
                }}
              </Form.Item>
              
              <Alert
                message="权限范围说明"
                description={
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
                    <li><strong>全部数据：</strong>可以访问系统中的所有数据，不受部门限制</li>
                    <li><strong>本部门数据：</strong>只能访问本部门的数据</li>
                    <li><strong>本部门及下级部门数据：</strong>可以访问本部门及其下级部门的数据</li>
                    <li><strong>仅本人数据：</strong>只能访问自己创建或负责的数据</li>
                    <li><strong>自定义部门数据：</strong>可以访问指定部门的数据</li>
                  </ul>
                }
                type="info"
                size="small"
                style={{ marginTop: 16 }}
              />
              
              <Form.Item style={{ textAlign: 'right', marginTop: 24, marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => setPermissionScopeModalVisible(false)}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    保存设置
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  )
}

export default MenuManage