import { axiosInstance } from './axios';

export interface Notification {
  notification_id: number;
  notification_type: 'PARTICIPATION' | 'COMMENT' | 'RECOMMENT' | 'GRADE';
  acted_user_id: number | null;
  study_id: number | null;
  comment_id: number | null;
  content: string;
  checked: boolean;
  created: string;
}

export interface NotificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}

// 목록 조회
export async function getNotifications(page = 1): Promise<NotificationListResponse> {
  const res = await axiosInstance.get<NotificationListResponse>('/notifications/', {
    params: { page },
  });
  return res.data;
}

// 단건 조회
export async function getNotification(notificationId: number): Promise<Notification> {
  const res = await axiosInstance.get<Notification>(`/notifications/${notificationId}/`);
  return res.data;
}

// 모든 알림 읽음 처리
export async function readAllNotifications(): Promise<void> {
  await axiosInstance.put('/notifications/');
}

// 하나의 알림 읽음 처리
export async function readNotification(notificationId: number): Promise<void> {
  await axiosInstance.put(`/notifications/${notificationId}/`);
}

// 모든 알림 삭제
export async function deleteAllNotifications(): Promise<void> {
  await axiosInstance.delete('/notifications/');
}

// 하나의 알림 삭제
export async function deleteNotification(notificationId: number): Promise<void> {
  await axiosInstance.delete(`/notifications/${notificationId}/`);
}
