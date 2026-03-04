import { useState, useEffect } from 'react'
import CloseIcon from '@/assets/base/icon-X.svg?react'
import LeftIcon from '@/assets/base/icon-left.svg?react'
import RightIcon from '@/assets/base/icon-right.svg?react'
import {
  getNotifications,
  deleteNotification,
  readNotification,
  Notification as NotificationType,
} from '@/api/notification'

const PAGE_SIZE = 10

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const unreadCount = notifications.filter((n) => !n.checked).length

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true)
      try {
        const data = await getNotifications()
        setNotifications(data.results)
        setTotalCount(data.count)
      } catch {
        setError('알림을 불러오는 데 실패했어요.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotifications()
  }, [currentPage])

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((n) => n.notification_id !== notificationId))
      setTotalCount((prev) => prev - 1)
    } catch {
      setError('알림 삭제에 실패했어요.')
    }
  }

  const handleRead = async (notificationId: number) => {
    try {
      await readNotification(notificationId)
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, checked: true } : n
        )
      )
    } catch {
      setError('알림 읽음 처리에 실패했어요.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
    if (diff < 1) return '방금 전'
    if (diff < 60) return `${diff}분 전`
    if (diff < 60 * 24) return `${Math.floor(diff / 60)}시간 전`
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-gray-500 text-sm">
        불러오는 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center py-16 text-error text-sm">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">

      <h2 className="text-base font-medium text-gray-900 text-center">
        확인하지 않은 알림{' '}
        <span className="text-primary font-bold">{unreadCount}개</span>
      </h2>

      {notifications.length === 0 ? (
        <div className="flex justify-center py-16 text-gray-500 text-sm">
          알림이 없어요.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <div
              key={notification.notification_id}
              onClick={() => !notification.checked && handleRead(notification.notification_id)}
              className="flex items-start gap-3 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer"
            >
              <div className="mt-1 shrink-0">
                {!notification.checked ? (
                  <div className="w-2 h-2 rounded-full bg-error" />
                ) : (
                  <div className="w-2 h-2" />
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p className="text-sm text-gray-900">{notification.content}</p>
                <p className="text-xs text-primary">{formatDate(notification.created)}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(notification.notification_id)
                }}
                className="shrink-0"
              >
                <CloseIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-gray-500"
          >
            <LeftIcon className="w-4 h-4 text-gray-500" />
          </button>
          <span className="w-8 h-8 rounded-full bg-primary text-background text-sm flex items-center justify-center">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-gray-500"
          >
            <RightIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

    </div>
  )
}

export default Notification