import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getNotifications } from '@/api/notification';
import { getProfile } from '@/api/profile';
import { getFullUrl } from '@/api/upload';
import { storage } from '@/utils/storage';
import { useAssociateGuard } from '@/hooks/useAssociateGuard';
import MobileDrawer from '@/components/layout/MobileDrawer';
import LogoIcon from '@/assets/base/icon-Logo.svg?react';
import SearchIcon from '@/assets/base/icon-Search.svg?react';
import ChattingIcon from '@/assets/base/icon-chatting.svg?react';
import NotificationIcon from '@/assets/base/icon-Notification.svg?react';
import HamburgerIcon from '@/assets/base/icon-hamburger.svg?react';


interface HeaderProps {
  variant?: "default" | "auth";
}

export default function Header({ variant = "default" }: HeaderProps) {
  const { isLoggedIn, logout } = useAuthStore();
  const { withAssociateGuard } = useAssociateGuard();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /* dropdown outside click */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  /* unread 알림 */
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUnread = async () => {
      try {
        const data = await getNotifications();
        setUnreadCount(data.results.filter((n) => !n.checked).length);
      } catch {
        /* ignore */
      }
    };
    fetchUnread();
  }, [isLoggedIn]);

  /* 프로필 이미지 - getFullUrl로 통일 */
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchProfile = async () => {
      try {
        const userId = storage.getUserId();
        if (!userId) return;
        const profile = await getProfile(userId);
        setProfileImg(getFullUrl(profile.profile_img));
      } catch {
        /* ignore */
      }
    };
    fetchProfile();
  }, [isLoggedIn]);

  /* 로그인/회원가입 페이지용 헤더 */
  if (variant === "auth") {
    return (
      <>
        <header className="bg-background border-b border-gray-300">

          {/* 모바일 */}
          <div className="flex lg:hidden items-center justify-between h-14 px-4">
            <button onClick={() => setDrawerOpen(true)}>
              <HamburgerIcon className="w-7 h-7 text-surface" />
            </button>
            <LogoIcon className="h-5 w-auto" />
            <button onClick={() => navigate('/chat')} className="relative">
              <ChattingIcon className="w-[30px] h-[30px] text-surface" />
              {isLoggedIn && unreadCount > 0 && (
                <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
              )}
            </button>
          </div>

          {/* 데스크탑 */}
          <div className="hidden lg:flex items-center justify-center h-[80px]">
            <Link to="/">
              <LogoIcon className="h-[32px] w-auto" />
            </Link>
          </div>
        </header>

        <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </>
    );
  }

  return (
    <>
      <header className="bg-background border-b border-gray-300">

        {/* ── 모바일 헤더 ── */}
        <div className="flex md:hidden items-center justify-between h-14 px-4">
          <button onClick={() => setDrawerOpen(true)} aria-label="메뉴 열기">
            <HamburgerIcon className="w-7 h-7 text-surface" />
          </button>
          <Link to="/" className="flex items-center">
            <LogoIcon className="h-[22px] w-auto" />
          </Link>
          <button onClick={() => navigate('/chat')} className="relative" aria-label="채팅 확인">
            <ChattingIcon className="w-[30px] h-[30px] text-surface" />
            {isLoggedIn && unreadCount > 0 && (
              <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
            )}
          </button>
        </div>

        {/* ── 데스크탑 헤더 ── */}
        <div className="hidden md:flex items-center h-[80px]">
          <div className="flex items-center w-full max-w-[1190px] mx-auto h-full">

            <Link to="/" className="shrink-0 flex items-center">
              <LogoIcon className="h-[32px] w-auto text-surface" />
            </Link>

            <nav className="flex self-stretch items-stretch shrink-0 ml-[40px] gap-[30px]">
              <NavLink
                to="/local"
                className={({ isActive }) =>
                  `relative flex items-center text-lg transition-colors ${isActive ? 'font-bold text-surface' : 'font-regular text-surface'}`
                }
              >
                {({ isActive }) => (
                  <>
                    내 지역
                    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[4px] bg-primary" />}
                  </>
                )}
              </NavLink>
              <NavLink
                to="/online"
                className={({ isActive }) =>
                  `relative flex items-center text-lg transition-colors ${isActive ? 'font-bold text-surface' : 'font-regular text-surface'}`
                }
              >
                {({ isActive }) => (
                  <>
                    온라인
                    {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[4px] bg-primary" />}
                  </>
                )}
              </NavLink>
            </nav>

            <div className="flex-1" />

            {/* 검색 */}
            <div className="flex items-center w-[400px] h-[44px] px-5 border-2 border-gray-300 rounded-full shrink-0">
              <input
                type="text"
                placeholder="어떤 스터디를 찾고 계신가요?"
                className="flex-1 text-base font-medium outline-none text-surface placeholder:text-gray-500 bg-transparent min-w-0"
              />
              <SearchIcon className="w-7 h-7 text-gray-700 shrink-0" />
            </div>

            {/* 아이콘 */}
            <div className="flex items-center ml-[32px] gap-[20px] shrink-0">
              <button onClick={() => navigate('/chat')} aria-label="채팅 페이지 이동">
                <ChattingIcon className="w-[30px] h-[30px] text-surface" />
              </button>
              <button
                className="relative"
                onClick={() => navigate(isLoggedIn ? '/notification' : '/login')}
                aria-label="알림 페이지 이동"
              >
                <NotificationIcon className="w-[30px] h-[30px] text-surface" />
                {isLoggedIn && unreadCount > 0 && (
                  <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
                )}
              </button>

              {/* 프로필 + 드롭다운 */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  className={`w-[44px] h-[44px] rounded-full border-2 overflow-hidden block ${dropdownOpen ? 'border-primary' : 'border-gray-300'}`}
                  onClick={() => isLoggedIn ? setDropdownOpen((prev) => !prev) : navigate("/login")}
                >
                  {isLoggedIn && profileImg ? (
                    <img src={profileImg} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100" />
                  )}
                </button>

                {isLoggedIn && dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-[130px] bg-background rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.10)] border border-gray-300 z-50 overflow-hidden py-1">

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        withAssociateGuard(() => navigate("/study/create"));
                      }}
                      className="w-full h-[40px] flex items-center px-2"
                    >
                      <span className="w-full h-[30px] flex items-center px-[10px] bg-primary text-background text-base rounded-[8px]">
                        스터디 만들기
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full h-[40px] flex items-center px-2 group"
                    >
                      <span className="w-full h-[30px] flex items-center px-[10px] text-surface text-base rounded-[8px] group-hover:bg-gray-100">
                        마이페이지
                      </span>
                    </button>

                    {/* 로그아웃 */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        storage.clearAuth();
                        navigate("/");
                      }}
                      className="w-full h-[40px] flex items-center px-2 group"
                    >
                      <span className="w-full h-[30px] flex items-center px-[10px] text-surface text-base rounded-[8px] group-hover:bg-gray-100">
                        로그아웃
                      </span>
                    </button>

                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
