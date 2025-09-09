import React from 'react'
import { Row, Col } from 'antd'
import WelcomeCard from './components/WelcomeCard'
import StatisticsCards from './components/StatisticsCards'
import QuickActions from './components/QuickActions'
import SystemInfo from './components/SystemInfo'
import styles from './dashboard.module.css'

/**
 * 仪表板页面主组件
 */
const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      {/* 欢迎信息 */}
      <WelcomeCard />
      
      {/* 统计卡片 */}
      <StatisticsCards />
      
      {/* 快捷操作和系统信息 */}
      <Row gutter={[16, 16]} className={styles.actionsRow}>
        <Col xs={24} md={12}>
          <QuickActions />
        </Col>
        
        <Col xs={24} md={12}>
          <SystemInfo />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard