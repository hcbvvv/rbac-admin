import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 通知状态管理
 */
export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // 状态
      notifications: [
        {
          id: '1',
          type: 'info',
          title: '系统维护通知',
          content: '系统将于今晚22:00-23:00进行维护，期间可能无法正常访问',
          time: '2024-01-09 14:30',
          read: false
        },
        {
          id: '2', 
          type: 'success',
          title: '权限申请通过',
          content: '您申请的用户管理权限已通过审核',
          time: '2024-01-09 10:15',
          read: false
        },
        {
          id: '3',
          type: 'warning', 
          title: '密码即将过期',
          content: '您的密码将在7天后过期，请及时修改',
          time: '2024-01-08 16:45',
          read: true
        },
        {
          id: '4',
          type: 'error',
          title: '登录异常',
          content: '检测到您的账户在异地登录，请注意账户安全',
          time: '2024-01-08 09:20',
          read: true
        },
        {
          id: '5',
          type: 'info',
          title: '新功能上线',
          content: '数据导出功能已上线，欢迎体验使用',
          time: '2024-01-07 18:30',
          read: true
        }
      ],
      
      // 获取未读通知数量
      getUnreadCount: () => {
        const { notifications } = get()
        return notifications.filter(n => !n.read).length
      },
      
      // 添加新通知
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString(),
          time: new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          read: false
        }
        
        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }))
      },
      
      // 标记为已读
      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(notification => 
            notification.id === id 
              ? { ...notification, read: true }
              : notification
          )
        }))
      },
      
      // 删除通知
      deleteNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      
      // 全部标记为已读
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            read: true
          }))
        }))
      },
      
      // 清空已读通知
      clearReadNotifications: () => {
        set(state => ({
          notifications: state.notifications.filter(n => !n.read)
        }))
      },
      
      // 清空所有通知
      clearAllNotifications: () => {
        set({ notifications: [] })
      },
      
      // 批量操作
      batchOperation: (ids, operation) => {
        switch (operation) {
          case 'read':
            set(state => ({
              notifications: state.notifications.map(notification =>
                ids.includes(notification.id)
                  ? { ...notification, read: true }
                  : notification
              )
            }))
            break
          case 'delete':
            set(state => ({
              notifications: state.notifications.filter(n => !ids.includes(n.id))
            }))
            break
          default:
            break
        }
      }
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications
      })
    }
  )
)

// 通知类型常量
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success', 
  WARNING: 'warning',
  ERROR: 'error'
}

// 创建通知的辅助函数
export const createNotification = (type, title, content) => ({
  type,
  title,
  content
})