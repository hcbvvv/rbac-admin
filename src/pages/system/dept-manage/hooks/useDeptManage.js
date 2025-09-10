import { useState, useEffect } from 'react'
import { message } from '@/utils/antdGlobal'
import { useDeptStore } from '@/stores'

/**
 * 部门管理业务逻辑Hook
 */
export const useDeptManage = () => {
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
  
  const [selectedDept, setSelectedDept] = useState(null)
  const [expandedKeys, setExpandedKeys] = useState([])
  
  // 初始化数据
  useEffect(() => {
    fetchDeptTree()
  }, [fetchDeptTree])
  
  // 选择部门节点
  const handleSelectDept = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      const selectedDeptData = info.node.data
      setSelectedDept(selectedDeptData)
    } else {
      setSelectedDept(null)
    }
  }
  
  // 删除部门
  const handleDelete = async (dept) => {
    try {
      await deleteDept(dept.id)
      message.success('部门删除成功')
      setSelectedDept(null)
      return true
    } catch (error) {
      message.error(error.message || '删除失败')
      return false
    }
  }
  
  // 保存部门
  const handleSave = async (values, editingDept) => {
    try {
      if (editingDept) {
        await updateDept(editingDept.id, values)
        message.success('部门更新成功')
      } else {
        await createDept(values)
        message.success('部门创建成功')
      }
      
      return true
    } catch (error) {
      message.error(error.message || '操作失败')
      return false
    }
  }
  
  // 刷新数据
  const handleRefresh = () => {
    fetchDeptTree()
    setSelectedDept(null)
    message.info('刷新完成')
  }
  
  return {
    // 数据
    depts,
    deptTree,
    selectedDept,
    expandedKeys,
    loading,
    
    // 方法
    setSelectedDept,
    setExpandedKeys,
    handleSelectDept,
    handleDelete,
    handleSave,
    handleRefresh,
  }
}