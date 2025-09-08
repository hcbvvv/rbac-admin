/**
 * API使用示例
 * 展示如何使用新的模块化API结构
 */

// 方式1: 导入单个API模块
import { authAPI } from '@/api'
import { userAPI } from '@/api'
import { roleAPI } from '@/api'

// 方式2: 导入多个API模块
import { authAPI, userAPI, roleAPI, deptAPI } from '@/api'

// 方式3: 导入所有API (不推荐，会增加打包体积)
import * as API from '@/api'

// 方式4: 动态导入 (推荐用于按需加载)
const { authAPI } = await import('@/api')

/**
 * 使用示例
 */
export const examples = {
  // 用户登录
  async login() {
    try {
      const response = await authAPI.login({
        username: 'admin',
        password: '123456'
      })
      console.log('登录成功:', response)
      return response
    } catch (error) {
      console.error('登录失败:', error)
    }
  },

  // 获取用户列表
  async getUserList() {
    try {
      const users = await userAPI.getUsers({
        page: 1,
        pageSize: 10
      })
      console.log('用户列表:', users)
      return users
    } catch (error) {
      console.error('获取用户列表失败:', error)
    }
  },

  // 创建角色
  async createRole() {
    try {
      const role = await roleAPI.createRole({
        name: '测试角色',
        code: 'test_role',
        description: '这是一个测试角色'
      })
      console.log('角色创建成功:', role)
      return role
    } catch (error) {
      console.error('创建角色失败:', error)
    }
  },

  // 获取部门树
  async getDeptTree() {
    try {
      const tree = await deptAPI.getDeptTree()
      console.log('部门树:', tree)
      return tree
    } catch (error) {
      console.error('获取部门树失败:', error)
    }
  }
}

/**
 * 在React组件中使用API的示例
 */
export const ReactComponentExample = `
import React, { useState, useEffect } from 'react'
import { userAPI, roleAPI } from '@/api'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)

  // 获取数据
  const fetchData = async () => {
    setLoading(true)
    try {
      const [usersData, rolesData] = await Promise.all([
        userAPI.getUsers(),
        roleAPI.getRoles()
      ])
      setUsers(usersData)
      setRoles(rolesData)
    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 创建用户
  const handleCreateUser = async (userData) => {
    try {
      await userAPI.createUser(userData)
      // 刷新用户列表
      fetchData()
    } catch (error) {
      console.error('创建用户失败:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      {/* 组件内容 */}
    </div>
  )
}
`

/**
 * 在Zustand Store中使用API的示例
 */
export const ZustandStoreExample = `
import { create } from 'zustand'
import { userAPI } from '@/api'

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,

  // 获取用户列表
  fetchUsers: async (params) => {
    set({ loading: true })
    try {
      const users = await userAPI.getUsers(params)
      set({ users, loading: false })
      return users
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  // 创建用户
  createUser: async (userData) => {
    try {
      const user = await userAPI.createUser(userData)
      const { users } = get()
      set({ users: [...users, user] })
      return user
    } catch (error) {
      throw error
    }
  },

  // 删除用户
  deleteUser: async (userId) => {
    try {
      await userAPI.deleteUser(userId)
      const { users } = get()
      set({ users: users.filter(u => u.id !== userId) })
    } catch (error) {
      throw error
    }
  }
}))
`