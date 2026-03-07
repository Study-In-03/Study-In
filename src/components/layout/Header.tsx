import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getNotifications } from '@/api/notification';
import MobileDrawer from '@/components/layout/MobileDrawer';
import logoSrc from '@/assets/base/icon-Logo.svg';
import searchIcon from '@/assets/base/icon-Search.svg';
import chattingIcon from '@/assets/base/icon-chatting.svg';
import notificationIcon from '@/assets/base/icon-Notification.svg';
import personIcon from '@/assets/base/icon-person.svg';
import HamburgerIcon from '@/assets/base/icon-hamburger.svg?react';

interface HeaderProps {
  variant?: 'default' | 'auth';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const { isLoggedIn } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

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
      <header className="h-14 lg:h-20 bg-background border-b border-gray-300">

        {/* ── 모바일 헤더 ── */}
        <div className="flex lg:hidden items-center justify-between h-full px-4">
          <button onClick={() => setDrawerOpen(true)}>
            <HamburgerIcon className="w-7 h-7 text-surface" />
          </button>
          <Link to="/">
            <img src={logoSrc} alt="Studyin" className="h-5" />
          </Link>
          <button onClick={() => navigate(isLoggedIn ? '/chat' : '/login')} className="relative">
            <img src={chattingIcon} alt="채팅" className="w-[30px] h-[30px]" />
            {isLoggedIn && unreadCount > 0 && (
              <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
            )}
          </button>
        </div>

        {/* ── 데스크탑 헤더 ── */}
        <div className="hidden lg:flex items-center h-full w-full max-w-[990px] mx-auto px-4 gap-6">

          <Link to="/" className="shrink-0">
            <img src={logoSrc} alt="Studyin" className="h-5" />
          </Link>

          <nav className="flex shrink-0 h-full">
            <button className="relative flex items-center px-3 text-base font-medium text-gray-900">
              내 지역
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-1 bg-primary" />
            </button>
            <button className="flex items-center px-3 text-base font-medium text-gray-500">
              온라인
            </button>
          </nav>

          <div className="flex items-center flex-1 gap-2 px-4 py-2 border border-gray-300 rounded-full min-w-0">
            <input
              type="text"
              placeholder="어떤 스터디를 찾고 계신가요?"
              className="flex-1 text-base outline-none text-gray-900 placeholder:text-gray-500 bg-transparent min-w-0"
            />
            <img src={searchIcon} alt="검색" className="w-5 h-5 shrink-0" />
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => navigate('/chat')}>
                <img src={chattingIcon} alt="채팅" className="w-6 h-6" />
              </button>
              <button className="relative" onClick={() => navigate('/notification')}>
                <img src={notificationIcon} alt="알림" className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
                )}
              </button>
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden"
                onClick={() => navigate('/profile')}
              >
                <img src={personIcon} alt="프로필" className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              className="shrink-0 px-4 py-2 bg-primary text-background text-base font-medium rounded-lg"
              onClick={() => navigate('/login')}
            >
              시작하기
            </button>
          )}
        </div>
      </header>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}