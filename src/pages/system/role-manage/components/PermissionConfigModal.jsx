import React from 'react'
import { Modal, Alert, Tree } from 'antd'
import { 
  MenuOutlined,
  ControlOutlined,
  ApiOutlined
} from '@ant-design/icons'
import styles from '../roleManage.module.less'

/**
 * 权限配置模态框组件
 */
const PermissionConfigModal = ({
  visible,
  selectedRole,
  checkedPermissions,
  loading,
  onSave,
  onCancel,
  onPermissionChange,
}) => {
  // 模拟权限树数据
  const permissionTree = [
    {
      title: '系统管理',
      key: 'system',
      icon: <MenuOutlined />,
      children: [
        {
          title: '用户管理',
          key: 'user-module',
          icon: <MenuOutlined style={{ color: '#52c41a' }} />,
          children: [
            { 
              title: '用户管理页面', 
              key: '/system/user', 
              icon: <MenuOutlined style={{ color: '#52c41a' }} />
            },
            { 
              title: '新增用户', 
              key: 'user:create', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '编辑用户', 
              key: 'user:edit', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '删除用户', 
              key: 'user:delete', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '获取用户列表接口', 
              key: 'GET /api/users', 
              icon: <ApiOutlined style={{ color: '#722ed1' }} />
            },
            { 
              title: '创建用户接口', 
              key: 'POST /api/users', 
              icon: <ApiOutlined style={{ color: '#722ed1' }} />
            },
          ],
        },
        {
          title: '角色管理',
          key: 'role-module',
          icon: <MenuOutlined style={{ color: '#52c41a' }} />,
          children: [
            { 
              title: '角色管理页面', 
              key: '/system/role', 
              icon: <MenuOutlined style={{ color: '#52c41a' }} />
            },
            { 
              title: '新增角色', 
              key: 'role:create', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '编辑角色', 
              key: 'role:edit', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '删除角色', 
              key: 'role:delete', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '获取角色列表接口', 
              key: 'GET /api/roles', 
              icon: <ApiOutlined style={{ color: '#722ed1' }} />
            },
          ],
        },
        {
          title: '菜单管理',
          key: 'menu-module',
          icon: <MenuOutlined style={{ color: '#52c41a' }} />,
          children: [
            { 
              title: '菜单管理页面', 
              key: '/system/menu', 
              icon: <MenuOutlined style={{ color: '#52c41a' }} />
            },
            { 
              title: '新增菜单', 
              key: 'menu:create', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '编辑菜单', 
              key: 'menu:edit', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '删除菜单', 
              key: 'menu:delete', 
              icon: <ControlOutlined style={{ color: '#fa8c16' }} />
            },
            { 
              title: '获取菜单树接口', 
              key: 'GET /api/menus/tree', 
              icon: <ApiOutlined style={{ color: '#722ed1' }} />
            },
          ],
        },
      ],
    },
  ]
  
  return (
    <Modal
      title={`配置角色权限 - ${selectedRole?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={onSave}
      confirmLoading={loading}
      width={700}
      className={styles.permissionModal}
    >
      <Alert
        className={styles.permissionAlert}
        message="权限配置说明"
        description="请为角色选择相应的菜单、按钮和接口权限。角色不分配数据权限，数据权限由菜单和接口单独管理。"
        type="info"
        showIcon
      />
      <div className={styles.permissionTreeContainer}>
        <Tree
          checkable
          treeData={permissionTree}
          checkedKeys={checkedPermissions}
          onCheck={onPermissionChange}
          defaultExpandAll
        />
      </div>
    </Modal>
  )
}

export default PermissionConfigModal