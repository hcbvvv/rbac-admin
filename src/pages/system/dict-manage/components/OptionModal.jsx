import React from 'react'
import { Modal, Form, Input, Select, Switch, Space, Button } from 'antd'

const { Option } = Select

/**
 * 选项表单模态框组件
 */
const OptionModal = ({ visible, editingOption, selectedDict, loading, form, onSave, onCancel }) => {
  return (
    <Modal
      title={editingOption ? '编辑选项' : '新增选项'}
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
          label="所属字典"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="label"
          label="选项标签"
          rules={[{ required: true, message: '请输入选项标签' }]}
        >
          <Input placeholder="请输入选项标签" />
        </Form.Item>

        <Form.Item
          name="value"
          label="选项值"
          rules={[{ required: true, message: '请输入选项值' }]}
        >
          <Input placeholder="请输入选项值" />
        </Form.Item>

        <Form.Item
          name="color"
          label="显示颜色"
          rules={[{ required: true, message: '请选择显示颜色' }]}
        >
          <Select placeholder="请选择显示颜色">
            <Option value="blue">蓝色</Option>
            <Option value="green">绿色</Option>
            <Option value="red">红色</Option>
            <Option value="orange">橙色</Option>
            <Option value="purple">紫色</Option>
            <Option value="pink">粉色</Option>
            <Option value="gray">灰色</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序号' }]}
        >
          <Input type="number" placeholder="请输入排序号" />
        </Form.Item>

        <Form.Item
          name="remark"
          label="备注"
        >
          <Input.TextArea 
            rows={3}
            placeholder="请输入备注信息"
            showCount
            maxLength={200}
          />
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
              {editingOption ? '更新' : '创建'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default OptionModal