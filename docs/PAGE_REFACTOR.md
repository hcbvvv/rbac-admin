# Pages 模块化重构说明

## 📁 新的文件结构

```
src/pages/
├── index.js                          # 页面统一导出文件
├── dashboard/                        # 仪表板模块
│   ├── index.js                     # 模块入口
│   ├── Dashboard.jsx                # 主组件
│   ├── dashboard.module.css         # 样式文件
│   └── components/                  # 子组件
│       ├── WelcomeCard.jsx         # 欢迎卡片
│       ├── StatisticsCards.jsx     # 统计卡片
│       ├── QuickActions.jsx        # 快捷操作
│       └── SystemInfo.jsx          # 系统信息
├── login/                           # 登录模块
│   ├── index.js                    # 模块入口
│   ├── Login.jsx                   # 主组件
│   ├── login.module.css            # 样式文件
│   └── components/                 # 子组件
│       ├── LoginHeader.jsx         # 登录头部
│       ├── LoginForm.jsx           # 登录表单
│       ├── LoginFooter.jsx         # 登录底部
│       └── DemoLogin.jsx           # 演示登录
├── system/                         # 系统管理模块
│   ├── dict-manage/                # 数据字典管理模块
│   │   ├── index.js               # 模块入口
│   │   ├── DictManage.jsx         # 主组件
│   │   ├── dictManage.module.css  # 样式文件
│   │   ├── components/            # 子组件
│   │   │   ├── DictList.jsx       # 字典列表（左侧）
│   │   │   ├── DictDetail.jsx     # 字典详情（右上）
│   │   │   ├── DictOptions.jsx    # 字典选项（右下）
│   │   │   ├── DictModal.jsx      # 字典弹窗
│   │   │   └── OptionModal.jsx    # 选项弹窗
│   │   └── hooks/                 # 自定义Hook
│   │       └── useDictManage.js   # 业务逻辑Hook
│   ├── UserManage.jsx             # 用户管理（待重构）
│   ├── RoleManage.jsx             # 角色管理（待重构）
│   ├── DeptManage.jsx             # 部门管理（待重构）
│   ├── MenuManage.jsx             # 菜单管理（待重构）
│   ├── ErrorDemo.jsx              # 错误演示（待重构）
│   └── ErrorDemoTest.jsx          # 错误测试（待重构）
├── errors/                         # 错误页面模块
│   ├── NotFound.jsx               # 404页面（待重构）
│   ├── Forbidden.jsx              # 403页面（待重构）
│   └── ServerError.jsx            # 500页面（待重构）
└── Profile.jsx                    # 个人资料页面（待重构）
```

## 🎯 重构原则

### 1. 模块化结构
- 每个页面独立为一个文件夹
- 包含主组件、样式文件、子组件和业务逻辑Hook
- 通过index.js统一导出

### 2. 组件分离
- **主组件**：负责整体布局和状态管理
- **子组件**：功能单一，可复用
- **业务Hook**：抽离业务逻辑，便于测试和维护

### 3. 样式管理
- 使用CSS Modules避免样式冲突
- 样式文件与组件文件同级
- 语义化的类名命名

### 4. 左右分栏页面拆分
以数据字典为例：
- **左侧组件** (`DictList.jsx`)：字典列表、搜索、分页
- **右侧上方** (`DictDetail.jsx`)：字典详情展示
- **右侧下方** (`DictOptions.jsx`)：字典选项管理
- **弹窗组件**：独立的表单弹窗

## ✅ 已完成的重构

### Dashboard 页面
- ✅ 主组件拆分
- ✅ 4个子组件（欢迎卡片、统计卡片、快捷操作、系统信息）
- ✅ 样式文件分离
- ✅ 模块入口文件

### Login 页面
- ✅ 主组件拆分
- ✅ 4个子组件（头部、表单、底部、演示登录）
- ✅ 样式文件分离
- ✅ 模块入口文件

### DictManage 页面
- ✅ 主组件拆分
- ✅ 5个子组件（列表、详情、选项、字典弹窗、选项弹窗）
- ✅ 业务逻辑Hook抽离
- ✅ 样式文件分离
- ✅ 模块入口文件

## 🔄 待重构的页面

以下页面仍需要按照相同原则进行重构：
- [ ] Profile.jsx
- [ ] UserManage.jsx
- [ ] RoleManage.jsx
- [ ] DeptManage.jsx
- [ ] MenuManage.jsx
- [ ] ErrorDemo.jsx
- [ ] ErrorDemoTest.jsx
- [ ] NotFound.jsx
- [ ] Forbidden.jsx
- [ ] ServerError.jsx

## 📦 使用方式

### 1. 导入页面组件
```javascript
// 直接从pages导入
import { Dashboard, Login, DictManage } from '@/pages'

// 或者从具体模块导入
import Dashboard from '@/pages/dashboard'
import { WelcomeCard, StatisticsCards } from '@/pages/dashboard'
```

### 2. 路由配置
```javascript
// 使用模块化的懒加载
const Dashboard = lazy(() => import('@/pages/dashboard'))
const DictManage = lazy(() => import('@/pages/system/dict-manage'))
```

### 3. 样式使用
```javascript
import styles from './componentName.module.css'

// 使用样式
<div className={styles.container}>...</div>
```

## 🚀 优势

1. **可维护性**：每个模块独立，职责清晰
2. **可复用性**：子组件可以在其他地方复用
3. **可测试性**：业务逻辑和UI分离，便于单元测试
4. **团队协作**：不同开发者可以并行开发不同组件
5. **性能优化**：按需加载，减少初始包大小
6. **样式隔离**：CSS Modules避免样式冲突

## 📝 注意事项

1. 所有新增的模块都应遵循此结构
2. 路由配置需要更新为新的导入路径
3. 样式类名应使用语义化命名
4. 组件间通信优先使用props，复杂状态使用Hook管理