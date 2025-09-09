import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Space } from 'antd'

const { Option } = Select
const { TextArea } = Input

/**
 * 角色表单模态框组件
 */
const RoleFormModal = ({
  visible,
  editingRole,
  loading,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm()
  
  // 当编辑角色变化时，更新表单
  useEffect(() => {
    if (visible) {
      if (editingRole) {
        form.setFieldsValue(editingRole)
      } else {
        form.resetFields()
      }
    }
  }, [form, editingRole, visible])
  
  // 处理表单提交
  const handleSubmit = async (values) => {
    const success = await onSave(values, editingRole)
    if (success) {
      form.resetFields()
    }
  }
  
  return (
    <Modal
      title={editingRole ? '编辑角色' : '新增角色'}
      open={visible}
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        
        <Form.Item
          name="code"
          label="角色代码"
          rules={[
            { required: true, message: '请输入角色代码' },
            { pattern: /^[a-z_]+$/, message: '角色代码只能包含小写字母和下划线' },
          ]}
        >
          <Input placeholder="请输入角色代码" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="角色描述"
        >
          <TextArea rows={3} placeholder="请输入角色描述" />
        </Form.Item>
        
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Option value="active">启用</Option>
            <Option value="inactive">禁用</Option>
          </Select>
        </Form.Item>
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingRole ? '更新' : '创建'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RoleFormModal