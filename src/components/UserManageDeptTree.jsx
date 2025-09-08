import React, { useState, useEffect } from 'react'
import { Tree, Input, Typography, Space, Badge, Tooltip } from 'antd'
import { SearchOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'

const { Search } = Input
const { Text } = Typography

/**
 * 用户管理专用部门树组件
 */
const UserManageDeptTree = ({ 
  deptData = [], 
  userStats = {}, 
  onSelect, 
  selectedKeys = [],
  loading = false 
}) => {
  const [expandedKeys, setExpandedKeys] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  // 构建部门树数据
  const buildTreeData = (depts, parentId = null, searchValue = '') => {
    return depts
      .filter(dept => dept.parentId === parentId)
      .map(dept => {
        const children = buildTreeData(depts, dept.id, searchValue)
        const stats = userStats[dept.id] || { total: 0, active: 0, inactive: 0 }
        
        // 搜索高亮
        const searchIndex = searchValue ? dept.name.toLowerCase().indexOf(searchValue.toLowerCase()) : -1
        const beforeStr = dept.name.substr(0, searchIndex)
        const afterStr = dept.name.substr(searchIndex + searchValue.length)
        const highlightedName = searchIndex > -1 ? (
          <span>
            {beforeStr}
            <span style={{ backgroundColor: '#f50', color: '#fff' }}>
              {dept.name.substr(searchIndex, searchValue.length)}
            </span>
            {afterStr}
          </span>
        ) : dept.name

        return {
          key: dept.id,
          title: (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Space size={4}>
                <TeamOutlined style={{ color: '#1890ff' }} />
                <Text style={{ fontSize: '13px' }}>{highlightedName}</Text>
              </Space>
              <Space size={4}>
                {stats.total > 0 && (
                  <Tooltip title={`总计${stats.total}人，正常${stats.active}人，禁用${stats.inactive}人`}>
                    <Badge 
                      count={stats.total} 
                      size="small" 
                      style={{ 
                        backgroundColor: stats.total > 0 ? '#52c41a' : '#d9d9d9',
                        fontSize: '10px',
                        minWidth: '16px',
                        height: '16px',
                        lineHeight: '16px'
                      }}
                    />
                  </Tooltip>
                )}
              </Space>
            </div>
          ),
          children: children.length > 0 ? children : undefined,
          ...dept
        }
      })
  }

  const treeData = buildTreeData(deptData, null, searchValue)

  // 搜索处理
  const onSearch = (value) => {
    const expandedKeys = getExpandedKeys(deptData, value)
    setExpandedKeys(expandedKeys)
    setSearchValue(value)
    setAutoExpandParent(true)
  }

  // 获取需要展开的节点
  const getExpandedKeys = (depts, value) => {
    const expandedKeys = []
    if (!value) return expandedKeys

    const loop = (data) => {
      data.forEach(item => {
        if (item.name.toLowerCase().includes(value.toLowerCase())) {
          expandedKeys.push(item.id)
          // 展开所有父节点
          let parent = depts.find(d => d.id === item.parentId)
          while (parent) {
            if (!expandedKeys.includes(parent.id)) {
              expandedKeys.push(parent.id)
            }
            parent = depts.find(d => d.id === parent.parentId)
          }
        }
        if (item.children) {
          loop(item.children)
        }
      })
    }
    
    loop(buildTreeData(depts))
    return expandedKeys
  }

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="搜索部门"
          allowClear
          onSearch={onSearch}
          onChange={(e) => {
            if (!e.target.value) {
              setSearchValue('')
              setExpandedKeys([])
            }
          }}
          prefix={<SearchOutlined />}
          size="small"
        />
      </div>
      
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        showLine={false}
        showIcon={false}
        blockNode
        style={{
          fontSize: '13px'
        }}
      />
    </div>
  )
}

export default UserManageDeptTree