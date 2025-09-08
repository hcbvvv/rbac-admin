import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 应用全局状态管理
export const useAppStore = create(
  persist(
    (set, get) => ({
      // 侧边栏状态
      collapsed: false,
      
      // 主题设置
      theme: 'light', // 'light' | 'dark'
      
      // 布局设置
      layout: 'side', // 'side' | 'top' | 'mix'
      
      // 面包屑显示
      showBreadcrumb: true,
      
      // 页签显示
      showTabs: true,
      
      // 页面加载状态
      loading: false,
      
      // 切换侧边栏折叠状态
      toggleCollapsed: () => {
        set({ collapsed: !get().collapsed })
      },
      
      // 设置侧边栏折叠状态
      setCollapsed: (collapsed) => {
        set({ collapsed })
      },
      
      // 设置主题
      setTheme: (theme) => {
        set({ theme })
      },
      
      // 设置布局
      setLayout: (layout) => {
        set({ layout })
      },
      
      // 设置面包屑显示
      setBreadcrumb: (showBreadcrumb) => {
        set({ showBreadcrumb })
      },
      
      // 设置页签显示
      setTabs: (showTabs) => {
        set({ showTabs })
      },
      
      // 设置加载状态
      setLoading: (loading) => {
        set({ loading })
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        collapsed: state.collapsed,
        theme: state.theme,
        layout: state.layout,
        showBreadcrumb: state.showBreadcrumb,
        showTabs: state.showTabs,
      }),
    }
  )
)