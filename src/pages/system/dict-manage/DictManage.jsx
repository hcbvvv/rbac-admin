import React, { useState } from 'react'
import { Row, Col } from 'antd'
import DictList from './components/DictList'
import DictDetail from './components/DictDetail'
import DictOptions from './components/DictOptions'
import DictModal from './components/DictModal'
import OptionModal from './components/OptionModal'
import { useDictManage } from './hooks/useDictManage'
import styles from './dictManage.module.css'

/**
 * 数据字典管理页面主组件
 */
const DictManage = () => {
  const {
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
    optionForm
  } = useDictManage()
  
  return (
    <div className={styles.dictManageContainer}>
      <Row gutter={[16, 16]} className={styles.dictManageRow}>
        {/* 左侧字典列表 */}
        <Col xs={24} sm={24} md={6} lg={5} className={styles.leftPanel}>
          <DictList
            displayedDictList={displayedDictList}
            selectedDict={selectedDict}
            dictSearchKeyword={dictSearchKeyword}
            leftListPagination={leftListPagination}
            onSearchChange={handleSearchChange}
            onLoadMore={handleLoadMore}
            onDictSelect={handleDictRowSelect}
            onAddDict={handleAddDict}
          />
        </Col>

        {/* 右侧内容区 */}
        <Col xs={24} sm={24} md={18} lg={19} className={styles.rightPanel}>
          <div className={styles.rightPanel}>
            {/* 字典详情 */}
            <DictDetail
              selectedDict={selectedDict}
              onEditDict={handleEditDict}
              onDeleteDict={handleDeleteDict}
            />

            {/* 字典选项 */}
            <DictOptions
              selectedDict={selectedDict}
              currentOptions={currentOptions}
              filteredOptionList={filteredOptionList}
              optionSearchKeyword={optionSearchKeyword}
              optionLoading={optionLoading}
              onSearchChange={setOptionSearchKeyword}
              onAddOption={handleAddOption}
              onEditOption={handleEditOption}
              onDeleteOption={handleDeleteOption}
            />
          </div>
        </Col>
      </Row>

      {/* 字典表单模态框 */}
      <DictModal
        visible={dictModalVisible}
        editingDict={editingDict}
        loading={loading}
        form={dictForm}
        onSave={handleSaveDict}
        onCancel={() => {
          setDictModalVisible(false)
          dictForm.resetFields()
        }}
      />

      {/* 选项表单模态框 */}
      <OptionModal
        visible={optionModalVisible}
        editingOption={editingOption}
        selectedDict={selectedDict}
        loading={loading}
        form={optionForm}
        onSave={handleSaveOption}
        onCancel={() => {
          setOptionModalVisible(false)
          optionForm.resetFields()
        }}
      />
    </div>
  )
}

export default DictManage