import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, Result, Button } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppRouter from './AppRouter'
import ErrorBoundary from './components/ErrorBoundary'
import globalErrorHandler from './utils/errorHandler'
import { useErrorStore } from './stores/error'

// 应用级错误边界
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('应用级错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <Result
            status="error"
            title="应用启动失败"
            subTitle="应用在启动过程中遇到错误，请刷新页面重试。"
            extra={[
              <Button type="primary" key="reload" onClick={() => window.location.reload()}>
                刷新页面
              </Button>
            ]}
          >
            <div style={{ marginTop: 16 }}>
              <details>
                <summary>错误详情</summary>
                <pre style={{ marginTop: 8, fontSize: 12, textAlign: 'left' }}>
                  {this.state.error?.toString()}
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
          </Result>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  useEffect(() => {
    // 初始化全局错误处理
    console.log('🛡️ 全局错误处理器已启动')
    
    // 将errorStore传递给全局错误处理器
    const errorStore = useErrorStore.getState()
    globalErrorHandler.setErrorStore(errorStore)
    
    // 清理函数
    return () => {
      // 组件卸载时清理监听器
      if (globalErrorHandler && globalErrorHandler.destroy) {
        globalErrorHandler.destroy()
      }
    }
  }, [])

  return (
    <AppErrorBoundary>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </BrowserRouter>
      </ConfigProvider>
    </AppErrorBoundary>
  )
}

export default App