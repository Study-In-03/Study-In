import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
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
  const navigate = useNavigate();

  if (variant === 'auth') {
    return (
      <header className="h-14 lg:h-20 bg-background border-b border-gray-300">
        <div className="flex items-center justify-center h-full">
          <Link to="/">
            <img src={logoSrc} alt="Studyin" className="h-5" />
          </Link>
        </div>
      </header>
    );
  }

  // 로그아웃 상태이면서 현재 페이지가 채팅(/chat) 페이지인 경우
  const isChatPage = location.pathname === '/chat';
  const shouldHideChatIconOnMobile = !isLoggedIn && isChatPage;

  return (
    <>
      <header className="h-14 lg:h-20 bg-background border-b border-gray-300">

        {/* ── 모바일 헤더 ── */}
        <div className="flex lg:hidden items-center justify-between h-full px-4">
          <button onClick={() => setDrawerOpen(true)}>
            <HamburgerIcon 
              className="w-6 h-6 text-surface hover:text-primary-light transition-colors" 
            />
          </button>
          <Link to="/">
            <img src={logoSrc} alt="Studyin" className="h-5" />
          </Link>
          {/* 로그인: 채팅 아이콘 / 비로그인: 프로필(로그인 유도) 아이콘 */}
          <div className="w-[30px] h-[30px]">
            {/* 조건부 렌더링: 로그아웃 + 채팅페이지가 아닐 때만 아이콘 표시 */}
            {!shouldHideChatIconOnMobile && (
              isLoggedIn ? (
                <button onClick={() => navigate('/chat')}>
                  <img src={chattingIcon} alt="채팅" className="w-6 h-6" />
                </button>
              ) : (
                <button onClick={() => navigate('/login')}>
                  <img src={personIcon} alt="로그인" className="w-6 h-6" />
                </button>
              )
            )}
          </div>
        </div>

        {/* ── 데스크탑 헤더 (lg 이상) ── */}
        <div className="hidden lg:flex items-center h-full w-full max-w-[1190px] mx-auto px-4 gap-6">

          <Link to="/" className="shrink-0">
            <img src={logoSrc} alt="Studyin" className="h-5" />
          </Link>

          <nav className="flex shrink-0 h-full">
            <button className="relative flex items-center px-3 text-base font-medium text-gray-900">
              내 지역
            </button>
            <button
              onClick={() => setActiveTab("online")}
              className={`text-[18px] transition-colors ${
                activeTab === "online"
                  ? "font-bold text-black"
                  : "font-medium text-gray-400"
              }`}
            >
              온라인
            </button>

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
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full" />
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

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}