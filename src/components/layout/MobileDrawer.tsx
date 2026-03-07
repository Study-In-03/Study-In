import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getNotifications } from "@/api/notification";
import PersonIcon from "@/assets/base/icon-person.svg?react";
import NotificationIcon from "@/assets/base/icon-Notification.svg?react";
import LeftArrowIcon from "@/assets/base/icon-Left-arrow.svg?react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { isLoggedIn, logout } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUnread = async () => {
      try {
        const data = await getNotifications();
        setUnreadCount(data.results.filter((n) => !n.checked).length);
      } catch {
        // 에러 무시
      }
    };
    fetchUnread();
  }, [isLoggedIn]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[290px] bg-background z-50 lg:hidden flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 프로필 영역 */}
        <div className="bg-[#F3F5FA] px-[45px] pt-[46px] pb-[30px] flex flex-col items-center gap-5 relative">
          <button
            onClick={onClose}
            className="absolute top-[10px] right-[10px] w-7 h-7 flex items-center justify-center"
          >
            <LeftArrowIcon className="w-4 h-4 text-[#8D9299]" />
          </button>

          <div className="flex flex-col items-center gap-5">
            <div className="w-[100px] h-[100px] rounded-full border border-[#D9DBE0] bg-gray-100 flex items-center justify-center overflow-hidden">
              <PersonIcon className="w-16 h-16 text-gray-300" />
            </div>

            {isLoggedIn ? (
              <>
                <p className="text-base font-bold text-surface text-center">
                  파이썬 연금술사
                </p>
                <Link
                  to="/study/create"
                  onClick={onClose}
                  className="w-[200px] py-[10px] bg-primary text-white text-sm font-medium rounded-lg text-center"
                >
                  스터디 만들기
                </Link>
              </>
            ) : (
              <>
                <p className="text-base text-gray-500 text-center">
                  스터디를 만들어
                  <br />
                  사람들과 함께 공부할 수 있어요!
                </p>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-[200px] py-[10px] bg-primary text-white text-sm font-medium rounded-lg text-center"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>

          {isLoggedIn && (
            <div className="flex justify-around w-[200px] pt-1">
              <Link
                to="/profile"
                onClick={onClose}
                className="flex flex-col items-center gap-1"
              >
                <PersonIcon className="w-[30px] h-[30px] text-surface" />
                <span className="text-xs text-[#47494D]">프로필</span>
              </Link>
              <Link
                to="/my-study"
                onClick={onClose}
                className="flex flex-col items-center gap-1"
              >
                <PersonIcon className="w-[30px] h-[30px] text-surface" />
                <span className="text-xs text-[#47494D]">My 스터디</span>
              </Link>
              <Link
                to="/notification"
                onClick={onClose}
                className="flex flex-col items-center gap-1"
              >
                <div className="relative w-[30px] h-[30px]">
                  <NotificationIcon className="w-[30px] h-[30px] text-surface" />
                  {unreadCount > 0 && (
                    <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
                  )}
                </div>
                <span className="text-xs text-[#47494D]">알림</span>
              </Link>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div className="h-[6px] bg-background" />

        {/* 네비게이션 */}
        <nav className="flex flex-col px-[30px] gap-1">
          <Link
            to="/"
            onClick={onClose}
            className="py-[15px] text-sm text-surface"
          >
            스터디인 홈
          </Link>
          <Link
            to="/?type=local"
            onClick={onClose}
            className="py-[15px] text-sm text-surface"
          >
            내지역 스터디
          </Link>
          <Link
            to="/?type=online"
            onClick={onClose}
            className="py-[15px] text-sm text-surface"
          >
            온라인 스터디
          </Link>
        </nav>

        {isLoggedIn && (
          <>
            <div className="h-[6px] bg-background" />
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-[30px] py-[15px] text-sm text-surface text-left"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </>
  );
}