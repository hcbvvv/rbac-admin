import React from 'react'
import { Descriptions, Tag } from 'antd'
import MenuIcon from '@/components/MenuIcon'
import styles from '../menuManage.module.css'

/**
 * 基本信息标签页组件
 */
const BasicInfoTab = ({ menuInfo }) => {
  if (!menuInfo) return null
  
  // 获取菜单类型标签
  const getTypeTag = (type) => {
    const typeMap = {
      directory: { label: '目录', color: 'orange' },
      menu: { label: '菜单', color: 'blue' },
      button: { label: '按钮', color: 'green' },
      api: { label: '接口', color: 'purple' }
    }
    const typeInfo = typeMap[type] || { label: type, color: 'default' }
    return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
  }
  
  return (
    <div className={styles.basicInfoTab}>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="菜单名称">
          {menuInfo.title}
        </Descriptions.Item>
        <Descriptions.Item label="组件名称">
          {menuInfo.name || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="路由路径">
          {menuInfo.path || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="菜单类型">
          {getTypeTag(menuInfo.type)}
        </Descriptions.Item>
        <Descriptions.Item label="菜单图标">
          {menuInfo.icon ? (
            <span>
              <MenuIcon type={menuInfo.icon} style={{ marginRight: 8 }} />
              {menuInfo.icon}
            </span>
          ) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="排序">
          {menuInfo.sort}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={menuInfo.status === 'active' ? 'green' : 'red'}>
            {menuInfo.status === 'active' ? '启用' : '禁用'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="是否隐藏">
          <Tag color={menuInfo.hidden ? 'orange' : 'blue'}>
            {menuInfo.hidden ? '隐藏' : '显示'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="缓存页面">
          <Tag color={menuInfo.keepAlive ? 'green' : 'red'}>
            {menuInfo.keepAlive ? '是' : '否'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="最小化显示">
          <Tag color={menuInfo.showInCollapsed ? 'green' : 'red'}>
            {menuInfo.showInCollapsed ? '是' : '否'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="权限数量" span={2}>
          <Tag color="blue">
            {menuInfo.permissions?.list?.length || 0} 个权限
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>
          {menuInfo.createdAt}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default BasicInfoTab