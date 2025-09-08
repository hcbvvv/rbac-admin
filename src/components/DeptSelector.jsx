import React, { useState, useEffect } from 'react'
import { TreeSelect, Spin } from 'antd'

/**
 * 部门选择器组件
 * 支持多选和树形结构显示
 */
const DeptSelector = ({ 
  value, 
  onChange, 
  multiple = true, 
  placeholder = '请选择部门',
  disabled = false,
  ...props 
}) => {
  const [deptTree, setDeptTree] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    loadDeptTree()
  }, [])
  
  // 加载部门树数据
  const loadDeptTree = async () => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟部门树数据
      const mockDeptTree = [
        {
          title: '总公司',
          value: 'dept_1',
          key: 'dept_1',
          children: [
            {
              title: '技术部',
              value: 'dept_2',
              key: 'dept_2',
              children: [
                {
                  title: '前端组',
                  value: 'dept_3',
                  key: 'dept_3'
                },
                {
                  title: '后端组',
                  value: 'dept_4',
                  key: 'dept_4'
                },
                {
                  title: '测试组',
                  value: 'dept_5',
                  key: 'dept_5'
                }
              ]
            },
            {
              title: '产品部',
              value: 'dept_6',
              key: 'dept_6',
              children: [
                {
                  title: '产品设计组',
                  value: 'dept_7',
                  key: 'dept_7'
                },
                {
                  title: 'UI设计组',
                  value: 'dept_8',
                  key: 'dept_8'
                }
              ]
            },
            {
              title: '市场部',
              value: 'dept_9',
              key: 'dept_9',
              children: [
                {
                  title: '市场推广组',
                  value: 'dept_10',
                  key: 'dept_10'
                },
                {
                  title: '商务合作组',
                  value: 'dept_11',
                  key: 'dept_11'
                }
              ]
            },
            {
              title: '人事部',
              value: 'dept_12',
              key: 'dept_12'
            },
            {
              title: '财务部',
              value: 'dept_13',
              key: 'dept_13'
            }
          ]
        }
      ]
      
      setDeptTree(mockDeptTree)
    } catch (error) {
      console.error('加载部门数据失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleChange = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue)
    }
  }
  
  return (
    <TreeSelect
      value={value}
      onChange={handleChange}
      treeData={deptTree}
      placeholder={placeholder}
      disabled={disabled || loading}
      multiple={multiple}
      treeCheckable={multiple}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      treeDefaultExpandAll
      allowClear
      style={{ width: '100%' }}
      notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
      maxTagCount="responsive"
      {...props}
    />
  )
}

export default DeptSelector