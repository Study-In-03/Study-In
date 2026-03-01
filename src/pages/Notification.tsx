import { useState } from 'react'
import closeIcon from '@/assets/base/icon-X.svg'

// 임시 알림 데이터 - 실제 API 연동 시 교체 필요
const mockNotifications = [
  { id: 1, message: '[크롬 확장 프로그램 함께 구현 해보실 분 찾습니다.] 스터디에 댓글이 달렸어요.', time: '3분 전', isRead: false },
  { id: 2, message: '[크롬 확장 프로그램 함께 구현 해보실 분 찾습니다.] 스터디에 새로운 유저가 참가했어요.', time: '30분 전', isRead: false },
  { id: 3, message: '관심있는 [자바스크립트 공부 인증 스터디] 스터디가 곧 모집이 마감됩니다.', time: '30분 전', isRead: false },
  { id: 4, message: '축하드립니다! <은잔디> 등급으로 승급하셨습니다. 🎉', time: '2022.04.01', isRead: true },
  { id: 5, message: '관심있는 [춤추면서 파이썬 공부] 스터디가 곧 모집이 마감됩니다.', time: '2022.03.16', isRead: true },
  { id: 6, message: '관심있는 [으라차차 파이썬 정복하기] 스터디가 곧 모집이 마감됩니다.', time: '2022.03.05', isRead: true },
]

const Notification = () => {
  const [notifications, setNotifications] = useState(mockNotifications)

  // 알림 삭제
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  // 미확인 알림 개수
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">

      {/* 미확인 알림 개수 */}
      <h2 className="text-base font-medium text-gray-900 text-center">
        확인하지 않은 알림{' '}
        <span className="text-primary font-bold">{unreadCount}개</span>
      </h2>

      {/* 알림 목록 */}
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 border border-gray-300 rounded-lg px-4 py-3"
          >
            {/* 미확인 빨간 점 */}
            <div className="mt-1 shrink-0">
              {!notification.isRead ? (
                <div className="w-2 h-2 rounded-full bg-error" />
              ) : (
                <div className="w-2 h-2" />
              )}
            </div>

            {/* 알림 내용 + 시간 */}
            <div className="flex-1 flex flex-col gap-1">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-primary">{notification.time}</p>
            </div>

            {/* X 버튼 */}
            <button
              onClick={() => deleteNotification(notification.id)}
              className="shrink-0"
            >
              <img src={closeIcon} alt="삭제" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-4 mt-2">
        <button className="text-gray-500">{'<'}</button>
        <span className="w-8 h-8 rounded-full bg-primary text-background text-sm flex items-center justify-center">1</span>
        <button className="text-gray-500">{'>'}</button>
      </div>

    </div>
  )
}

export default Notification