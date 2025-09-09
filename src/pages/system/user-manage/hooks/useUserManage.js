import { useState, useEffect, useMemo } from 'react'
import { message } from 'antd'
import { useDeptStore } from '@/stores'
import { userAPI } from '@/api'

/**
 * 用户管理业务逻辑Hook
 */
export const useUserManage = () => {
  const { depts, deptTree, fetchDepts, fetchDeptTree } = useDeptStore()
  const [loading, setLoading] = useState(false)
  const [selectedDeptId, setSelectedDeptId] = useState(null)
  const [selectedDeptInfo, setSelectedDeptInfo] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  
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
  
  // 删除用户
  const handleDelete = async (id) => {
    try {
      setUsers(users.filter(user => user.id !== id))
      message.success('用户删除成功')
    } catch (error) {
      message.error('删除失败，请重试')
    }
  }
  
  // 保存用户
  const handleSave = async (values, editingUser) => {
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
      
      return true
    } catch (error) {
      message.error('操作失败，请重试')
      return false
    } finally {
      setLoading(false)
    }
  }
  
  // 刷新数据
  const handleRefresh = () => {
    message.info('刷新数据')
    setSearchKeyword('')
  }
  
  // 重置部门选择
  const handleResetDept = () => {
    setSelectedDeptId(null)
    setSelectedDeptInfo(null)
  }
  
  return {
    // 数据
    users,
    filteredUsers,
    depts,
    deptTree,
    deptUserStats,
    selectedDeptId,
    selectedDeptInfo,
    searchKeyword,
    loading,
    
    // 方法
    setSearchKeyword,
    handleDeptSelect,
    handleDelete,
    handleSave,
    handleRefresh,
    handleResetDept,
  }
}