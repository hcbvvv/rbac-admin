import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  MenuOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import styles from '../dashboard.module.css'

/**
 * 统计卡片组件
 */
const StatisticsCards = () => {
  // 模拟统计数据
  const statistics = [
    {
      title: '用户总数',
      value: 1234,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: '人',
      icon: <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
    },
    {
      title: '角色数量',
      value: 15,
      precision: 0,
      valueStyle: { color: '#cf1322' },
      prefix: <ArrowDownOutlined />,
      suffix: '个',
      icon: <TeamOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    },
    {
      title: '权限数量',
      value: 89,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: '项',
      icon: <SafetyOutlined style={{ fontSize: 24, color: '#faad14' }} />,
    },
    {
      title: '菜单数量',
      value: 32,
      precision: 0,
      valueStyle: { color: '#3f8600' },
      prefix: <ArrowUpOutlined />,
      suffix: '个',
      icon: <MenuOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
    },
  ]
  
  return (
    <Row gutter={[16, 16]} className={styles.statisticsRow}>
      {statistics.map((stat, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <Card className={styles.statisticCard}>
            <div className={styles.statisticContent}>
              <div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  precision={stat.precision}
                  valueStyle={stat.valueStyle}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className={styles.statisticIcon}>
                {stat.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default StatisticsCards