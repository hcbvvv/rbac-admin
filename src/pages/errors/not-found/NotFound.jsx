import React from 'react'
import { Result, Button, Space, Typography, Card } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import { HomeOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons'
import styles from './notFound.module.css'

const { Text } = Typography

/**
 * 404 页面
 */
const NotFound = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 返回上一页
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/dashboard')
    }
  }
  
  // 刷新当前页面
  const refresh = () => {
    window.location.reload()
  }
  
  return (
    <div className={styles.notFoundContainer}>
      <Card className={styles.notFoundCard}>
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在。"
          className={styles.notFoundResult}
          extra={
            <Space wrap className={styles.notFoundExtra}>
              <Button 
                type="primary" 
                icon={<HomeOutlined />}
                onClick={() => navigate('/dashboard')}
                className={styles.notFoundButton}
              >
                返回首页
              </Button>
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={goBack}
                className={styles.notFoundButton}
              >
                返回上页
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={refresh}
                className={styles.notFoundButton}
              >
                刷新页面
              </Button>
            </Space>
          }
        />
        
        <div className={styles.notFoundInfo}>
          <Text className={styles.notFoundPath}>
            当前访问路径：{location.pathname}
          </Text>
          <br />
          <Text className={styles.notFoundContact}>
            如果您认为这是一个错误，请联系系统管理员
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default NotFound