import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Space, Row, Col } from 'antd'
import { DEPT_TYPE_OPTIONS, DEPT_STATUS_OPTIONS } from '@/constants'
import styles from '../deptManage.module.less'

const { Option } = Select
const { TextArea } = Input

/**
 * 部门表单模态框组件
 */
const DeptFormModal = ({
  visible,
  editingDept,
  depts,
  loading,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm()
  
  // 当编辑部门变化时，更新表单
  useEffect(() => {
    if (visible) {
      if (editingDept) {
        form.setFieldsValue(editingDept)
      } else {
        form.resetFields()
        form.setFieldsValue({
          type: 'department',
          status: 'active',
          sort: 1,
        })
      }
    }
  }, [form, editingDept, visible])
  
  // 处理表单提交
  const handleSubmit = async (values) => {
    const success = await onSave(values, editingDept)
    if (success) {
      form.resetFields()
    }
  }
  
  return (
    <Modal
      title={editingDept ? '编辑部门' : '新增部门'}
      open={visible}
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'department',
          status: 'active',
          sort: 1,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="部门名称"
              rules={[{ required: true, message: '请输入部门名称' }]}
            >
              <Input placeholder="请输入部门名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="code"
              label="部门编码"
              rules={[
                { required: true, message: '请输入部门编码' },
                { pattern: /^[A-Z0-9_]+$/, message: '部门编码只能包含大写字母、数字和下划线' },
              ]}
            >
              <Input placeholder="请输入部门编码" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="部门类型"
              rules={[{ required: true, message: '请选择部门类型' }]}
            >
              <Select placeholder="请选择部门类型">
                {DEPT_TYPE_OPTIONS.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                {DEPT_STATUS_OPTIONS.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="parentId"
          label="上级部门"
        >
          <Select
            placeholder="请选择上级部门"
            allowClear
            showSearch
            optionFilterProp="children"
          >
            {depts.filter(dept => dept.id !== editingDept?.id).map(dept => (
              <Option key={dept.id} value={dept.id}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="leaderName"
              label="负责人"
            >
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sort"
              label="排序"
              rules={[{ required: true, message: '请输入排序值' }]}
            >
              <Input type="number" placeholder="请输入排序值" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="联系电话"
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="address"
          label="地址"
        >
          <Input placeholder="请输入部门地址" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="描述"
        >
          <TextArea rows={3} placeholder="请输入部门描述" />
        </Form.Item>
        
        <Form.Item className={styles.deptFormSubmitSection}>
          <Space>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingDept ? '更新' : '创建'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DeptFormModal