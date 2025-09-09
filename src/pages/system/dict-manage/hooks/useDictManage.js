import { useState, useEffect, useMemo } from 'react'
import { Form, message } from 'antd'
import { usePermission } from '@/hooks/usePermission'

/**
 * 字典管理页面的业务逻辑Hook
 */
export const useDictManage = () => {
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
  
  // 左侧列表分页状态
  const [leftListPagination, setLeftListPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
    hasMore: true
  })
  
  // 当前显示的字典列表（用于左侧分页显示）
  const [displayedDictList, setDisplayedDictList] = useState([])
  
  // 模拟字典选项数据
  const dictOptions = {
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
  }
  
  // 当前显示的字典选项
  const [currentOptions, setCurrentOptions] = useState([])
  
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
      },
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
      },
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
      },
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
  }, [])
  
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
      setEditingOption(null)
    } catch (error) {
      message.error('操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  return {
    // 字典数据
    dictList,
    displayedDictList,
    selectedDict,
    currentOptions,
    filteredOptionList,
    
    // 搜索状态
    dictSearchKeyword,
    optionSearchKeyword,
    
    // 分页状态
    leftListPagination,
    
    // 加载状态
    loading,
    optionLoading,
    
    // 模态框状态
    dictModalVisible,
    setDictModalVisible,
    optionModalVisible,
    setOptionModalVisible,
    editingDict,
    editingOption,
    
    // 事件处理
    handleSearchChange,
    handleLoadMore,
    handleDictRowSelect,
    handleAddDict,
    handleEditDict,
    handleDeleteDict,
    handleSaveDict,
    handleAddOption,
    handleEditOption,
    handleDeleteOption,
    handleSaveOption,
    setOptionSearchKeyword,
    
    // 表单实例
    dictForm,
    optionForm,
    
    // 权限检查
    hasPermission
  }
}