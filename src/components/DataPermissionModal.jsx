import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Radio,
  Card,
  Typography,
  Space,
  Alert,
  Button,
  message
} from 'antd'
import { SafetyOutlined } from '@ant-design/icons'
import { useDeptStore } from '@/stores'
import { roleAPI } from '@/api'
import DeptSelector from '@/components/DeptSelector'
import { DATA_SCOPE, DATA_SCOPE_OPTIONS } from '@/constants'

const { Title, Text, Paragraph } = Typography

/**
 * 数据权限设置模态框
 */
const DataPermissionModal = ({ 
  visible, 
  onCancel, 
  roleData,
  onSuccess 
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { deptTree } = useDeptStore()

  useEffect(() => {
    if (visible && roleData) {
      form.setFieldsValue({
        dataScope: roleData.dataScope || DATA_SCOPE.ALL,
        customDeptIds: roleData.customDeptIds || []
      })
    }
  }, [visible, roleData, form])

  const handleSave = async (values) => {
    setLoading(true)
    try {
      await roleAPI.setDataScope(
        roleData.id, 
        values.dataScope, 
        values.customDeptIds || []
      )
      message.success('数据权限设置成功')
      onSuccess?.()
      onCancel()
    } catch (error) {
      message.error('设置失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const renderScopeDescription = (scope) => {
    const descriptions = {
      [DATA_SCOPE.ALL]: '可以查看和操作所有数据，不受部门限制',
      [DATA_SCOPE.DEPT]: '只能查看和操作本部门的数据',
      [DATA_SCOPE.DEPT_AND_SUB]: '可以查看和操作本部门及其下级部门的数据',
      [DATA_SCOPE.SELF]: '只能查看和操作自己创建或分配给自己的数据',
      [DATA_SCOPE.CUSTOM]: '可以查看和操作指定部门的数据'
    }
    return descriptions[scope] || ''
  }

  return (
    <Modal
      title={
        <Space>
          <SafetyOutlined />
          设置数据权限范围
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Card>
        <Alert
          message="数据权限说明"
          description="数据权限用于控制角色可以访问的数据范围，设置后将影响该角色下所有用户的数据访问权限。"
          type="info"
          showIcon
          style={{ marginBottom: 20 }}
        />

        <div style={{ marginBottom: 16 }}>
          <Text strong>角色信息：</Text>
          <Text>{roleData?.name} ({roleData?.code})</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            dataScope: DATA_SCOPE.ALL
          }}
        >
          <Form.Item
            name="dataScope"
            label="数据权限范围"
            rules={[{ required: true, message: '请选择数据权限范围' }]}
          >
            <Radio.Group style={{ width: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {DATA_SCOPE_OPTIONS.map(option => (
                  <Card 
                    key={option.value}
                    size="small"
                    style={{ margin: '8px 0' }}
                  >
                    <Radio value={option.value} style={{ width: '100%' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                          {option.label}
                        </div>
                        <div style={{ color: '#666', fontSize: '12px' }}>
                          {renderScopeDescription(option.value)}
                        </div>
                      </div>
                    </Radio>
                  </Card>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => 
              prevValues.dataScope !== currentValues.dataScope
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue('dataScope') === DATA_SCOPE.CUSTOM ? (
                <Form.Item
                  name="customDeptIds"
                  label="自定义部门范围"
                  rules={[{ required: true, message: '请选择可访问的部门' }]}
                >
                  <DeptSelector
                    multiple
                    placeholder="请选择可访问的部门"
                    style={{ width: '100%' }}
                    showSearch
                    treeCheckable
                    treeDefaultExpandAll
                  />
                </Form.Item>
              ) : null
            }}
          </Form.Item>

          <Alert
            message="权限生效说明"
            description={
              <div>
                <Paragraph style={{ margin: 0 }}>
                  • 数据权限设置立即生效，无需重启系统
                  <br />
                  • 修改后该角色下的所有用户都将受到新权限范围的限制
                  <br />
                  • 建议在业务低峰期进行权限调整
                </Paragraph>
              </div>
            }
            type="warning"
            showIcon
            style={{ margin: '20px 0' }}
          />
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={handleCancel}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存设置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  )
}

export default DataPermissionModal