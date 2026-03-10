import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getNotifications, deleteNotification } from '@/api/notification';
import type { Notification } from '@/api/notification';
import { storage } from '@/utils/storage';
import { useAssociateGuard } from '@/hooks/useAssociateGuard';
import useOutsideClick from '@/hooks/useOutsideClick';
import useProfileImage from '@/hooks/useProfileImage';
import MobileDrawer from '@/components/layout/MobileDrawer';
import LogoIcon from '@/assets/base/icon-Logo.svg?react';
import SearchIcon from '@/assets/base/icon-Search.svg?react';
import ChattingIcon from '@/assets/base/icon-chatting.svg?react';
import NotificationIcon from '@/assets/base/icon-Notification.svg?react';
import HamburgerIcon from '@/assets/base/icon-hamburger.svg?react';

function loadSearchHistory(): string[] {
  try {
    const stored = localStorage.getItem('searchHistory');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function formatNotifTime(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function getSearchBase(pathname: string): string {
  if (pathname === '/local' || pathname.startsWith('/local/')) return '/local/search';
  if (pathname === '/online' || pathname.startsWith('/online/')) return '/online/search';
  return '/search';
}


function UnreadBadge() {
  return <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />;
}

interface NavItemProps {
  to: string;
  label: string;
}

function NavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center text-lg transition-colors text-surface ${isActive ? 'font-bold' : 'font-regular'}`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60px] h-[4px] bg-primary" />}
        </>
      )}
    </NavLink>
  );
}

interface HeaderProps {
  variant?: 'auth';
}

export default function Header({ variant }: HeaderProps) {
  const { isLoggedIn, logout } = useAuthStore();
  const { withAssociateGuard } = useAssociateGuard();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const profileImg = useProfileImage(isLoggedIn);
  const unreadCount = notifications.filter((n) => !n.checked).length;
  const [searchHistory, setSearchHistory] = useState<string[]>(loadSearchHistory);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchEditing, setSearchEditing] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const urlQuery = searchParams.get('q') ?? '';
  const displayValue = searchEditing ? searchValue : urlQuery;

  useOutsideClick(searchRef, searchFocused, () => setSearchFocused(false));
  useOutsideClick(dropdownRef, dropdownOpen, () => setDropdownOpen(false));
  useOutsideClick(notificationRef, notificationOpen, () => setNotificationOpen(false));

  useEffect(() => {
    if (!isLoggedIn) return;
    getNotifications()
      .then((data) => setNotifications(data.results))
      .catch(() => {});
  }, [isLoggedIn]);

  const handleDeleteNotification = async (id: number): Promise<void> => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.notification_id !== id));
  };


  const saveSearch = (q: string): void => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [trimmed, ...searchHistory.filter((h) => h !== trimmed)].slice(0, 5);
    setSearchHistory(next);
    localStorage.setItem('searchHistory', JSON.stringify(next));
  };

  const doSearch = (): void => {
    const trimmed = displayValue.trim();
    saveSearch(trimmed);
    setSearchFocused(false);
    const base = getSearchBase(location.pathname);
    navigate(trimmed ? `${base}?q=${encodeURIComponent(trimmed)}` : base);
  };

  const handleSearchFocus = (): void => {
    setSearchFocused(true);
    setSearchEditing(true);
    setSearchValue(urlQuery);
  };

  const handleHistorySelect = (item: string): void => {
    setSearchEditing(false);
    setSearchFocused(false);
    navigate(`${getSearchBase(location.pathname)}?q=${encodeURIComponent(item)}`);
  };

  const handleLogout = (): void => {
    setDropdownOpen(false);
    logout();
    storage.clearAuth();
    navigate('/');
  };

  if (variant === 'auth') {
    return (
      <>
        <header className="bg-background border-b border-gray-300">

          <div className="flex lg:hidden items-center justify-between h-14 px-4">
            <button onClick={() => setDrawerOpen(true)}>
              <HamburgerIcon className="w-7 h-7 text-surface" />
            </button>
            <LogoIcon className="h-5 w-auto" />
            <button onClick={() => navigate('/chat')} className="relative">
              <ChattingIcon className="w-[30px] h-[30px] text-surface" />
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-center h-[80px]">
            <Link to="/"><LogoIcon className="h-[32px] w-auto" /></Link>
          </div>
        </header>

        <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </>
    );
  }

  return (
    <>
      <header className="bg-background border-b border-gray-300">

        <div className="flex md:hidden items-center justify-between h-14 px-4">
          <button onClick={() => setDrawerOpen(true)} aria-label="메뉴 열기">
            <HamburgerIcon className="w-7 h-7 text-surface" />
          </button>
          <Link to="/" className="flex items-center">
            <LogoIcon className="h-[22px] w-auto" />
          </Link>
          <button onClick={() => navigate('/chat')} className="relative" aria-label="채팅 확인">
            <ChattingIcon className="w-[30px] h-[30px] text-surface" />
          </button>
        </div>

        <div className="hidden md:flex items-center h-[80px]">
          <div className="flex items-center w-full max-w-[1190px] mx-auto h-full">

            <Link to="/" className="shrink-0 flex items-center">
              <LogoIcon className="h-[32px] w-auto text-surface" />
            </Link>

            <nav className="flex self-stretch items-stretch shrink-0 ml-[40px] gap-[30px]">
              <NavItem to="/local" label="내 지역" />
              <NavItem to="/online" label="온라인" />
            </nav>

            <div className="flex-1" />

            {/* 검색 */}
            <div className="relative shrink-0" ref={searchRef}>
              <div className="flex items-center w-[400px] h-[44px] px-5 border-2 border-gray-300 rounded-full">
                <input
                  type="text"
                  value={displayValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchEditing(true);
                    setSearchValue(e.target.value);
                  }}
                  placeholder="어떤 스터디를 찾고 계신가요?"
                  className="flex-1 text-base font-medium outline-none text-surface placeholder:text-gray-500 bg-transparent min-w-0"
                  onFocus={handleSearchFocus}
                  onClick={handleSearchFocus}
                  onBlur={() => setSearchEditing(false)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && doSearch()}
                />
                <button onClick={doSearch}>
                  <SearchIcon className="w-7 h-7 text-gray-700 shrink-0" />
                </button>
              </div>

              {searchFocused && searchHistory.length > 0 && (
                <div className="absolute left-0 top-[calc(100%+4px)] w-[400px] bg-background rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.10)] border border-gray-300 z-50 overflow-hidden py-1">
                  {searchHistory.map((item) => (
                    <button
                      key={item}
                      onMouseDown={(e: React.MouseEvent) => { e.preventDefault(); handleHistorySelect(item); }}
                      className="w-full h-[40px] flex items-center px-2 group"
                    >
                      <span className="w-full h-[30px] flex items-center px-[10px] text-surface text-base rounded-[8px] group-hover:bg-gray-100">
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 아이콘 */}
            <div className="flex items-center ml-[32px] gap-[20px] shrink-0">
              <button onClick={() => navigate('/chat')} aria-label="채팅 페이지 이동">
                <ChattingIcon className="w-[30px] h-[30px] text-surface" />
              </button>
              <div className="relative" ref={notificationRef}>
                <button
                  className="relative"
                  onClick={() => isLoggedIn ? setNotificationOpen((prev) => !prev) : navigate('/login')}
                  aria-label="알림 페이지 이동"
                >
                  <NotificationIcon className="w-[30px] h-[30px] text-surface" />
                  {isLoggedIn && unreadCount > 0 && <UnreadBadge />}
                </button>

                {isLoggedIn && notificationOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-[358px] bg-background rounded-[12px] shadow-[0px_5px_15px_rgba(71,73,77,0.10)] border border-gray-300 z-50">
                    <div className="px-5 pt-5 pb-3">
                      <span className="text-base font-bold text-surface">확인하지 않은 알림 </span>
                      <span className="text-base font-bold text-primary">{unreadCount}개</span>
                    </div>
                    <div className="px-5 flex flex-col gap-2">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">알림이 없습니다.</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div key={n.notification_id} className="relative">
                            {!n.checked && (
                              <span className="absolute top-0 left-0 w-2 h-2 bg-error rounded-full z-10" />
                            )}
                            <div className={`w-full p-[10px] rounded-[8px] pr-8 ${n.checked ? 'bg-gray-100' : 'bg-background border border-gray-300'}`}>
                              <p className={`text-sm leading-5 ${n.checked ? 'text-gray-700' : 'text-surface'}`}>{n.content}</p>
                              <p className={`text-xs mt-1 ${n.checked ? 'text-gray-500' : 'text-primary'}`}>{formatNotifTime(n.created)}</p>
                            </div>
                            <button
                              onClick={() => handleDeleteNotification(n.notification_id)}
                              className="absolute top-[10px] right-[10px] w-[18px] h-[18px] bg-gray-300 rounded-full flex items-center justify-center"
                            >
                              <span className="text-background text-xs leading-none">×</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-5 py-4 text-center">
                      <button
                        onClick={() => { setNotificationOpen(false); navigate('/notification'); }}
                        className="text-xs text-gray-500 underline"
                      >
                        알림 더보기
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 프로필 + 드롭다운 */}
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  className={`w-[44px] h-[44px] rounded-full border-2 overflow-hidden block ${dropdownOpen ? 'border-primary' : 'border-gray-300'}`}
                  onClick={() => isLoggedIn ? setDropdownOpen((prev) => !prev) : navigate('/login')}
                >
                  {isLoggedIn && profileImg ? (
                    <img src={profileImg} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100" />
                  )}
                </button>

                {isLoggedIn && dropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] w-[130px] bg-background rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.10)] border border-gray-300 z-50 overflow-hidden py-1">
                    <button
                      onClick={() => { setDropdownOpen(false); withAssociateGuard(() => navigate('/study/create')); }}
                      className="w-full h-[40px] flex items-center px-2"
                    >
                      <span className="w-full h-[30px] flex items-center px-[10px] bg-primary text-background text-base rounded-[8px]">
                        스터디 만들기
                      </span>
                    </button>
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                      className="w-full h-[40px] flex items-center px-2 group"
                    >
                      <span className="w-full h-[30px] flex items-center px-[10px] text-surface text-base rounded-[8px] group-hover:bg-gray-100">
                        마이페이지
                      </span>
                    </button>
                    <button
                      onClick={handleLogout}
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
