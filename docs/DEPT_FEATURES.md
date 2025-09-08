# RBAC 权限管理系统 - 部门管理功能

## 新增功能概览

### 1. 部门管理模块
- ✅ **部门树形结构**: 支持公司/部门/小组三级结构
- ✅ **部门CRUD操作**: 创建、编辑、删除、查看部门
- ✅ **部门信息管理**: 部门名称、编码、类型、负责人等
- ✅ **部门状态控制**: 正常、禁用、待启用状态
- ✅ **部门层级展示**: 树形结构直观展示组织架构

### 2. 数据权限控制
- ✅ **全部数据**: 可访问所有数据，不受部门限制
- ✅ **部门数据**: 只能访问本部门数据  
- ✅ **部门及下级**: 可访问本部门及下级部门数据
- ✅ **仅本人数据**: 只能访问自己创建的数据
- ✅ **自定义部门**: 可访问指定部门的数据

### 3. 新增组件
- ✅ **DeptSelector**: 部门选择器组件，支持树形选择
- ✅ **DataPermissionModal**: 数据权限配置组件
- ✅ **部门管理页面**: 完整的部门管理界面

### 4. 权限集成
- ✅ **用户管理**: 用户可分配到具体部门
- ✅ **角色权限**: 角色可配置数据访问范围
- ✅ **菜单权限**: 部门管理菜单权限控制
- ✅ **数据过滤**: 根据用户部门权限过滤数据

## 技术实现

### 1. 状态管理
```javascript
// 部门状态管理 (useDeptStore)
- fetchDepts(): 获取部门列表
- fetchDeptTree(): 获取部门树
- createDept(): 创建部门
- updateDept(): 更新部门
- deleteDept(): 删除部门
- getSubDeptIds(): 获取下级部门ID
```

### 2. 权限控制
```javascript
// 数据权限工具 (DataPermissionUtils)
- filterDataByScope(): 根据权限范围过滤数据
- getSubDeptIds(): 获取下级部门ID列表
- isSubDept(): 判断是否为下级部门
```

### 3. Hooks
```javascript
// useDataPermission Hook
- filterDataByPermission(): 数据权限过滤
- getAccessibleDeptIds(): 获取可访问部门ID
- canAccessDeptData(): 检查部门数据访问权限
```

## 使用示例

### 1. 部门选择器
```jsx
import { DeptSelector } from '@/components'

<DeptSelector
  value={deptId}
  onChange={setDeptId}
  placeholder="请选择部门"
  multiple={false}
/>
```

### 2. 数据权限配置
```jsx
import { DataPermissionModal } from '@/components'

<DataPermissionModal
  visible={modalVisible}
  onOk={handleSave}
  onCancel={() => setModalVisible(false)}
  initialValues={{ dataScope: 'dept', customDeptIds: [] }}
/>
```

### 3. 数据权限过滤
```javascript
import { useDataPermission } from '@/hooks/useDataPermission'

const { filterDataByPermission } = useDataPermission()

// 根据用户权限过滤数据
const filteredData = filterDataByPermission(
  originalData, 
  'dept_sub', // 数据范围
  [] // 自定义部门ID
)
```

## 权限矩阵

| 权限代码 | 权限名称 | 功能描述 |
|---------|---------|----------|
| `dept:view` | 查看部门 | 可以查看部门列表和详情 |
| `dept:create` | 创建部门 | 可以创建新的部门 |
| `dept:edit` | 编辑部门 | 可以修改部门信息 |
| `dept:delete` | 删除部门 | 可以删除部门（需要无下级部门） |
| `dept:assign` | 分配部门 | 可以将用户分配到部门 |

## 数据权限级别

| 级别 | 说明 | 适用场景 |
|------|------|----------|
| 全部数据 | 不受部门限制 | 超级管理员、系统管理员 |
| 部门数据 | 只看本部门 | 部门主管、部门员工 |
| 部门及下级 | 本部门+下级 | 大部门领导、区域负责人 |
| 仅本人数据 | 只看自己的 | 普通员工、业务员 |
| 自定义部门 | 指定部门 | 跨部门协作、特殊岗位 |

## 部门类型

- **company**: 公司级别（顶级）
- **department**: 部门级别（中级）  
- **team**: 小组级别（基层）

## 注意事项

1. **删除限制**: 有下级部门的不能删除
2. **权限继承**: 下级部门继承上级部门的部分权限
3. **数据隔离**: 不同数据权限级别严格隔离数据访问
4. **性能优化**: 部门树和权限计算进行了缓存优化
5. **用户体验**: 提供直观的树形界面和权限配置