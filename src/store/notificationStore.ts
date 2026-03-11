import { create } from 'zustand'
import {
  getNotifications,
  deleteNotification,
  readNotification,
  type Notification,
} from '@/api/notification'

interface NotificationState {
  notifications: Notification[]
  totalCount: number
  fetch: (page?: number) => Promise<void>
  markRead: (id: number) => Promise<void>
  remove: (id: number) => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  totalCount: 0,

  fetch: async (page = 1) => {
    const data = await getNotifications(page)
    if (page === 1) {
      set({ notifications: data.results, totalCount: data.count })
    } else {
      set({ notifications: data.results, totalCount: data.count })
    }
  },

  markRead: async (id) => {
    await readNotification(id)
    set({
      notifications: get().notifications.map((n) =>
        n.notification_id === id ? { ...n, checked: true } : n
      ),
    })
  },

  remove: async (id) => {
    await deleteNotification(id)
    set({
      notifications: get().notifications.filter((n) => n.notification_id !== id),
      totalCount: get().totalCount - 1,
    })
  },
}))
