import React from 'react'
import { Card, Space, Input, Button, Badge, Tag, Table, Alert } from 'antd'
import { OrderedListOutlined, PlusOutlined } from '@ant-design/icons'
import styles from '../dictManage.module.less'

const { Search } = Input

/**
 * 字典选项组件（右侧下方）
 */
const DictOptions = ({
  selectedDict,
  currentOptions = [],
  filteredOptionList = [],
  optionSearchKeyword,
  optionLoading,
  onSearchChange,
  onAddOption,
  onEditOption,
  onDeleteOption
}) => {
  // 选项表格列定义
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
      render: (text) => <code>{text}</code>
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
          <span style={{ color: '#666' }}>{color}</span>
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
        <span title={text} style={{ color: '#666' }}>{text}</span>
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
            onClick={() => onEditOption(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            danger
            onClick={() => onDeleteOption(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]
  
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              onSearch={onSearchChange}
              size="small"
              className={styles.optionSearchContainer}
            />
          )}
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={onAddOption}
            disabled={!selectedDict}
            size="small"
          >
            新增选项
          </Button>
        </Space>
      }
      size="small"
      className={styles.dictOptionCard}
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
          className={styles.optionTable}
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
  )
}

export default DictOptions