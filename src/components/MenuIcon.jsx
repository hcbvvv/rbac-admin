import React from 'react'
import * as Icons from '@ant-design/icons'

/**
 * 菜单图标组件
 * 根据图标名称动态渲染Ant Design图标
 */
const MenuIcon = ({ icon, style = {}, ...props }) => {
  if (!icon) return null
  
  // 获取图标组件
  const IconComponent = Icons[icon]
  
  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in @ant-design/icons`)
    return <Icons.MenuOutlined style={style} {...props} />
  }
  
  return <IconComponent style={style} {...props} />
}

export default MenuIcon