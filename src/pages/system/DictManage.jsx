import React, { useState, useEffect, useMemo } from 'react'
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Space,
  Input,
  Form,
  Modal,
  Select,
  Switch,
  message,
  Popconfirm,
  Tag,
  Tooltip,
  Badge,
  Typography,
  Alert,
  Divider
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  BookOutlined,
  FileTextOutlined,
  OrderedListOutlined
} from '@ant-design/icons'
import { usePermission } from '@/hooks/usePermission'

const { Search } = Input
const { Option } = Select
const { Title, Text } = Typography

/**
 * 数据字典管理页面
 */
const DictManage = () => {
  const { hasPermission } = usePermission()
  const [loading, setLoading] = useState(false)
  const [optionLoading, setOptionLoading] = useState(false)
  
  // 主表相关状态
  const [dictModalVisible, setDictModalVisible] = useState(false)
  const [editingDict, setEditingDict] = useState(null)
  const [selectedDict, setSelectedDict] = useState(null)
  const [dictForm] = Form.useForm()
  const [dictList, setDictList] = useState([])
  
  // 选项表相关状态
  const [optionModalVisible, setOptionModalVisible] = useState(false)
  const [editingOption, setEditingOption] = useState(null)
  const [optionForm] = Form.useForm()
  
  // 搜索状态
  const [dictSearchKeyword, setDictSearchKeyword] = useState('')
  const [optionSearchKeyword, setOptionSearchKeyword] = useState('')
  
  // 分页状态
  const [dictPagination, setDictPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  
  // 左侧列表分页状态
  const [leftListPagination, setLeftListPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
    hasMore: true
  })
  
  // 当前显示的字典列表（用于左侧分页显示）
  const [displayedDictList, setDisplayedDictList] = useState([])
  
  // 初始化模拟字典主表数据
  useEffect(() => {
    const mockDictData = [
      {
        id: '1',
        dictCode: 'user_status',
        dictName: '用户状态',
        dictType: 'sys',
        description: '系统用户状态字典',
        status: true,
        sort: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        dictCode: 'user_type',
        dictName: '用户类型',
        dictType: 'sys',
        description: '系统用户类型字典',
        status: true,
        sort: 2,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '3',
        dictCode: 'gender',
        dictName: '性别',
        dictType: 'sys',
        description: '性别字典',
        status: true,
        sort: 3,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '4',
        dictCode: 'order_status',
        dictName: '订单状态',
        dictType: 'business',
        description: '订单状态字典',
        status: true,
        sort: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '5',
        dictCode: 'pay_method',
        dictName: '支付方式',
        dictType: 'business',
        description: '支付方式字典',
        status: true,
        sort: 2,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '6',
        dictCode: 'yes_no',
        dictName: '是否',
        dictType: 'common',
        description: '通用是否字典',
        status: true,
        sort: 1,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '7',
        dictCode: 'data_scope',
        dictName: '数据范围',
        dictType: 'sys',
        description: '数据权限范围字典',
        status: true,
        sort: 4,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '8',
        dictCode: 'menu_type',
        dictName: '菜单类型',
        dictType: 'sys',
        description: '系统菜单类型字典',
        status: true,
        sort: 5,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '9',
        dictCode: 'notice_type',
        dictName: '通知类型',
        dictType: 'business',
        description: '系统通知类型字典',
        status: true,
        sort: 3,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      },
      {
        id: '10',
        dictCode: 'log_level',
        dictName: '日志级别',
        dictType: 'sys',
        description: '系统日志级别字典',
        status: false,
        sort: 6,
        createTime: '2024-01-01 10:00:00',
        updateTime: '2024-01-01 10:00:00'
      }
    ]
    setDictList(mockDictData)
    setDictPagination(prev => ({ ...prev, total: mockDictData.length }))
  }, [])

  // 模拟字典选项数据
  const [dictOptions] = useState({
    'user_status': [
      { id: '1', label: '正常', value: '1', color: 'green', sort: 1, status: true, remark: '用户正常状态' },
      { id: '2', label: '禁用', value: '0', color: 'red', sort: 2, status: true, remark: '用户禁用状态' },
      { id: '3', label: '锁定', value: '2', color: 'orange', sort: 3, status: true, remark: '用户锁定状态' }
    ],
    'gender': [
      { id: '4', label: '男', value: 'M', color: 'blue', sort: 1, status: true, remark: '男性' },
      { id: '5', label: '女', value: 'F', color: 'pink', sort: 2, status: true, remark: '女性' },
      { id: '6', label: '未知', value: 'U', color: 'gray', sort: 3, status: true, remark: '未知性别' }
    ],
    'order_status': [
      { id: '7', label: '待支付', value: '1', color: 'orange', sort: 1, status: true, remark: '订单待支付' },
      { id: '8', label: '已支付', value: '2', color: 'green', sort: 2, status: true, remark: '订单已支付' },
      { id: '9', label: '已取消', value: '0', color: 'red', sort: 3, status: true, remark: '订单已取消' },
      { id: '10', label: '已完成', value: '3', color: 'blue', sort: 4, status: true, remark: '订单已完成' }
    ],
    'yes_no': [
      { id: '11', label: '是', value: '1', color: 'green', sort: 1, status: true, remark: '是' },
      { id: '12', label: '否', value: '0', color: 'red', sort: 2, status: true, remark: '否' }
    ]
  })

  // 当前显示的字典选项
  const [currentOptions, setCurrentOptions] = useState([])

  // 过滤后的字典列表
  const filteredDictList = useMemo(() => {
    let filtered = dictList

    // 按关键词过滤
    if (dictSearchKeyword) {
      const keyword = dictSearchKeyword.toLowerCase()
      filtered = filtered.filter(dict =>
        dict.dictName.toLowerCase().includes(keyword) ||
        dict.dictCode.toLowerCase().includes(keyword) ||
        dict.description.toLowerCase().includes(keyword)
      )
    }

    return filtered
  }, [dictList, dictSearchKeyword])
  
  // 更新左侧显示列表
  useEffect(() => {
    const startIndex = 0
    const endIndex = leftListPagination.current * leftListPagination.pageSize
    const newDisplayedList = filteredDictList.slice(startIndex, endIndex)
    
    setDisplayedDictList(newDisplayedList)
    setLeftListPagination(prev => ({
      ...prev,
      total: filteredDictList.length,
      hasMore: endIndex < filteredDictList.length
    }))
  }, [filteredDictList, leftListPagination.current, leftListPagination.pageSize])
  
  // 点击加载更多
  const handleLoadMore = () => {
    setLeftListPagination(prev => ({
      ...prev,
      current: prev.current + 1
    }))
  }
  
  // 重置左侧列表分页
  const resetLeftPagination = () => {
    setLeftListPagination({
      current: 1,
      pageSize: 8,
      total: 0,
      hasMore: true
    })
  }
  
  // 处理搜索变化
  const handleSearchChange = (value) => {
    setDictSearchKeyword(value)
    resetLeftPagination() // 搜索时重置分页
  }

  // 过滤后的选项列表
  const filteredOptionList = useMemo(() => {
    if (!selectedDict || !currentOptions.length) return []

    if (!optionSearchKeyword) return currentOptions

    const keyword = optionSearchKeyword.toLowerCase()
    return currentOptions.filter(option =>
      option.label.toLowerCase().includes(keyword) ||
      option.value.toLowerCase().includes(keyword) ||
      (option.remark && option.remark.toLowerCase().includes(keyword))
    )
  }, [currentOptions, optionSearchKeyword])

  // 字典主表行选择
  const handleDictRowSelect = (record) => {
    setSelectedDict(record)
    
    // 模拟查询字典选项数据
    setOptionLoading(true)
    setTimeout(() => {
      const options = dictOptions[record.dictCode] || []
      setCurrentOptions(options)
      setOptionLoading(false)
    }, 500)
  }

  // 字典选项列定义
  const optionColumns = [
    {
      title: '选项标签',
      dataIndex: 'label',
      key: 'label',
      render: (text, record) => (
        <Space>
          <Tag color={record.color}>{text}</Tag>
        </Space>
      )
    },
    {
      title: '选项值',
      dataIndex: 'value',
      key: 'value',
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: '显示颜色',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              width: 16, 
              height: 16, 
              backgroundColor: color, 
              borderRadius: 2,
              marginRight: 8,
              border: '1px solid #d9d9d9'
            }} 
          />
          <Text type="secondary">{color}</Text>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Badge 
          status={status ? 'success' : 'error'} 
          text={status ? '启用' : '禁用'} 
        />
      )
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      sorter: (a, b) => a.sort - b.sort
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: { showTitle: false },
      render: (text) => text ? (
        <Tooltip title={text}>
          <Text type="secondary">{text}</Text>
        </Tooltip>
      ) : '-'
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditOption(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个选项吗？"
            onConfirm={() => handleDeleteOption(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 字典操作函数
  const handleAddDict = () => {
    setEditingDict(null)
    dictForm.resetFields()
    setDictModalVisible(true)
  }

  const handleEditDict = (record) => {
    setEditingDict(record)
    dictForm.setFieldsValue(record)
    setDictModalVisible(true)
  }

  const handleDeleteDict = (id) => {
    const newDictList = dictList.filter(dict => dict.id !== id)
    setDictList(newDictList)
    setDictPagination(prev => ({ ...prev, total: newDictList.length }))
    
    // 如果删除的是当前选中的字典，清空选中状态
    if (selectedDict && selectedDict.id === id) {
      setSelectedDict(null)
      setCurrentOptions([])
    }
    
    message.success('字典删除成功')
  }

  // 选项操作函数
  const handleAddOption = () => {
    if (!selectedDict) {
      message.warning('请先选择字典')
      return
    }
    setEditingOption(null)
    optionForm.resetFields()
    optionForm.setFieldsValue({ dictCode: selectedDict.dictCode })
    setOptionModalVisible(true)
  }

  const handleEditOption = (record) => {
    setEditingOption(record)
    optionForm.setFieldsValue(record)
    setOptionModalVisible(true)
  }

  const handleDeleteOption = (id) => {
    message.success('选项删除成功')
  }

  // 保存字典
  const handleSaveDict = async (values) => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingDict) {
        // 编辑字典
        const updatedDictList = dictList.map(dict => 
          dict.id === editingDict.id 
            ? { ...dict, ...values, updateTime: new Date().toLocaleString() }
            : dict
        )
        setDictList(updatedDictList)
        
        // 如果编辑的是当前选中的字典，更新选中状态
        if (selectedDict && selectedDict.id === editingDict.id) {
          setSelectedDict({ ...selectedDict, ...values })
        }
        
        message.success('字典更新成功')
      } else {
        // 新增字典
        const newDict = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toLocaleString(),
          updateTime: new Date().toLocaleString()
        }
        const newDictList = [...dictList, newDict]
        setDictList(newDictList)
        setDictPagination(prev => ({ ...prev, total: newDictList.length }))
        message.success('字典创建成功')
      }
      
      setDictModalVisible(false)
      dictForm.resetFields()
      setEditingDict(null)
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 保存选项
  const handleSaveOption = async (values) => {
    try {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      message.success(editingOption ? '选项更新成功' : '选项创建成功')
      setOptionModalVisible(false)
      optionForm.resetFields()
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ height: 'calc(100vh - 144px)' }}>
        {/* 左侧字典列表 */}
        <Col xs={24} sm={24} md={6} lg={5}>
          <Card
            title={
              <Space>
                <BookOutlined />
                <span>字典列表</span>
                <Badge count={`${displayedDictList.length}/${filteredDictList.length}`} showZero color="blue" />
              </Space>
            }
            extra={
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={handleAddDict}
              >
                新增
              </Button>
            }
            size="small"
            style={{ height: '100%' }}
            styles={{ body: { padding: '12px', overflow: 'auto' } }}
          >
            <Space direction="vertical" style={{ width: '100%', marginBottom: 12 }}>
              <Search
                placeholder="搜索字典名称、编码"
                allowClear
                value={dictSearchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                onSearch={handleSearchChange}
                style={{ width: '100%' }}
                size="small"
              />
            </Space>
            
            <div style={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
              {displayedDictList.map(dict => (
                <div
                  key={dict.id}
                  onClick={() => handleDictRowSelect(dict)}
                  style={{
                    padding: '8px 12px',
                    marginBottom: '4px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: selectedDict?.id === dict.id ? '#e6f7ff' : '#fafafa',
                    border: selectedDict?.id === dict.id ? '1px solid #91d5ff' : '1px solid #d9d9d9',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedDict?.id !== dict.id) {
                      e.target.style.backgroundColor = '#f0f0f0'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDict?.id !== dict.id) {
                      e.target.style.backgroundColor = '#fafafa'
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontWeight: selectedDict?.id === dict.id ? 'bold' : 'normal',
                        color: selectedDict?.id === dict.id ? '#1890ff' : '#333',
                        fontSize: '13px',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {dict.dictName}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        color: '#999',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {dict.dictCode}
                      </div>
                    </div>
                    <Badge 
                      status={dict.status ? 'success' : 'error'} 
                      style={{ marginLeft: 8 }}
                    />
                  </div>
                </div>
              ))}
              
              {/* 点击更多按钮 */}
              {leftListPagination.hasMore && displayedDictList.length > 0 && (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  <Button 
                    type="link" 
                    onClick={handleLoadMore}
                    style={{ color: '#1890ff', fontSize: '12px' }}
                  >
                    点击加载更多 ({leftListPagination.total - displayedDictList.length} 项剩余)
                  </Button>
                </div>
              )}
              
              {/* 空状态 */}
              {displayedDictList.length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                  {dictSearchKeyword ? '未找到匹配的字典' : '暂无字典数据'}
                </div>
              )}
              
              {/* 已加载全部提示 */}
              {!leftListPagination.hasMore && displayedDictList.length > 0 && (
                <div style={{ textAlign: 'center', color: '#999', padding: '8px 0', fontSize: '12px' }}>
                  已加载全部 {displayedDictList.length} 个字典
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* 右侧内容区 */}
        <Col xs={24} sm={24} md={18} lg={19}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 上半部分：字典详情 */}
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  <span>字典详情</span>
                  {selectedDict && (
                    <Tag color="blue">{selectedDict.dictName}</Tag>
                  )}
                </Space>
              }
              extra={
                selectedDict && (
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEditDict(selectedDict)}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定要删除这个字典吗？"
                      onConfirm={() => handleDeleteDict(selectedDict.id)}
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
                  </Space>
                )
              }
              size="small"
              style={{ marginBottom: 16, height: '45%' }}
              styles={{ body: { padding: '16px', overflow: 'auto' } }}
            >
              {selectedDict ? (
                <div>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>字典编码</Text>
                        <Text code style={{ fontSize: '13px' }}>{selectedDict.dictCode}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>字典名称</Text>
                        <Text style={{ fontSize: '13px' }}>{selectedDict.dictName}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>字典类型</Text>
                        <Tag color={selectedDict.dictType === 'sys' ? 'blue' : selectedDict.dictType === 'business' ? 'green' : 'orange'}>
                          {selectedDict.dictType === 'sys' ? '系统字典' : 
                           selectedDict.dictType === 'business' ? '业务字典' : '通用字典'}
                        </Tag>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>状态</Text>
                        <Badge 
                          status={selectedDict.status ? 'success' : 'error'} 
                          text={selectedDict.status ? '启用' : '禁用'} 
                        />
                      </div>
                    </Col>
                    <Col span={24}>
                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>描述</Text>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                          {selectedDict.description || '暂无描述'}
                        </Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>创建时间</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{selectedDict.createTime}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <Text strong style={{ display: 'block', marginBottom: 4 }}>更新时间</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{selectedDict.updateTime}</Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : (
                <Alert
                  message="请选择字典"
                  description="请在左侧字典列表中选择一个字典，然后查看详细信息"
                  type="info"
                  showIcon
                  style={{ margin: '20px 0' }}
                />
              )}
            </Card>

            {/* 下半部分：字典选项表 */}
            <Card
              title={
                <Space>
                  <OrderedListOutlined />
                  <span>字典选项</span>
                  {selectedDict && (
                    <Tag color="green">{selectedDict.dictName} - 选项列表</Tag>
                  )}
                  {currentOptions.length > 0 && (
                    <Badge count={currentOptions.length} showZero color="orange" />
                  )}
                </Space>
              }
              extra={
                <Space>
                  {selectedDict && (
                    <Search
                      placeholder="搜索选项"
                      allowClear
                      style={{ width: 200 }}
                      value={optionSearchKeyword}
                      onChange={(e) => setOptionSearchKeyword(e.target.value)}
                      onSearch={setOptionSearchKeyword}
                      size="small"
                    />
                  )}
                  <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={handleAddOption}
                    disabled={!selectedDict}
                    size="small"
                  >
                    新增选项
                  </Button>
                </Space>
              }
              size="small"
              style={{ height: '55%' }}
              styles={{ body: { padding: '12px', overflow: 'auto' } }}
            >
              {!selectedDict ? (
                <Alert
                  message="请选择字典"
                  description="请在上方字典列表中选择一个字典，然后查看对应的字典选项"
                  type="info"
                  showIcon
                  style={{ margin: '20px 0' }}
                />
              ) : (
                <Table
                  columns={optionColumns}
                  dataSource={filteredOptionList}
                  rowKey="id"
                  size="small"
                  loading={optionLoading}
                  pagination={{
                    total: filteredOptionList.length,
                    pageSize: 6,
                    showSizeChanger: true,
                    showTotal: (total, range) => 
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                    size: 'small'
                  }}
                />
              )}
            </Card>
          </div>
        </Col>
      </Row>

      {/* 字典表单模态框 */}
      <Modal
        title={editingDict ? '编辑字典' : '新增字典'}
        open={dictModalVisible}
        onCancel={() => {
          setDictModalVisible(false)
          dictForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={dictForm}
          layout="vertical"
          onFinish={handleSaveDict}
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
              <Button onClick={() => setDictModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingDict ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 选项表单模态框 */}
      <Modal
        title={editingOption ? '编辑选项' : '新增选项'}
        open={optionModalVisible}
        onCancel={() => {
          setOptionModalVisible(false)
          optionForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form
          form={optionForm}
          layout="vertical"
          onFinish={handleSaveOption}
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
              <Button onClick={() => setOptionModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingOption ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DictManage