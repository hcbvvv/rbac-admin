import { create } from 'zustand'

/**
 * 错误状态管理 Store
 * 用于管理内联错误显示状态
 */
export const useErrorStore = create((set, get) => ({
  // 错误显示状态
  showInlineError: false,
  errorType: '500',
  errorInfo: null,
  onRetry: null,
  
  // 显示内联错误
  showError: (type = '500', info = null, retryCallback = null) => {
    console.log('📋 显示内联错误:', { type, info })
    set({
      showInlineError: true,
      errorType: type,
      errorInfo: info,
      onRetry: retryCallback
    })
  },
  
  // 隐藏内联错误
  hideError: () => {
    console.log('✅ 隐藏内联错误')
    set({
      showInlineError: false,
      errorType: '500',
      errorInfo: null,
      onRetry: null
    })
  },
  
  // 清空错误信息
  clearError: () => {
    set({
      showInlineError: false,
      errorType: '500',
      errorInfo: null,
      onRetry: null
    })
  },
  
  // 检查当前是否在主布局中
  isInMainLayout: () => {
    const path = window.location.pathname
    // 如果是登录页、错误页等独立页面，则不在主布局中
    const standalonePages = ['/login', '/register', '/404', '/403', '/500']
    return !standalonePages.some(page => path.startsWith(page))
  }
}))

export default useErrorStore