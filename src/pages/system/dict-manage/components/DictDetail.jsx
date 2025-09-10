import React from 'react'
import { Card, Space, Button, Popconfirm, Tag, Badge, Row, Col, Typography, Alert } from 'antd'
import { FileTextOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from '../dictManage.module.less'

const { Text } = Typography

/**
 * 字典详情组件（右侧上方）
 */
const DictDetail = ({ selectedDict, onEditDict, onDeleteDict }) => {
  return (
    <Card
      title={
        <Space>
          <FileTextOutlined />
          <span>字典详情</span>
          {selectedDict && (
            <Tag color="blue">{selectedDict.dictName}</Tag>
          )}
        </Space>
      }
      extra={
        selectedDict && (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => onEditDict(selectedDict)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个字典吗？"
              onConfirm={() => onDeleteDict(selectedDict.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
      size="small"
      className={styles.dictDetailCard}
      styles={{ body: { padding: '16px', overflow: 'auto' } }}
    >
      {selectedDict ? (
        <div>
          <Row gutter={[16, 16]} className={styles.detailRow}>
            <Col span={12}>
              <div className={styles.detailItem}>
                <Text strong className={styles.detailLabel}>字典编码</Text>
                <Text code className={styles.detailCode}>{selectedDict.dictCode}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.detailItem}>
                <Text strong className={styles.detailLabel}>字典名称</Text>
                <Text className={styles.detailValue}>{selectedDict.dictName}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.detailItem}>
                <Text strong className={styles.detailLabel}>字典类型</Text>
                <Tag 
                  color={selectedDict.dictType === 'sys' ? 'blue' : selectedDict.dictType === 'business' ? 'green' : 'orange'}
                  className={styles.detailTag}
                >
                  {selectedDict.dictType === 'sys' ? '系统字典' : 
                   selectedDict.dictType === 'business' ? '业务字典' : '通用字典'}
                </Tag>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.detailItem}>
                <Text strong className={styles.detailLabel}>状态</Text>
                <Badge 
                  status={selectedDict.status ? 'success' : 'error'} 
                  text={selectedDict.status ? '启用' : '禁用'} 
                />
              </div>
            </Col>
            <Col span={24}>
              <div className={styles.detailItem}>
                <Text strong className={styles.detailLabel}>描述</Text>
                <Text type="secondary" className={styles.detailDescription}>
                  {selectedDict.description || '暂无描述'}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.detailItem}>
                <Text strong className={styles.detailLabel}>创建时间</Text>
                <Text type="secondary" className={styles.detailTime}>{selectedDict.createTime}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.detailItem}>
                <Text strong className={styles.detailLabel}>更新时间</Text>
                <Text type="secondary" className={styles.detailTime}>{selectedDict.updateTime}</Text>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <Alert
          message="请选择字典"
          description="请在左侧字典列表中选择一个字典，然后查看详细信息"
          type="info"
          showIcon
          style={{ margin: '20px 0' }}
        />
      )}
    </Card>
  )
}

export default DictDetail