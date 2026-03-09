import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getNotifications } from "@/api/notification";
import { getProfile } from "@/api/profile";
import { storage } from "@/utils/storage";
import MobileDrawer from "@/components/layout/MobileDrawer";
import { useAssociateGuard } from "@/hooks/useAssociateGuard";

import logoSrc from "@/assets/base/icon-Logo.svg";
import searchIcon from "@/assets/base/icon-Search.svg";
import chattingIcon from "@/assets/base/icon-chatting.svg";
import notificationIcon from "@/assets/base/icon-Notification.svg";
import HamburgerIcon from "@/assets/base/icon-hamburger.svg?react";
import MoreIcon from "@/assets/base/icon-000.svg?react";

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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

  /* 프로필 */
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchProfile = async () => {
      try {
        const userId = storage.getUserId();
        if (!userId) return;

        const profile = await getProfile(userId);
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

        setProfileImg(baseUrl + profile.profile_img);
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

            <Link to="/">
              <img src={logoSrc} alt="Studyin" className="h-5" />
            </Link>

            <button
              onClick={() => navigate(isLoggedIn ? "/chat" : "/login")}
              className="relative"
            >
              <img
                src={chattingIcon}
                alt="채팅"
                className="w-[30px] h-[30px]"
              />

              {isLoggedIn && unreadCount > 0 && (
                <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
              )}
            </button>
          </div>

          {/* 데스크탑 */}
          <div className="hidden lg:flex items-center justify-center h-[80px]">
            <Link to="/">
              <img src={logoSrc} alt="Studyin" className="h-[32px]" />
            </Link>
          </div>
        </header>

        <MobileDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <header className="bg-background border-b border-gray-300">

        {/* 모바일 */}
        <div className="flex lg:hidden items-center justify-between h-14 px-4">
          <button onClick={() => setDrawerOpen(true)}>
            <HamburgerIcon className="w-7 h-7 text-surface" />
          </button>

          <Link to="/">
            <img src={logoSrc} alt="Studyin" className="h-5" />
          </Link>

          <button
            onClick={() => navigate(isLoggedIn ? "/chat" : "/login")}
            className="relative"
          >
            <img
              src={chattingIcon}
              alt="채팅"
              className="w-[30px] h-[30px]"
            />

            {isLoggedIn && unreadCount > 0 && (
              <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
            )}
          </button>
        </div>

        {/* 데스크탑 */}
        <div className="hidden lg:flex items-center h-[80px]">
          <div className="flex items-center w-full max-w-[1190px] mx-auto">

            {/* 로고 */}
            <Link to="/" className="shrink-0">
              <img src={logoSrc} alt="Studyin" className="h-[32px]" />
            </Link>

            {/* 내지역 / 온라인 (NavLink 적용) */}
            <nav className="flex gap-8 ml-10">
              <NavLink
                to="/local"
                className={({ isActive }) =>
                  `text-lg font-bold transition-colors ${
                    isActive
                      ? "text-surface border-b-2 border-primary pb-1"
                      : "text-surface/70"
                  }`
                }
              >
                내 지역
              </NavLink>

              <NavLink
                to="/online"
                className={({ isActive }) =>
                  `text-lg font-bold transition-colors ${
                    isActive
                      ? "text-surface border-b-2 border-primary pb-1"
                      : "text-surface/70"
                  }`
                }
              >
                온라인
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
              <img src={searchIcon} alt="검색" className="w-7 h-7 shrink-0" />
            </div>

            {/* 아이콘 */}
            <div className="flex items-center ml-[32px] gap-[20px] shrink-0">
              <button
                onClick={() => navigate(isLoggedIn ? "/chat" : "/login")}
              >
                <img
                  src={chattingIcon}
                  alt="채팅"
                  className="w-[30px] h-[30px]"
                />
              </button>

              <button
                className="relative"
                onClick={() =>
                  navigate(isLoggedIn ? "/notification" : "/login")
                }
              >
                <img
                  src={notificationIcon}
                  alt="알림"
                  className="w-[30px] h-[30px]"
                />

                {isLoggedIn && unreadCount > 0 && (
                  <span className="absolute bottom-0.5 right-0 w-[10px] h-[10px] bg-error rounded-full" />
                )}
              </button>

              {/* 프로필 */}
              <button
                className="w-[44px] h-[44px] rounded-full border-2 border-gray-300 overflow-hidden shrink-0 block"
                onClick={() =>
                  navigate(isLoggedIn ? "/profile" : "/login")
                }
              >
                {isLoggedIn && profileImg ? (
                  <img
                    src={profileImg}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" />
                )}
              </button>

              {/* 더보기 */}
              {isLoggedIn && (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen((prev) => !prev)}>
                    <MoreIcon className="w-[30px] h-[30px] text-surface" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-[calc(100%+8px)] w-[130px] bg-background rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.10)] border border-[#D9DBE0] z-50 overflow-hidden py-1">

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          withAssociateGuard(() =>
                            navigate("/study/create")
                          );
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
                        className="w-full h-[40px] flex items-center px-2"
                      >
                        <span className="w-full h-[30px] flex items-center px-[10px] bg-[#F3F5FA] text-surface text-base rounded-[8px]">
                          마이페이지
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className="w-full h-[40px] flex items-center px-[18px] text-base text-surface"
                      >
                        로그아웃
                      </button>

                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}