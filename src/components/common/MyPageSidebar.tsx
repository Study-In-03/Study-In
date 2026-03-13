import { NavLink } from 'react-router-dom'
import PersonIcon from '@/assets/base/icon-person.svg?react'
import NotificationIcon from '@/assets/base/icon-Notification.svg?react'
import PeopleIcon from '@/assets/base/icon-people.svg?react'

const MyPageSidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-[170px] shrink-0">
      <h2 className="text-2xl font-bold text-surface mb-5">마이페이지</h2>
      <div className="flex flex-col gap-[10px]">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-[6px] pl-[10px] h-[30px] rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-primary text-background' : 'text-surface hover:bg-gray-100'
            }`
          }
        >
          <PersonIcon className="w-4 h-4 shrink-0" />
          내 프로필
        </NavLink>
        <NavLink
          to="/my-study"
          className={({ isActive }) =>
            `flex items-center gap-[6px] pl-[10px] h-[30px] rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-primary text-background' : 'text-surface hover:bg-gray-100'
            }`
          }
        >
          <PeopleIcon className="w-4 h-4 shrink-0" />
          스터디
        </NavLink>
        <NavLink
          to="/notification"
          className={({ isActive }) =>
            `flex items-center gap-[6px] pl-[10px] h-[30px] rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-primary text-background' : 'text-surface hover:bg-gray-100'
            }`
          }
        >
          <NotificationIcon className="w-4 h-4 shrink-0" />
          알림
        </NavLink>
      </div>
    </aside>
  )
}

export default MyPageSidebar