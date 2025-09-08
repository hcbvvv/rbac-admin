import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { menuAPI } from '@/api'

/**
 * 菜单状态管理
 * 包括菜单数据、面包屑、选中状态等
 */
export const useMenuStore = create(
  persist(
    (set, get) => ({
      // 原始菜单数据
      menuData: [
        {
          id: '1',
          key: '/dashboard',
          path: '/dashboard',
          title: '仪表板',
          icon: 'DashboardOutlined',
          parentId: null,
          sort: 1,
          permission: null,
          component: 'Dashboard',
        },
        {
          id: '2',
          key: '/system',
          path: '/system',
          title: '系统管理',
          icon: 'SettingOutlined',
          parentId: null,
          sort: 2,
          permission: 'system:manage',
          component: null,
        },
        {
          id: '2-1',
          key: '/system/user',
          path: '/system/user',
          title: '用户管理',
          icon: 'UserOutlined',
          parentId: '2',
          sort: 1,
          permission: 'user:view',
          component: 'UserManage',
        },
        {
          id: '2-2',
          key: '/system/role',
          path: '/system/role',
          title: '角色管理',
          icon: 'TeamOutlined',
          parentId: '2',
          sort: 2,
          permission: 'role:view',
          component: 'RoleManage',
        },
        {
          id: '2-4',
          key: '/system/dept',
          path: '/system/dept',
          title: '部门管理',
          icon: 'ApartmentOutlined',
          parentId: '2',
          sort: 3,
          permission: 'dept:view',
          component: 'DeptManage',
        },
        {
          id: '2-3',
          key: '/system/menu',
          path: '/system/menu',
          title: '菜单管理',
          icon: 'MenuOutlined',
          parentId: '2',
          sort: 4,
          permission: 'menu:view',
          component: 'MenuManage',
        },
        {
          id: '2-5',
          key: '/system/error-demo',
          path: '/system/error-demo',
          title: '错误页面样例',
          icon: 'ExclamationCircleOutlined',
          parentId: '2',
          sort: 5,
          permission: null,
          component: 'ErrorDemo',
        },
      ],

      // 菜单树结构
      menuTree: [],

      // 扁平化的菜单映射（用于快速查找）
      menuMap: {},

      // 当前选中的菜单
      selectedKeys: [],

      // 当前展开的菜单
      openKeys: [],

      // 面包屑数据
      breadcrumbs: [],

      // 加载状态
      loading: false,

      // 构建菜单树
      buildMenuTree: (menus = null, parentId = null) => {
        const menuData = menus || get().menuData
        return menuData
          .filter(menu => menu.parentId === parentId)
          .sort((a, b) => (a.sort || 0) - (b.sort || 0))
          .map(menu => {
            const children = get().buildMenuTree(menuData, menu.id)
            return {
              ...menu,
              children: children.length > 0 ? children : undefined,
            }
          })
      },

      // 构建菜单映射
      buildMenuMap: () => {
        const { menuData } = get()
        const menuMap = {}
        
        const buildMap = (menus) => {
          menus.forEach(menu => {
            menuMap[menu.key] = menu
            menuMap[menu.path] = menu
            if (menu.children) {
              buildMap(menu.children)
            }
          })
        }
        
        buildMap(menuData)
        set({ menuMap })
        return menuMap
      },

      // 将菜单数据转换为 Ant Design Menu 组件需要的格式
      transformMenuData: (menus) => {
        return menus.map(menu => ({
          key: menu.key,
          label: menu.title,
          icon: menu.icon,
          path: menu.path,
          permission: menu.permission,
          children: menu.children ? get().transformMenuData(menu.children) : undefined,
        }))
      },

      // 根据权限过滤菜单
      filterMenuByPermission: (menus, userPermissions = []) => {
        return menus.filter(menu => {
          // 如果菜单不需要权限，直接显示
          if (!menu.permission) {
            // 如果有子菜单，递归过滤
            if (menu.children) {
              const filteredChildren = get().filterMenuByPermission(menu.children, userPermissions)
              return {
                ...menu,
                children: filteredChildren.length > 0 ? filteredChildren : undefined
              }
            }
            return menu
          }
          
          // 检查用户是否有权限
          const hasPermission = userPermissions.some(p => p.code === menu.permission)
          
          if (hasPermission) {
            // 如果有子菜单，递归过滤
            if (menu.children) {
              const filteredChildren = get().filterMenuByPermission(menu.children, userPermissions)
              return {
                ...menu,
                children: filteredChildren.length > 0 ? filteredChildren : undefined
              }
            }
            return menu
          }
          
          return null
        }).filter(Boolean)
      },

      // 获取所有父级菜单的 key
      getParentKeys: (targetKey, menus = null) => {
        const menuTree = menus || get().menuTree
        const parents = []
        
        const findParents = (menus, target, currentParents = []) => {
          for (const menu of menus) {
            if (menu.key === target) {
              parents.push(...currentParents)
              return true
            }
            if (menu.children) {
              const found = findParents(menu.children, target, [...currentParents, menu.key])
              if (found) return true
            }
          }
          return false
        }
        
        findParents(menuTree, targetKey)
        return parents
      },

      // 根据路径生成面包屑
      generateBreadcrumbs: (pathname) => {
        const { menuMap } = get()
        const breadcrumbs = []
        
        // 添加首页
        breadcrumbs.push({
          path: '/dashboard',
          title: '首页',
          icon: 'HomeOutlined',
        })
        
        // 根据当前路径查找菜单
        const currentMenu = menuMap[pathname]
        if (currentMenu) {
          // 构建面包屑链路
          const buildBreadcrumbPath = (menu) => {
            if (menu.parentId) {
              const parentMenu = Object.values(menuMap).find(m => m.id === menu.parentId)
              if (parentMenu) {
                buildBreadcrumbPath(parentMenu)
              }
            }
            
            // 避免重复添加首页
            if (menu.path !== '/dashboard') {
              breadcrumbs.push({
                path: menu.path,
                title: menu.title,
                icon: menu.icon,
              })
            }
          }
          
          buildBreadcrumbPath(currentMenu)
        }
        
        set({ breadcrumbs })
        return breadcrumbs
      },

      // 设置选中的菜单
      setSelectedKeys: (keys) => {
        set({ selectedKeys: keys })
      },

      // 设置展开的菜单
      setOpenKeys: (keys) => {
        set({ openKeys: keys })
      },

      // 根据当前路径更新菜单状态
      updateMenuState: (pathname) => {
        const { getParentKeys, generateBreadcrumbs } = get()
        
        // 更新选中菜单
        set({ selectedKeys: [pathname] })
        
        // 更新展开菜单
        const parentKeys = getParentKeys(pathname)
        set({ openKeys: parentKeys })
        
        // 更新面包屑
        generateBreadcrumbs(pathname)
      },

      // 从服务器获取菜单数据
      fetchMenuData: async () => {
        set({ loading: true })
        try {
          // 这里调用API获取菜单数据
          // const menuData = await menuAPI.getUserMenus()
          
          // 暂时使用模拟数据
          const { menuData } = get()
          const menuTree = get().buildMenuTree(menuData)
          const menuMap = get().buildMenuMap()
          
          set({ 
            menuData, 
            menuTree,
            menuMap,
            loading: false 
          })
          
          return menuData
        } catch (error) {
          set({ loading: false })
          console.error('获取菜单数据失败:', error)
          throw error
        }
      },

      // 刷新菜单数据
      refreshMenuData: async () => {
        return get().fetchMenuData()
      },

      // 根据菜单key查找菜单
      getMenuByKey: (key) => {
        const { menuMap } = get()
        return menuMap[key]
      },

      // 根据路径查找菜单
      getMenuByPath: (path) => {
        const { menuMap } = get()
        return menuMap[path]
      },

      // 获取用户可访问的菜单
      getUserAccessibleMenus: (userPermissions = []) => {
        const { menuData, filterMenuByPermission, buildMenuTree } = get()
        const filteredMenuData = filterMenuByPermission(menuData, userPermissions)
        return buildMenuTree(filteredMenuData)
      },

      // 初始化菜单数据
      initMenuData: () => {
        const { buildMenuTree, buildMenuMap } = get()
        const menuTree = buildMenuTree()
        const menuMap = buildMenuMap()
        
        set({ menuTree, menuMap })
        return { menuTree, menuMap }
      },

      // 清除菜单数据
      clearMenuData: () => {
        set({
          menuData: [],
          menuTree: [],
          menuMap: {},
          selectedKeys: [],
          openKeys: [],
          breadcrumbs: [],
        })
      },
    }),
    {
      name: 'menu-storage',
      partialize: (state) => ({
        // 只持久化必要的数据
        selectedKeys: state.selectedKeys,
        openKeys: state.openKeys,
      }),
    }
  )
)