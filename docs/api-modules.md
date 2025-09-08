# API 模块化重构说明

## 概述

API已经重构为模块化结构，每个功能模块有独立的API文件，并通过统一的入口文件导出。

## 文件结构

```
src/api/
├── index.js          # 统一导出文件
├── auth.js           # 认证相关API
├── user.js           # 用户管理API
├── role.js           # 角色管理API
├── permission.js     # 权限管理API
├── menu.js           # 菜单管理API
├── dept.js           # 部门管理API
└── system.js         # 系统管理API
```

## 各模块功能说明

### 1. auth.js - 认证API
- 用户登录/登出
- Token刷新
- 密码修改/重置
- 验证码发送
- Token验证

### 2. user.js - 用户管理API
- 用户CRUD操作
- 用户角色分配
- 用户状态管理
- 用户导入/导出
- 密码重置

### 3. role.js - 角色管理API
- 角色CRUD操作
- 角色权限分配
- 数据权限设置
- 角色用户分配

### 4. permission.js - 权限管理API
- 权限CRUD操作
- 权限树管理
- 权限验证
- 权限同步

### 5. menu.js - 菜单管理API
- 菜单CRUD操作
- 菜单树管理
- 用户菜单获取
- 菜单权限分配

### 6. dept.js - 部门管理API
- 部门CRUD操作
- 部门树管理
- 部门用户分配
- 部门权限管理
- 子部门查询

### 7. system.js - 系统管理API
- 系统配置
- 操作日志
- 文件上传
- 数据字典
- 缓存管理

## 使用方式

### 1. 导入单个API模块
```javascript
import { authAPI } from '@/api'
import { userAPI } from '@/api'

// 使用
const users = await userAPI.getUsers()
```

### 2. 导入多个API模块
```javascript
import { authAPI, userAPI, roleAPI } from '@/api'

// 使用
const token = await authAPI.login(loginData)
const users = await userAPI.getUsers()
```

### 3. 导入请求工具
```javascript
import { request } from '@/api'

// 直接使用request（不推荐，建议使用API模块）
const response = await request.get('/custom-endpoint')
```

### 4. 动态导入（推荐用于按需加载）
```javascript
const { userAPI } = await import('@/api')
const users = await userAPI.getUsers()
```

## 在组件中使用示例

### React组件中使用
```jsx
import React, { useState, useEffect } from 'react'
import { userAPI, deptAPI } from '@/api'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [depts, setDepts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, deptsData] = await Promise.all([
          userAPI.getUsers(),
          deptAPI.getDeptTree()
        ])
        setUsers(usersData)
        setDepts(deptsData)
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    }
    fetchData()
  }, [])

  return <div>{/* 组件内容 */}</div>
}
```

### Zustand Store中使用
```javascript
import { create } from 'zustand'
import { userAPI } from '@/api'

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true })
    try {
      const users = await userAPI.getUsers()
      set({ users, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  }
}))
```

## 数据权限API使用

### 设置角色数据权限
```javascript
import { roleAPI } from '@/api'

// 设置为部门及下级数据权限
await roleAPI.setDataScope(roleId, 'dept_sub')

// 设置为自定义数据权限
await roleAPI.setDataScope(roleId, 'custom', [deptId1, deptId2])
```

### 获取用户可访问的部门ID
```javascript
import { deptAPI } from '@/api'

// 获取部门的所有下级部门ID
const subDeptIds = await deptAPI.getSubDeptIds(deptId)
```

## 优势

1. **模块化**: 每个功能模块独立，便于维护
2. **按需导入**: 减少不必要的代码打包
3. **类型安全**: 更好的代码提示和错误检测
4. **统一管理**: 通过index.js统一导出，便于管理
5. **扩展性**: 新增功能模块不影响现有代码

## 注意事项

1. 所有API调用都应该通过对应的API模块，避免直接使用request
2. 新增API时，记得在index.js中添加导出
3. 保持API命名的一致性和语义化
4. 错误处理应该在调用方进行，API模块只负责请求
5. 对于复杂的业务逻辑，建议在Store中处理而不是在API模块中