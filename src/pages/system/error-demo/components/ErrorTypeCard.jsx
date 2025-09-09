import React from 'react'
import { Card, Button, List, Space } from 'antd'
import styles from '../errorDemo.module.css'

/**
 * 错误类型卡片组件
 */
const ErrorTypeCard = ({ errorType, loading }) => {
  return (
    <Card 
      className={styles.errorTypeCard}
      size="small"
    >
      <div 
        className={styles.errorTypeHeader}
        style={{ borderLeft: `4px solid ${errorType.color}` }}
      >
        <div 
          className={styles.errorTypeIcon}
          style={{ color: errorType.color }}
        >
          {errorType.icon}
        </div>
        <div className={styles.errorTypeTitle}>
          {errorType.title}
        </div>
        <div className={styles.errorTypeStatus}>
          <span style={{ color: errorType.color, fontWeight: 'bold' }}>
            {errorType.status}
          </span>
        </div>
      </div>
      
      <div className={styles.errorTypeContent}>
        <div className={styles.errorTypeSubtitle}>
          {errorType.subtitle}
        </div>
        
        <div className={styles.errorTypeDescription}>
          {errorType.description}
        </div>
        
        <div className={styles.errorTypeList}>
          <div className={styles.errorTypeListTitle}>常见原因:</div>
          <List
            size="small"
            dataSource={errorType.causes}
            renderItem={item => (
              <List.Item className={styles.errorTypeListItem}>
                • {item}
              </List.Item>
            )}
          />
        </div>
        
        <div className={styles.errorTypeList}>
          <div className={styles.errorTypeListTitle}>解决方案:</div>
          <List
            size="small"
            dataSource={errorType.solutions}
            renderItem={item => (
              <List.Item className={styles.errorTypeListItem}>
                ✓ {item}
              </List.Item>
            )}
          />
        </div>
        
        <div className={styles.errorTypeActions}>
          <Button 
            type="primary" 
            onClick={errorType.action}
            loading={loading && errorType.key === 'network'}
          >
            触发错误
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ErrorTypeCard