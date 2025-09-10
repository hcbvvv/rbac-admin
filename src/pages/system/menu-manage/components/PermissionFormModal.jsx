import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Radio, Button, Space } from 'antd'
import { DATA_SCOPE_OPTIONS } from '@/constants/rbac'
import DeptSelector from '@/components/DeptSelector'
import styles from '../menuManage.module.less'

const { Option } = Select
const { TextArea } = Input

/**
 * 权限表单模态框组件
 */
const PermissionFormModal = ({
  visible,
  editingPermission,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm()
  const [selectedType, setSelectedType] = useState('resource')
  const [selectedDataScope, setSelectedDataScope] = useState(null)
  
  // 权限类型选项
  const permissionTypes = [
    { value: 'resource', label: '资源权限', color: '#1890ff', description: '页面访问权限' },
    { value: 'button', label: '按钮权限', color: '#faad14', description: '操作按钮权限' },
    { value: 'api', label: '接口权限', color: '#722ed1', description: 'API接口权限' },
    { value: 'data', label: '数据权限', color: '#13c2c2', description: '数据访问权限' }
  ]
  
  // 当编辑权限变化时，更新表单
  useEffect(() => {
    if (visible) {
      if (editingPermission) {
        form.setFieldsValue(editingPermission)
        setSelectedType(editingPermission.type)
        setSelectedDataScope(editingPermission.dataScope)
      } else {
        form.resetFields()
        setSelectedType('resource')
        setSelectedDataScope(null)
      }
    }
  }, [form, editingPermission, visible])
  
  // 处理权限类型变化
  const handleTypeChange = (value) => {
    setSelectedType(value)
    const typeInfo = permissionTypes.find(t => t.value === value)
    if (typeInfo) {
      form.setFieldsValue({
        typeLabel: typeInfo.label,
        typeColor: typeInfo.color
      })
    }
    
    // 如果不是API或数据权限，清空数据权限范围
    if (value !== 'api' && value !== 'data') {
      form.setFieldsValue({ dataScope: null })
      setSelectedDataScope(null)
    }
  }
  
  // 处理数据权限范围变化
  const handleDataScopeChange = (value) => {
    setSelectedDataScope(value)
    if (value !== 'custom') {
      form.setFieldsValue({ customDeptIds: null })
    }
  }
  
  // 处理表单提交
  const handleSubmit = async (values) => {
    const permissionData = {
      ...values,
      id: editingPermission?.id || `perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: selectedType,
      typeLabel: permissionTypes.find(t => t.value === selectedType)?.label,
      typeColor: permissionTypes.find(t => t.value === selectedType)?.color,
    }
    
    const success = await onSave(permissionData)
    if (success) {
      form.resetFields()
      setSelectedType('resource')
      setSelectedDataScope(null)
    }
  }
  
  return (
    <Modal
      title={editingPermission ? '编辑权限' : '添加权限'}
      open={visible}
      onCancel={() => {
        onCancel()
        form.resetFields()
        setSelectedType('resource')
        setSelectedDataScope(null)
      }}
      footer={null}
      width={600}
      className={styles.permissionModal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="type"
          label="权限类型"
          rules={[{ required: true, message: '请选择权限类型' }]}
        >
          <Select 
            placeholder="请选择权限类型"
            onChange={handleTypeChange}
            value={selectedType}
          >
            {permissionTypes.map(type => (
              <Option key={type.value} value={type.value}>
                <div>
                  <span style={{ color: type.color, fontWeight: 'bold' }}>
                    {type.label}
                  </span>
                  <span style={{ marginLeft: 8, color: '#666', fontSize: '12px' }}>
                    {type.description}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="title"
          label="权限名称"
          rules={[{ required: true, message: '请输入权限名称' }]}
        >
          <Input placeholder="请输入权限名称" />
        </Form.Item>
        
        <Form.Item
          name="key"
          label="权限标识"
          rules={[{ required: true, message: '请输入权限标识' }]}
        >
          <Input placeholder="如: user:view 或 GET /api/users" />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="权限描述"
        >
          <TextArea rows={2} placeholder="请输入权限描述" />
        </Form.Item>
        
        {/* 数据权限配置 - 仅API和数据权限类型显示 */}
        {(selectedType === 'api' || selectedType === 'data') && (
          <div className={styles.dataScopeFormSection}>
            <Form.Item
              name="dataScope"
              label="数据权限范围"
              rules={[{ required: true, message: '请选择数据权限范围' }]}
            >
              <Radio.Group 
                onChange={(e) => handleDataScopeChange(e.target.value)}
                className={styles.dataScopeOptions}
              >
                {DATA_SCOPE_OPTIONS.map(option => (
                  <Radio.Button 
                    key={option.value} 
                    value={option.value}
                    className={styles.dataScopeOption}
                  >
                    <div>
                      <div className={styles.dataScopeOptionTitle}>
                        {option.label}
                      </div>
                      <div className={styles.dataScopeOptionDesc}>
                        {option.description}
                      </div>
                    </div>
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
            
            {/* 自定义部门选择 */}
            {selectedDataScope === 'custom' && (
              <Form.Item
                name="customDeptIds"
                label="自定义部门"
                rules={[{ required: true, message: '请选择自定义部门' }]}
              >
                <DeptSelector 
                  multiple
                  placeholder="请选择部门"
                  className={styles.customDeptSelector}
                />
              </Form.Item>
            )}
          </div>
        )}
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              {editingPermission ? '更新' : '创建'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default PermissionFormModal