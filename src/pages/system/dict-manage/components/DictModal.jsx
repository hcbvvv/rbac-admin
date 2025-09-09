import React from 'react'
import { Modal, Form, Input, Select, Switch, Space, Button } from 'antd'

const { Option } = Select

/**
 * 字典表单模态框组件
 */
const DictModal = ({ visible, editingDict, loading, form, onSave, onCancel }) => {
  return (
    <Modal
      title={editingDict ? '编辑字典' : '新增字典'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
      >
        <Form.Item
          name="dictCode"
          label="字典编码"
          rules={[
            { required: true, message: '请输入字典编码' },
            { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '编码必须以字母开头，只能包含字母、数字和下划线' }
          ]}
        >
          <Input placeholder="请输入字典编码" />
        </Form.Item>

        <Form.Item
          name="dictName"
          label="字典名称"
          rules={[{ required: true, message: '请输入字典名称' }]}
        >
          <Input placeholder="请输入字典名称" />
        </Form.Item>

        <Form.Item
          name="dictType"
          label="字典类型"
          rules={[{ required: true, message: '请选择字典类型' }]}
        >
          <Select placeholder="请选择字典类型">
            <Option value="sys">系统字典</Option>
            <Option value="business">业务字典</Option>
            <Option value="common">通用字典</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <Input.TextArea 
            rows={3}
            placeholder="请输入字典描述"
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序号' }]}
        >
          <Input type="number" placeholder="请输入排序号" />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingDict ? '更新' : '创建'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DictModal