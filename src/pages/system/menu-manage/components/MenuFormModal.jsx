import React, { useEffect } from 'react'
import { Modal, Form, Input, Select, Switch, InputNumber, Button, Space, Row, Col } from 'antd'
import MenuIcon from '@/components/MenuIcon'
import styles from '../menuManage.module.less'

const { Option } = Select
const { TextArea } = Input

/**
 * 菜单表单模态框组件
 */
const MenuFormModal = ({
  visible,
  editingMenu,
  menus,
  loading,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm()
  
  // 菜单类型选项
  const menuTypes = [
    { value: 'directory', label: '目录', description: '用于组织菜单结构' },
    { value: 'menu', label: '菜单', description: '可访问的页面' },
    { value: 'button', label: '按钮', description: '页面内的操作按钮' },
    { value: 'api', label: '接口', description: 'API接口权限' }
  ]
  
  // 常用图标选项
  const iconOptions = [
    'DashboardOutlined', 'UserOutlined', 'TeamOutlined', 'SettingOutlined',
    'MenuOutlined', 'FolderOutlined', 'FileOutlined', 'AppstoreOutlined',
    'BarsOutlined', 'TableOutlined', 'FormOutlined', 'CalendarOutlined',
    'ShoppingCartOutlined', 'DatabaseOutlined', 'CloudOutlined', 'BellOutlined'
  ]
  
  // 当编辑菜单变化时，更新表单
  useEffect(() => {
    if (visible) {
      if (editingMenu) {
        form.setFieldsValue(editingMenu)
      } else {
        form.resetFields()
        form.setFieldsValue({
          type: 'menu',
          status: 'active',
          hidden: false,
          keepAlive: false,
          showInCollapsed: false,
          sort: 1,
        })
      }
    }
  }, [form, editingMenu, visible])
  
  // 处理表单提交
  const handleSubmit = async (values) => {
    const success = await onSave(values, editingMenu)
    if (success) {
      form.resetFields()
    }
  }
  
  return (
    <Modal
      title={editingMenu ? '编辑菜单' : '新增菜单'}
      open={visible}
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      footer={null}
      width={700}
      className={styles.menuFormModal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className={styles.menuForm}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="菜单名称"
              rules={[{ required: true, message: '请输入菜单名称' }]}
            >
              <Input placeholder="请输入菜单名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="组件名称"
            >
              <Input placeholder="请输入组件名称" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="菜单类型"
              rules={[{ required: true, message: '请选择菜单类型' }]}
            >
              <Select placeholder="请选择菜单类型">
                {menuTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    <div>
                      <span style={{ fontWeight: 'bold' }}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="path"
              label="路由路径"
            >
              <Input placeholder="如: /system/user" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="icon"
              label="菜单图标"
            >
              <Select
                placeholder="请选择图标"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {iconOptions.map(icon => (
                  <Option key={icon} value={icon}>
                    <Space>
                      <MenuIcon type={icon} />
                      {icon}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="parentId"
              label="上级菜单"
            >
              <Select
                placeholder="请选择上级菜单"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {menus
                  .filter(menu => menu.id !== editingMenu?.id)
                  .map(menu => (
                    <Option key={menu.id} value={menu.id}>
                      {menu.title}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="sort"
              label="排序"
              rules={[{ required: true, message: '请输入排序值' }]}
            >
              <InputNumber 
                placeholder="请输入排序值" 
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
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
          </Col>
          <Col span={8}>
            <Form.Item
              name="hidden"
              label="是否隐藏"
              valuePropName="checked"
            >
              <Switch checkedChildren="隐藏" unCheckedChildren="显示" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="keepAlive"
              label="缓存页面"
              valuePropName="checked"
            >
              <Switch checkedChildren="缓存" unCheckedChildren="不缓存" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="showInCollapsed"
              label="最小化显示"
              valuePropName="checked"
            >
              <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Space>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingMenu ? '更新' : '创建'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MenuFormModal