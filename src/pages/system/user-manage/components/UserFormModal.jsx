import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Button, Space } from 'antd'
import { DeptSelector } from '@/components'

const { Option } = Select

/**
 * 用户表单模态框组件
 */
const UserFormModal = ({
  visible,
  editingUser,
  loading,
  selectedDeptId,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm()
  
  // 当编辑用户或选中部门变化时，更新表单
  useEffect(() => {
    if (visible) {
      if (editingUser) {
        form.setFieldsValue(editingUser)
      } else {
        form.resetFields()
        // 如果当前选中了部门，设置为默认部门
        if (selectedDeptId) {
          form.setFieldsValue({ deptId: selectedDeptId })
        }
      }
    }
  }, [form, editingUser, selectedDeptId, visible])
  
  // 处理表单提交
  const handleSubmit = async (values) => {
    const success = await onSave(values, editingUser)
    if (success) {
      form.resetFields()
    }
  }
  
  return (
    <Modal
      title={editingUser ? '编辑用户' : '新增用户'}
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
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, message: '用户名至少3个字符' },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        
        <Form.Item
          name="deptId"
          label="所属部门"
          rules={[{ required: true, message: '请选择所属部门' }]}
        >
          <DeptSelector 
            placeholder="请选择所属部门" 
            showSearch
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Option value="active">正常</Option>
            <Option value="inactive">禁用</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="roles"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select mode="multiple" placeholder="请选择角色">
            <Option value="super_admin">超级管理员</Option>
            <Option value="admin">管理员</Option>
            <Option value="user">普通用户</Option>
          </Select>
        </Form.Item>
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingUser ? '更新' : '创建'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserFormModal