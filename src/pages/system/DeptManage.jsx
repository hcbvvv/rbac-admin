import React, { useState, useEffect } from 'react'
import { 
  Card, 
  Tree, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message,
  Popconfirm,
  Row,
  Col,
  Descriptions,
  Empty
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ReloadOutlined,
  TeamOutlined,
  FolderOutlined,
  ApartmentOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'
import { useDeptStore } from '@/stores'
import { DEPT_TYPE_OPTIONS, DEPT_STATUS_OPTIONS } from '@/constants'

const { Option } = Select
const { TextArea } = Input

/**
 * 部门管理页面
 */
const DeptManage = () => {
  const { hasPermission } = usePermission()
  const { 
    depts, 
    deptTree, 
    currentDept,
    loading,
    fetchDepts,
    fetchDeptTree,
    createDept,
    updateDept,
    deleteDept
  } = useDeptStore()
  
  const [modalVisible, setModalVisible] = useState(false)
  const [editingDept, setEditingDept] = useState(null)
  const [selectedDept, setSelectedDept] = useState(null)
  const [expandedKeys, setExpandedKeys] = useState([])
  const [form] = Form.useForm()
  
  // 初始化数据
  useEffect(() => {
    fetchDeptTree()
  }, [fetchDeptTree])
  
  // 构建树形数据
  const buildTreeData = (depts) => {
    return depts.map(dept => ({
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {dept.type === 'company' && <ApartmentOutlined style={{ color: '#1890ff' }} />}
          {dept.type === 'department' && <FolderOutlined style={{ color: '#52c41a' }} />}
          {dept.type === 'team' && <TeamOutlined style={{ color: '#faad14' }} />}
          <span>{dept.name}</span>
          <Tag color={dept.status === 'active' ? 'green' : 'red'} size="small">
            {dept.status === 'active' ? '正常' : '禁用'}
          </Tag>
        </div>
      ),
      key: dept.id,
      children: dept.children ? buildTreeData(dept.children) : undefined,
      data: dept,
    }))
  }
  
  const treeData = buildTreeData(deptTree)
  
  // 选择部门节点
  const handleSelectDept = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      const selectedDeptData = info.node.data
      setSelectedDept(selectedDeptData)
    } else {
      setSelectedDept(null)
    }
  }
  
  // 添加部门
  const handleAdd = (parentDept = null) => {
    setEditingDept(null)
    form.resetFields()
    if (parentDept) {
      form.setFieldsValue({ parentId: parentDept.id })
    }
    setModalVisible(true)
  }
  
  // 编辑部门
  const handleEdit = (dept) => {
    setEditingDept(dept)
    form.setFieldsValue(dept)
    setModalVisible(true)
  }
  
  // 删除部门
  const handleDelete = async (dept) => {
    try {
      await deleteDept(dept.id)
      message.success('部门删除成功')
      setSelectedDept(null)
    } catch (error) {
      message.error(error.message || '删除失败')
    }
  }
  
  // 保存部门
  const handleSave = async (values) => {
    try {
      if (editingDept) {
        await updateDept(editingDept.id, values)
        message.success('部门更新成功')
      } else {
        await createDept(values)
        message.success('部门创建成功')
      }
      
      setModalVisible(false)
      setEditingDept(null)
      form.resetFields()
    } catch (error) {
      message.error(error.message || '操作失败')
    }
  }
  
  // 刷新数据
  const handleRefresh = () => {
    fetchDeptTree()
    setSelectedDept(null)
    message.info('刷新完成')
  }
  
  // 构建部门选择器数据
  const buildDeptSelectData = (depts, excludeId = null) => {
    return depts
      .filter(dept => dept.id !== excludeId)
      .map(dept => ({
        title: dept.name,
        value: dept.id,
        key: dept.id,
        children: dept.children ? buildDeptSelectData(dept.children, excludeId) : undefined,
      }))
  }
  
  const deptSelectData = buildDeptSelectData(deptTree, editingDept?.id)
  
  // 权限检查
  if (!hasPermission('dept:view')) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3>您没有权限访问部门管理</h3>
          <p>请联系管理员获取相应权限</p>
        </div>
      </Card>
    )
  }
  
  return (
    <div>
      <Row gutter={16}>
        {/* 左侧部门树 */}
        <Col xs={24} md={8} lg={6}>
          <Card
            title="部门结构"
            extra={
              <Space>
                <Button 
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                />
                {hasPermission('dept:create') && (
                  <Button 
                    size="small"
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => handleAdd()}
                  >
                    新增
                  </Button>
                )}
              </Space>
            }
            style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
          >
            {treeData.length > 0 ? (
              <Tree
                treeData={treeData}
                onSelect={handleSelectDept}
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
                showIcon={false}
                blockNode
              />
            ) : (
              <Empty description="暂无部门数据" />
            )}
          </Card>
        </Col>
        
        {/* 右侧部门详情 */}
        <Col xs={24} md={16} lg={18}>
          <Card
            title="部门详情"
            extra={
              selectedDept && (
                <Space>
                  {hasPermission('dept:create') && (
                    <Button 
                      icon={<PlusOutlined />}
                      onClick={() => handleAdd(selectedDept)}
                    >
                      添加子部门
                    </Button>
                  )}
                  {hasPermission('dept:edit') && (
                    <Button 
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(selectedDept)}
                    >
                      编辑
                    </Button>
                  )}
                  {hasPermission('dept:delete') && selectedDept.type !== 'company' && (
                    <Popconfirm
                      title="确定要删除这个部门吗？"
                      description="删除后将无法恢复，请谨慎操作"
                      onConfirm={() => handleDelete(selectedDept)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button 
                        danger
                        icon={<DeleteOutlined />}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              )
            }
            style={{ minHeight: 'calc(100vh - 200px)' }}
          >
            {selectedDept ? (
              <Descriptions column={2} bordered>
                <Descriptions.Item label="部门名称">
                  {selectedDept.name}
                </Descriptions.Item>
                <Descriptions.Item label="部门编码">
                  {selectedDept.code}
                </Descriptions.Item>
                <Descriptions.Item label="部门类型">
                  <Tag color="blue">
                    {DEPT_TYPE_OPTIONS.find(item => item.value === selectedDept.type)?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={selectedDept.status === 'active' ? 'green' : 'red'}>
                    {DEPT_STATUS_OPTIONS.find(item => item.value === selectedDept.status)?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="负责人">
                  {selectedDept.leaderName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  {selectedDept.phone || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">
                  {selectedDept.email || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="排序">
                  {selectedDept.sort}
                </Descriptions.Item>
                <Descriptions.Item label="地址" span={2}>
                  {selectedDept.address || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>
                  {selectedDept.description || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间" span={2}>
                  {selectedDept.createdAt}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty 
                description="请在左侧选择部门查看详情" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>
      
      {/* 部门表单模态框 */}
      <Modal
        title={editingDept ? '编辑部门' : '新增部门'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setEditingDept(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
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
              treeDefaultExpandAll
              showSearch
              treeNodeFilterProp="title"
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
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingDept ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DeptManage