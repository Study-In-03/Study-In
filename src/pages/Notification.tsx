import { useState, useEffect } from 'react'
import LeftIcon from '@/assets/base/icon-left.svg?react'
import RightIcon from '@/assets/base/icon-right.svg?react'
import MyPageSidebar from '@/components/common/MyPageSidebar'
import { useNotificationStore } from '@/store/notificationStore'

const PAGE_SIZE = 10

const Notification = () => {
  const { notifications, totalCount, fetch, markRead, remove } = useNotificationStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const unreadCount = notifications.filter((n) => !n.checked).length

  useEffect(() => {
    setIsLoading(true)
    fetch(currentPage)
      .catch(() => setError('알림을 불러오는 데 실패했어요.'))
      .finally(() => setIsLoading(false))
  }, [currentPage])

  const handleDelete = async (id: number) => {
    try {
      await remove(id)
    } catch {
      setError('알림 삭제에 실패했어요.')
    }
  }

  const handleRead = async (id: number) => {
    try {
      await markRead(id)
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

  const renderContent = () => {
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
      <div className="border border-gray-300 rounded-xl px-4 pt-5 pb-4 md:px-10 md:pt-10 md:pb-10 flex flex-col gap-4 md:gap-[30px]">
        <h2 className="text-base md:text-2xl font-bold text-gray-900 text-center md:text-left">
          확인하지 않은 알림{' '}
          <span className="text-primary">{unreadCount}개</span>
        </h2>
        <div className="flex flex-col gap-2 md:gap-[10px]">
          {notifications.length === 0 ? (
            <div className="flex justify-center py-8 text-gray-500 text-sm">
              알림이 없어요.
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.notification_id}
                onClick={() => !notification.checked && handleRead(notification.notification_id)}
                className="cursor-pointer"
              >
                {/* 모바일 */}
                <div className={`md:hidden relative h-[80px] rounded-lg ${
                  notification.checked
                    ? 'bg-gray-100'
                    : 'bg-background outline outline-1 outline-gray-300'
                }`}>
                  <div className="absolute inset-0 p-[10px]">
                    <div className="flex flex-col gap-1">
                      <p className={`w-[calc(100%-28px)] text-sm leading-5 ${notification.checked ? 'text-gray-700' : 'text-surface'}`}>
                        {notification.content}
                      </p>
                      <p className={`text-xs leading-4 ${notification.checked ? 'text-gray-500' : 'text-primary'}`}>
                        {formatDate(notification.created)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(notification.notification_id) }}
                    className="absolute right-[10px] top-[10px] w-[18px] h-[18px] rounded-full bg-gray-300 flex items-center justify-center z-10 text-background text-xs leading-none"
                  >
                    ×
                  </button>
                  {!notification.checked && (
                    <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-error z-10" />
                  )}
                </div>

                {/* 데스크탑 */}
                <div className={`hidden md:flex relative items-center min-h-10 px-3 pr-[110px] rounded-lg ${
                  notification.checked
                    ? 'bg-gray-100'
                    : 'bg-background outline outline-1 outline-gray-300'
                }`}>
                  <p className={`flex-1 text-sm leading-5 py-[10px] ${notification.checked ? 'text-gray-700' : 'text-surface'}`}>
                    {notification.content}
                  </p>
                  <p className={`absolute right-[50px] top-[12px] text-xs leading-4 whitespace-nowrap ${notification.checked ? 'text-gray-500' : 'text-primary'}`}>
                    {formatDate(notification.created)}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(notification.notification_id) }}
                    className="absolute right-[11px] top-[11px] w-[18px] h-[18px] rounded-full bg-gray-300 flex items-center justify-center z-10 text-background text-xs leading-none"
                  >
                    ×
                  </button>
                  {!notification.checked && (
                    <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-error z-10" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-[10px]">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={currentPage === 1 ? 'text-gray-300' : 'text-gray-700'}
          >
            <LeftIcon className="w-5 h-5" />
          </button>
          <span className="px-[11px] py-[5px] rounded-[30px] bg-primary text-background text-sm font-bold leading-5">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(Math.max(totalPages, 1), p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={currentPage === totalPages || totalPages === 0 ? 'text-gray-300' : 'text-gray-700'}
          >
            <RightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-8 px-4 md:px-0 py-6">
      <MyPageSidebar />
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>
    </div>
  )
}

export default Notification
