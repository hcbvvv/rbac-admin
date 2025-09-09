import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@/api'

// 认证状态管理
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 状态
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      
      // 登录
      login: async (credentials) => {
        set({ loading: true })
        try {
          // 模拟登录验证（实际项目中应该调用真实 API）
          const mockUsers = {
            admin: {
              user: {
                id: '1',
                username: 'admin',
                name: '管理员',
                email: 'admin@example.com',
                avatar: null,
                roles: [{ id: '1', name: '超级管理员', code: 'super_admin' }],
              },
              token: 'mock-admin-token-123456',
              refreshToken: 'mock-admin-refresh-token-123456',
            },
            user: {
              user: {
                id: '2',
                username: 'user',
                name: '普通用户',
                email: 'user@example.com',
                avatar: null,
                roles: [{ id: '2', name: '普通用户', code: 'user' }],
              },
              token: 'mock-user-token-123456',
              refreshToken: 'mock-user-refresh-token-123456',
            },
          }
          
          // 模拟网络延迟
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const mockUser = mockUsers[credentials.username]
          if (!mockUser || credentials.password !== credentials.username + '123') {
            throw new Error('用户名或密码错误')
          }
          
          const { user, token, refreshToken } = mockUser
          
          // 保存 token 到 localStorage
          localStorage.setItem('access_token', token)
          localStorage.setItem('refresh_token', refreshToken)
          localStorage.setItem('user_info', JSON.stringify(user))
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          })
          
          return { success: true, data: { user, token, refreshToken } }
        } catch (error) {
          set({ loading: false })
          return { success: false, error: error.message }
        }
      },
      
      // 登出
      logout: async () => {
        try {
          // 模拟 API 调用（实际项目中可以调用真实 API）
          // await authAPI.logout()
          console.log('用户登出')
        } catch (error) {
          console.error('登出接口调用失败:', error)
        } finally {
          // 清除本地存储
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_info')
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          })
        }
      },
      
      // 获取用户信息
      fetchUserInfo: async () => {
        set({ loading: true })
        try {
          // 模拟 API 调用，返回默认用户信息
          await new Promise(resolve => setTimeout(resolve, 500)) // 模拟网络延迟
          
          const user = {
            id: '1',
            username: 'admin',
            name: '管理员',
            email: 'admin@example.com',
            avatar: null,
            roles: [{ id: '1', name: '超级管理员', code: 'super_admin' }],
          }
          
          // 保存到 localStorage
          localStorage.setItem('user_info', JSON.stringify(user))
          
          set({ user, loading: false })
          return user
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },
      
      // 刷新 token
      refreshToken: async () => {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          get().logout()
          return false
        }
        
        try {
          const response = await authAPI.refreshToken(refreshToken)
          const { token: newToken, refreshToken: newRefreshToken } = response
          
          localStorage.setItem('access_token', newToken)
          localStorage.setItem('refresh_token', newRefreshToken)
          
          set({ token: newToken })
          return true
        } catch (error) {
          get().logout()
          return false
        }
      },
      
      // 初始化认证状态
      initAuth: () => {
        const token = localStorage.getItem('access_token')
        const userInfo = localStorage.getItem('user_info')
        
        if (token) {
          try {
            const user = userInfo ? JSON.parse(userInfo) : null
            set({
              token,
              user,
              isAuthenticated: true,
              loading: false
            })
            
            // 如果没有用户信息，尝试获取（但不阻塞初始化）
            if (!user) {
              get().fetchUserInfo().catch((error) => {
                console.warn('获取用户信息失败，将使用默认用户信息:', error)
                // 设置默认用户信息，防止页面空白
                const defaultUser = {
                  id: '1',
                  username: 'admin',
                  name: '管理员',
                  email: 'admin@example.com',
                  avatar: null,
                  roles: [{ id: '1', name: '超级管理员', code: 'super_admin' }],
                }
                set({ user: defaultUser })
              })
            }
          } catch (error) {
            console.error('初始化认证状态失败:', error)
            get().logout()
          }
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false
          })
        }
      },
      
      // 更新个人信息
      updateProfile: async (profileData) => {
        const currentUser = get().user
        if (!currentUser) {
          throw new Error('用户未登录')
        }
        
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // 更新用户信息
          const updatedUser = {
            ...currentUser,
            ...profileData
          }
          
          // 保存到localStorage
          localStorage.setItem('user_info', JSON.stringify(updatedUser))
          
          set({ user: updatedUser })
          return updatedUser
        } catch (error) {
          console.error('更新个人信息失败:', error)
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)