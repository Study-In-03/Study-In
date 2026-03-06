import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getNotifications } from '@/api/notification';
import PersonIcon from '@/assets/base/icon-person.svg?react';
import NotificationIcon from '@/assets/base/icon-Notification.svg?react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { isLoggedIn } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) return
    const fetchUnread = async () => {
      try {
        const data = await getNotifications()
        setUnreadCount(data.results.filter((n) => !n.checked).length)
      } catch {
        // 에러 무시
      }
    }
    fetchUnread()
  }, [isLoggedIn])

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-background z-50 lg:hidden flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="text-gray-500 text-xl">←</button>
        </div>

        <div className="flex flex-col items-center gap-3 px-6 py-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            <PersonIcon className="w-12 h-12 text-gray-300" />
          </div>

          {isLoggedIn ? (
            <>
              <p className="text-lg font-bold text-gray-900">파이썬 연금술사</p>
              <Link
                to="/study/create"
                onClick={onClose}
                className="w-full py-3 bg-primary text-background text-base font-medium rounded-lg text-center"
              >
                스터디 만들기
              </Link>

              <div className="flex justify-around w-full pt-2">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 text-xs text-gray-500"
                >
                  <PersonIcon className="w-6 h-6 text-gray-500" />
                  프로필
                </Link>
                <Link
                  to="/my-study"
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 text-xs text-gray-500"
                >
                  <PersonIcon className="w-6 h-6 text-gray-500" />
                  My 스터디
                </Link>
                <Link
                  to="/notification"
                  onClick={onClose}
                  className="relative flex flex-col items-center gap-1 text-xs text-gray-500"
                >
                  <div className="relative">
                    <NotificationIcon className="w-6 h-6 text-gray-500" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
                    )}
                  </div>
                  알림
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-base text-gray-500 text-center">
                스터디를 만들어<br />사람들과 함께 공부할 수 있어요!
              </p>
              <Link
                to="/login"
                onClick={onClose}
                className="w-full py-3 bg-primary text-background text-base font-medium rounded-lg text-center"
              >
                시작하기
              </Link>
            </>
          )}
        </div>

        <div className="h-px bg-gray-100 mx-6 my-2" />

        <nav className="flex flex-col px-6 gap-1">
          <Link
            to="/"
            onClick={onClose}
            className="py-3 text-base text-gray-700"
          >
            스터디인 홈
          </Link>
          <Link
            to="/?type=local"
            onClick={onClose}
            className="py-3 text-base text-gray-700"
          >
            내지역 스터디
          </Link>
          <Link
            to="/?type=online"
            onClick={onClose}
            className="py-3 text-base text-gray-700"
          >
            온라인 스터디
          </Link>
        </nav>

        {isLoggedIn && (
          <>
            <div className="h-px bg-gray-100 mx-6 my-2" />
            <button className="px-6 py-3 text-base text-gray-700 text-left">
              로그아웃
            </button>
          </>
        )}
      </div>
    </>
  );
}