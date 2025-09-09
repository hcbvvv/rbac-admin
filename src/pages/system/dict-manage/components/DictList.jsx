import React from 'react'
import { Card, Space, Input, Button, Badge } from 'antd'
import { BookOutlined, PlusOutlined } from '@ant-design/icons'
import styles from '../dictManage.module.css'

const { Search: AntSearch } = Input

/**
 * 字典列表组件（左侧面板）
 */
const DictList = ({
  displayedDictList = [],
  selectedDict,
  dictSearchKeyword,
  leftListPagination,
  onSearchChange,
  onLoadMore,
  onDictSelect,
  onAddDict
}) => {
  return (
    <Card
      title={
        <Space>
          <BookOutlined />
          <span>字典列表</span>
          <Badge 
            count={`${displayedDictList.length}/${leftListPagination.total}`} 
            showZero 
            color="blue" 
          />
        </Space>
      }
      extra={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={onAddDict}
        >
          新增
        </Button>
      }
      size="small"
      className={styles.dictListCard}
      styles={{ body: { padding: '12px', overflow: 'auto' } }}
    >
      <Space direction="vertical" className={styles.searchContainer}>
        <AntSearch
          placeholder="搜索字典名称、编码"
          allowClear
          value={dictSearchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          onSearch={onSearchChange}
          style={{ width: '100%' }}
          size="small"
        />
      </Space>
      
      <div className={styles.dictListContainer}>
        {displayedDictList.map(dict => (
          <div
            key={dict.id}
            onClick={() => onDictSelect(dict)}
            className={`${styles.dictItem} ${
              selectedDict?.id === dict.id ? styles.dictItemSelected : ''
            }`}
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
            <div className={styles.dictItemContent}>
              <div className={styles.dictItemInfo}>
                <div className={`${styles.dictItemName} ${
                  selectedDict?.id === dict.id ? styles.dictItemNameSelected : ''
                }`}>
                  {dict.dictName}
                </div>
                <div className={styles.dictItemCode}>
                  {dict.dictCode}
                </div>
              </div>
              <Badge 
                status={dict.status ? 'success' : 'error'} 
                className={styles.dictItemStatus}
              />
            </div>
          </div>
        ))}
        
        {/* 点击更多按钮 */}
        {leftListPagination.hasMore && displayedDictList.length > 0 && (
          <div className={styles.loadMoreSection}>
            <Button 
              type="link" 
              onClick={onLoadMore}
              className={styles.loadMoreButton}
            >
              点击加载更多 ({leftListPagination.total - displayedDictList.length} 项剩余)
            </Button>
          </div>
        )}
        
        {/* 空状态 */}
        {displayedDictList.length === 0 && (
          <div className={styles.emptyState}>
            {dictSearchKeyword ? '未找到匹配的字典' : '暂无字典数据'}
          </div>
        )}
        
        {/* 已加载全部提示 */}
        {!leftListPagination.hasMore && displayedDictList.length > 0 && (
          <div className={styles.loadedAllText}>
            已加载全部 {displayedDictList.length} 个字典
          </div>
        )}
      </div>
    </Card>
  )
}

export default DictList