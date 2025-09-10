import React from 'react'
import { Modal, Alert, Transfer, Row, Col, Space } from 'antd'
import styles from '../roleManage.module.less'

/**
 * 人员分配模态框组件
 */
const UserAssignModal = ({
  visible,
  selectedRole,
  availableUsers,
  assignedUsers,
  loading,
  onSave,
  onCancel,
  onUserChange,
}) => {
  return (
    <Modal
      title={`分配人员 - ${selectedRole?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={() => onSave(selectedRole)}
      confirmLoading={loading}
      width={800}
      className={styles.userAssignModal}
    >
      <Alert
        className={styles.userAssignAlert}
        message="人员分配说明"
        description="选择需要分配给该角色的用户。用户可以同时拥有多个角色，禁用的用户不可分配。"
        type="info"
        showIcon
      />
      
      <div className={styles.transferHeader}>
        <Row gutter={16}>
          <Col span={12}>
            <div className={`${styles.transferHeaderItem} ${styles.transferAvailableHeader}`}>
              可分配用户
            </div>
          </Col>
          <Col span={12}>
            <div className={`${styles.transferHeaderItem} ${styles.transferAssignedHeader}`}>
              已分配用户
            </div>
          </Col>
        </Row>
      </div>
      
      <Transfer
        dataSource={availableUsers}
        titles={['可选用户', '已分配用户']}
        targetKeys={assignedUsers}
        onChange={onUserChange}
        render={item => (
          <div className={styles.transferUserItem}>
            <div className={styles.transferUserInfo}>
              <div className={styles.transferUserName}>{item.title}</div>
              <div className={styles.transferUserDesc}>{item.description}</div>
            </div>
          </div>
        )}
        listStyle={{
          width: 350,
          height: 400
        }}
        showSearch
        showSelectAll
        filterOption={(inputValue, item) => {
          const searchText = inputValue.toLowerCase()
          return item.title.toLowerCase().includes(searchText) ||
                 item.description.toLowerCase().includes(searchText)
        }}
        locale={{
          itemUnit: '人',
          itemsUnit: '人',
          searchPlaceholder: '搜索用户',
          notFoundContent: '无匹配用户'
        }}
      />
      
      {/* 统计信息 */}
      <div className={styles.transferStats}>
        <Space size="large">
          <div className={styles.transferStatItem}>
            <span className={styles.transferStatNumber} style={{ color: '#1890ff' }}>
              {availableUsers.length - assignedUsers.length}
            </span>
            <div className={styles.transferStatLabel}>未分配</div>
          </div>
          <div className={styles.transferStatItem}>
            <span className={styles.transferStatNumber} style={{ color: '#52c41a' }}>
              {assignedUsers.length}
            </span>
            <div className={styles.transferStatLabel}>已分配</div>
          </div>
          <div className={styles.transferStatItem}>
            <span className={styles.transferStatNumber} style={{ color: '#faad14' }}>
              {availableUsers.length}
            </span>
            <div className={styles.transferStatLabel}>总用户数</div>
          </div>
        </Space>
      </div>
    </Modal>
  )
}

export default UserAssignModal