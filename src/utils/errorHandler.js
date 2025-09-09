import { message } from 'antd'

/**
 * 全局错误处理工具
 */
class GlobalErrorHandler {
  constructor() {
    this.errorCallbacks = []
    this.errorStore = null // 将在初始化时设置
    this.init()
  }

  /**
   * 设置错误状态库
   */
  setErrorStore(errorStore) {
    this.errorStore = errorStore
  }

  /**
   * 初始化全局错误监听
   */
  init() {
    // 捕获未处理的Promise错误
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this))
    
    // 捕获JavaScript运行时错误
    window.addEventListener('error', this.handleError.bind(this))
    
    // 捕获资源加载错误
    window.addEventListener('error', this.handleResourceError.bind(this), true)
  }

  /**
   * 处理Promise拒绝错误
   */
  handlePromiseRejection(event) {
    console.error('Unhandled Promise Rejection:', event.reason)
    
    const error = {
      type: 'promise_rejection',
      message: event.reason?.message || '未处理的Promise错误',
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }

    this.reportError(error)
    
    // 根据错误类型决定是否显示错误页面
    if (this.shouldShowErrorPage(event.reason)) {
      this.showError(error)
    } else {
      message.error('操作失败，请重试')
    }
    
    // 阻止默认的错误处理
    event.preventDefault()
  }

  /**
   * 处理JavaScript运行时错误
   */
  handleError(event) {
    // 排除资源加载错误
    if (event.target !== window) {
      return
    }

    console.error('JavaScript Error:', event.error)
    
    const error = {
      type: 'javascript_error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }

    this.reportError(error)
    
    // JavaScript错误通常需要显示500页面
    if (this.shouldShowErrorPage(event.error)) {
      this.showError(error)
    }
  }

  /**
   * 处理资源加载错误
   */
  handleResourceError(event) {
    if (event.target === window) {
      return
    }

    const error = {
      type: 'resource_error',
      message: `资源加载失败: ${event.target.src || event.target.href}`,
      element: event.target.tagName,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }

    console.warn('Resource Loading Error:', error)
    this.reportError(error)
    
    // 资源错误通常不需要显示500页面，只记录即可
    message.warning('部分资源加载失败')
  }

  /**
   * 判断是否应该显示错误页面
   */
  shouldShowErrorPage(error) {
    if (!error) return false
    
    // 网络错误不显示500页面
    if (error.name === 'NetworkError' || error.message?.includes('fetch')) {
      return false
    }
    
    // 取消的请求不显示500页面
    if (error.name === 'AbortError' || error.message?.includes('abort')) {
      return false
    }
    
    // 所有严重错误都显示错误页面（包括403、500等）
    return true
  }

  /**
   * 检查是否在主布局中
   */
  isInMainLayout() {
    const path = window.location.pathname
    // 如果是登录页、错误页等独立页面，则不在主布局中
    const standalonePages = ['/login', '/register', '/404', '/403', '/500']
    return !standalonePages.some(page => path.startsWith(page))
  }

  /**
   * 显示内联错误或跳转错误页面
   */
  showError(error, errorType = null) {
    // 自动检测错误类型
    if (!errorType) {
      if (error.status === 403 || error.message?.includes('权限')) {
        errorType = '403'
      } else if (error.status === 404 || error.message?.includes('不存在')) {
        errorType = '404'
      } else {
        errorType = '500'
      }
    }
    
    // 检查是否在主布局中
    if (this.isInMainLayout() && this.errorStore) {
      // 在主布局中，显示内联错误
      console.log('📍 在主布局中显示内联错误', { errorType, error })
      this.errorStore.showError(errorType, error)
    } else {
      // 不在主布局中，跳转到错误页面
      console.log('🔄 跳转到错误页面', { errorType, error })
      this.redirectToErrorPage(error, errorType)
    }
  }

  /**
   * 重定向到错误页面
   */
  redirectToErrorPage(error, errorType = '500') {
    // 避免在错误页面再次重定向
    const currentPath = window.location.pathname
    if (currentPath === `/${errorType}`) {
      return
    }
    
    // 将错误信息存储到sessionStorage，供错误页面使用
    try {
      sessionStorage.setItem('lastError', JSON.stringify(error))
    } catch (e) {
      // 忽略存储错误
    }
    
    // 重定向到错误页面
    window.location.href = `/${errorType}`
  }

  /**
   * 报告错误到监控服务
   */
  reportError(error) {
    // 这里可以集成错误监控服务
    console.group('🚨 全局错误报告')
    console.error('错误类型:', error.type)
    console.error('错误信息:', error.message)
    console.error('发生时间:', error.timestamp)
    console.error('页面地址:', error.url)
    if (error.stack) {
      console.error('错误堆栈:', error.stack)
    }
    console.groupEnd()

    // 调用注册的错误回调
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error)
      } catch (e) {
        console.error('错误回调执行失败:', e)
      }
    })

    // TODO: 发送错误到监控服务
    // this.sendToMonitoringService(error)
  }

  /**
   * 注册错误回调
   */
  onError(callback) {
    this.errorCallbacks.push(callback)
  }

  /**
   * 移除错误回调
   */
  offError(callback) {
    const index = this.errorCallbacks.indexOf(callback)
    if (index > -1) {
      this.errorCallbacks.splice(index, 1)
    }
  }

  /**
   * 手动报告错误
   */
  captureError(error, context = {}) {
    const errorInfo = {
      type: 'manual_capture',
      message: error?.message || String(error),
      stack: error?.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }

    this.reportError(errorInfo)
    
    if (this.shouldShowErrorPage(error)) {
      this.showError(errorInfo)
    }
  }

  /**
   * 销毁监听器
   */
  destroy() {
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection)
    window.removeEventListener('error', this.handleError)
    this.errorCallbacks = []
  }
}

// 创建全局实例
const globalErrorHandler = new GlobalErrorHandler()

// 导出工具函数
export const captureError = (error, context) => {
  globalErrorHandler.captureError(error, context)
}

export const onGlobalError = (callback) => {
  globalErrorHandler.onError(callback)
}

export const offGlobalError = (callback) => {
  globalErrorHandler.offError(callback)
}

export default globalErrorHandler