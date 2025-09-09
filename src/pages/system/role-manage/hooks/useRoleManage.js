import { useState, useEffect } from 'react'
import { message } from 'antd'

/**
 * 角色管理业务逻辑Hook
 */
export const useRoleManage = () => {
  const [loading, setLoading] = useState(false)
  
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
  
  // 权限配置相关状态
  const [checkedPermissions, setCheckedPermissions] = useState([])
  
  // 人员分配相关状态
  const [assignedUsers, setAssignedUsers] = useState([])
  const [availableUsers, setAvailableUsers] = useState([])
  
  // 模拟角色数据
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
    setAvailableUsers(users.map(user => ({
      key: user.id,
      title: `${user.name}(${user.username})`,
      description: `${user.deptName} | ${user.email}`,
      disabled: user.status === 'inactive'
    })))
  }
  
  // 基础查询功能
  const handleBasicSearch = (params) => {
    const newBasicParams = { ...basicSearchParams, ...params }
    setBasicSearchParams(newBasicParams)
    performSearch(newBasicParams, advancedSearchParams)
  }
  
  // 高级查询功能
  const handleAdvancedSearch = (values) => {
    setAdvancedSearchParams(values)
    performSearch(basicSearchParams, values)
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
    
    setFilteredRoles(filtered)
  }
  
  // 清除所有查询条件
  const handleClearAllSearch = () => {
    setBasicSearchParams({ name: '', status: '' })
    setAdvancedSearchParams({ 
      code: '', 
      type: '', 
      userCountMin: '', 
      userCountMax: '', 
      createdAtStart: '', 
      createdAtEnd: '' 
    })
    setFilteredRoles(roles)
    message.info('已清除所有查询条件')
  }
  
  // 删除角色
  const handleDelete = async (id) => {
    try {
      setRoles(roles.filter(role => role.id !== id))
      message.success('角色删除成功')
    } catch (error) {
      message.error('删除失败，请重试')
    }
  }
  
  // 保存角色
  const handleSave = async (values, editingRole) => {
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
      
      return true
    } catch (error) {
      message.error('操作失败，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 权限配置相关
  const handlePermissionConfig = (role) => {
    // 模拟获取角色已有权限
    setCheckedPermissions(['user:view', 'user:create'])
  }
  
  // 保存权限配置
  const handleSavePermissions = async () => {
    try {
      setLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success('权限配置保存成功')
      return true
    } catch (error) {
      message.error('保存失败，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 人员分配相关
  const handleUserAssignConfig = (role) => {
    // 获取当前角色已分配的用户
    const assignedUserIds = users.filter(user => user.roleIds.includes(role.id)).map(user => user.id)
    setAssignedUsers(assignedUserIds)
  }
  
  // 保存人员分配
  const handleSaveUserAssign = async (selectedRole) => {
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
      return true
    } catch (error) {
      message.error('保存失败，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 刷新数据
  const handleRefresh = () => {
    setFilteredRoles(roles)
    message.info('刷新数据')
  }
  
  return {
    // 数据
    roles,
    filteredRoles,
    basicSearchParams,
    advancedSearchParams,
    checkedPermissions,
    assignedUsers,
    availableUsers,
    loading,
    
    // 方法
    handleBasicSearch,
    handleAdvancedSearch,
    handleClearAllSearch,
    handleDelete,
    handleSave,
    handlePermissionConfig,
    handleSavePermissions,
    handleUserAssignConfig,
    handleSaveUserAssign,
    handleRefresh,
    setCheckedPermissions,
    setAssignedUsers,
  }
}