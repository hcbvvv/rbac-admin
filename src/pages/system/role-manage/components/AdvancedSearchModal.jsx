import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Row, Col, Alert, Button } from 'antd'
import styles from '../roleManage.module.css'

const { Option } = Select

/**
 * 高级查询模态框组件
 */
const AdvancedSearchModal = ({
  visible,
  advancedSearchParams,
  onSearch,
  onCancel,
  onClear,
}) => {
  const [form] = Form.useForm()
  
  // 当模态框显示时，初始化表单值
  useEffect(() => {
    if (visible) {
      form.setFieldsValue(advancedSearchParams)
    }
  }, [form, advancedSearchParams, visible])
  
  // 处理清除条件
  const handleClear = () => {
    form.resetFields()
    onClear()
  }
  
  return (
    <Modal
      title="高级查询"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="clear" onClick={handleClear}>
          清除条件
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          应用筛选
        </Button>
      ]}
      width={600}
      className={styles.advancedSearchModal}
    >
      <Alert
        className={styles.advancedSearchAlert}
        message="高级查询说明"
        description="设置更多的筛选条件，与基础查询同时生效。留空的条件将被忽略。"
        type="info"
        showIcon
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onSearch}
        initialValues={advancedSearchParams}
        className={styles.advancedSearchForm}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="角色代码"
            >
              <Input placeholder="请输入角色代码" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="角色类型"
            >
              <Select placeholder="请选择角色类型" allowClear>
                <Option value="system">系统角色</Option>
                <Option value="custom">自定义角色</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="userCountMin"
              label="最少用户数"
            >
              <Input type="number" placeholder="请输入最少用户数" min="0" allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="userCountMax"
              label="最多用户数"
            >
              <Input type="number" placeholder="请输入最多用户数" min="0" allowClear />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Alert
              message="更多筛选条件（如创建日期范围、最后修改日期等）可根据需要扩展"
              type="success"
              className={styles.advancedSearchNote}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AdvancedSearchModal