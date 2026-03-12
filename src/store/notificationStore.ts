import { create } from 'zustand'
import { readAllNotifications, deleteAllNotifications } from '@/api/notification'
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
  readAll: () => Promise<void>
  removeAll: () => Promise<void>
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  totalCount: 0,

  fetch: async (page = 1) => {
    try {
      const data = await getNotifications(page);
      set((state) => ({
        notifications: page === 1 ? data.results : [...state.notifications, ...data.results],
        totalCount: data.count,
      }));
    } catch (error) {
      console.error('알림 조회 실패:', error);
    }
  },

  markRead: async (id) => {
    try {
      await readNotification(id);
      set({
        notifications: get().notifications.map((n) =>
          n.notification_id === id ? { ...n, checked: true } : n
        ),
      });
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  },

  remove: async (id) => {
    try {
      await deleteNotification(id);
      set({
        notifications: get().notifications.filter((n) => n.notification_id !== id),
        totalCount: get().totalCount - 1,
      });
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  },

  readAll: async () => {
    try {
      await readAllNotifications();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, checked: true })),
      }));
    } catch (error) {
      console.error('전체 읽음 처리 실패:', error);
    }
  },

  removeAll: async () => {
    try {
      await deleteAllNotifications();
      set({ notifications: [], totalCount: 0 });
    } catch (error) {
      console.error('전체 알림 삭제 실패:', error);
    }
  },
}))
