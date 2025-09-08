import { create } from 'zustand'
import { deptAPI } from '@/api'

// 部门状态管理
export const useDeptStore = create((set, get) => ({
  // 状态
  depts: [],
  deptTree: [],
  currentDept: null,
  loading: false,
  
  // 获取部门列表
  fetchDepts: async (params = {}) => {
    set({ loading: true })
    try {
      // 模拟部门数据（实际项目中应该从后端获取）
      const mockDepts = [
        {
          id: '1',
          name: '总公司',
          code: 'HQ',
          type: 'company',
          parentId: null,
          leaderId: '1',
          leaderName: '张总',
          phone: '010-12345678',
          email: 'hq@company.com',
          address: '北京市朝阳区xxx路xxx号',
          status: 'active',
          sort: 1,
          description: '集团总部',
          createdAt: '2024-01-01 10:00:00',
        },
        {
          id: '2',
          name: '技术部',
          code: 'TECH',
          type: 'department',
          parentId: '1',
          leaderId: '2',
          leaderName: '李经理',
          phone: '010-12345679',
          email: 'tech@company.com',
          address: '北京市朝阳区xxx路xxx号3楼',
          status: 'active',
          sort: 1,
          description: '负责技术研发工作',
          createdAt: '2024-01-01 11:00:00',
        },
        {
          id: '3',
          name: '前端组',
          code: 'FE',
          type: 'team',
          parentId: '2',
          leaderId: '3',
          leaderName: '王组长',
          phone: '010-12345680',
          email: 'fe@company.com',
          address: '北京市朝阳区xxx路xxx号3楼301',
          status: 'active',
          sort: 1,
          description: '前端开发团队',
          createdAt: '2024-01-01 12:00:00',
        },
        {
          id: '4',
          name: '后端组',
          code: 'BE',
          type: 'team',
          parentId: '2',
          leaderId: '4',
          leaderName: '赵组长',
          phone: '010-12345681',
          email: 'be@company.com',
          address: '北京市朝阳区xxx路xxx号3楼302',
          status: 'active',
          sort: 2,
          description: '后端开发团队',
          createdAt: '2024-01-01 13:00:00',
        },
        {
          id: '5',
          name: '人事部',
          code: 'HR',
          type: 'department',
          parentId: '1',
          leaderId: '5',
          leaderName: '刘经理',
          phone: '010-12345682',
          email: 'hr@company.com',
          address: '北京市朝阳区xxx路xxx号2楼',
          status: 'active',
          sort: 2,
          description: '人力资源管理',
          createdAt: '2024-01-01 14:00:00',
        },
        {
          id: '6',
          name: '财务部',
          code: 'FINANCE',
          type: 'department',
          parentId: '1',
          leaderId: '6',
          leaderName: '陈经理',
          phone: '010-12345683',
          email: 'finance@company.com',
          address: '北京市朝阳区xxx路xxx号4楼',
          status: 'active',
          sort: 3,
          description: '财务管理',
          createdAt: '2024-01-01 15:00:00',
        },
      ]
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      set({ depts: mockDepts, loading: false })
      return mockDepts
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  // 获取部门树
  fetchDeptTree: async () => {
    try {
      const depts = await get().fetchDepts()
      const deptTree = get().buildDeptTree(depts)
      set({ deptTree })
      return deptTree
    } catch (error) {
      throw error
    }
  },
  
  // 构建部门树
  buildDeptTree: (depts, parentId = null) => {
    return depts
      .filter(dept => dept.parentId === parentId)
      .map(dept => ({
        ...dept,
        children: get().buildDeptTree(depts, dept.id),
      }))
      .sort((a, b) => a.sort - b.sort)
  },
  
  // 获取部门详情
  fetchDeptDetail: async (id) => {
    set({ loading: true })
    try {
      const dept = await deptAPI.getDept(id)
      set({ currentDept: dept, loading: false })
      return dept
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  // 创建部门
  createDept: async (deptData) => {
    set({ loading: true })
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newDept = {
        id: Date.now().toString(),
        ...deptData,
        createdAt: new Date().toLocaleString(),
      }
      
      const currentDepts = get().depts
      set({ 
        depts: [...currentDepts, newDept],
        loading: false 
      })
      
      // 重新构建部门树
      get().fetchDeptTree()
      
      return newDept
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  // 更新部门
  updateDept: async (id, deptData) => {
    set({ loading: true })
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const currentDepts = get().depts
      const updatedDepts = currentDepts.map(dept =>
        dept.id === id ? { ...dept, ...deptData } : dept
      )
      
      set({ 
        depts: updatedDepts,
        loading: false 
      })
      
      // 重新构建部门树
      get().fetchDeptTree()
      
      return updatedDepts.find(dept => dept.id === id)
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  // 删除部门
  deleteDept: async (id) => {
    set({ loading: true })
    try {
      // 检查是否有子部门
      const currentDepts = get().depts
      const hasChildren = currentDepts.some(dept => dept.parentId === id)
      
      if (hasChildren) {
        throw new Error('该部门下还有子部门，无法删除')
      }
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedDepts = currentDepts.filter(dept => dept.id !== id)
      set({ 
        depts: updatedDepts,
        loading: false 
      })
      
      // 重新构建部门树
      get().fetchDeptTree()
      
      return true
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },
  
  // 获取所有子部门ID（包括自身）
  getSubDeptIds: (deptId, includeSelf = true) => {
    const depts = get().depts
    const result = includeSelf ? [deptId] : []
    
    const findChildren = (parentId) => {
      depts.forEach(dept => {
        if (dept.parentId === parentId) {
          result.push(dept.id)
          findChildren(dept.id)
        }
      })
    }
    
    findChildren(deptId)
    return result
  },
  
  // 获取部门路径（从根到当前部门）
  getDeptPath: (deptId) => {
    const depts = get().depts
    const path = []
    
    const findPath = (id) => {
      const dept = depts.find(d => d.id === id)
      if (dept) {
        path.unshift(dept)
        if (dept.parentId) {
          findPath(dept.parentId)
        }
      }
    }
    
    findPath(deptId)
    return path
  },
  
  // 清除部门数据
  clearDepts: () => {
    set({
      depts: [],
      deptTree: [],
      currentDept: null,
    })
  },
}))