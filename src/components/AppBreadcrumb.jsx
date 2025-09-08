import React, { useMemo, useEffect } from 'react'
import { Breadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import { useMenuStore } from '@/stores'
import MenuIcon from '@/components/MenuIcon'

/**
 * 面包屑组件
 */
const AppBreadcrumb = () => {
  const location = useLocation()
  const { breadcrumbs, generateBreadcrumbs } = useMenuStore()
  
  // 根据当前路径生成面包屑
  useEffect(() => {
    generateBreadcrumbs(location.pathname)
  }, [location.pathname, generateBreadcrumbs])
  
  // 转换为 Ant Design Breadcrumb 组件需要的格式
  const breadcrumbItems = useMemo(() => {
    return breadcrumbs.map((breadcrumb, index) => {
      const isLast = index === breadcrumbs.length - 1
      
      return {
        key: breadcrumb.path,
        title: (
          <span>
            {breadcrumb.icon && <MenuIcon icon={breadcrumb.icon} style={{ marginRight: 4 }} />}
            {isLast ? (
              breadcrumb.title
            ) : (
              <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
            )}
          </span>
        ),
      }
    })
  }, [breadcrumbs])
  
  // 如果只有首页，不显示面包屑
  if (breadcrumbItems.length <= 1) {
    return null
  }
  
  return (
    <Breadcrumb
      style={{
        margin: 0, // 移除默认的margin
        fontSize: '14px',
      }}
      items={breadcrumbItems}
    />
  )
}

export default AppBreadcrumb