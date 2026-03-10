import { NavLink } from 'react-router-dom'
import PersonIcon from '@/assets/base/icon-person.svg?react'
import NotificationIcon from '@/assets/base/icon-Notification.svg?react'
import PeopleIcon from '@/assets/base/icon-people.svg?react'

const MyPageSidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-44 shrink-0">
      <h2 className="text-base font-bold text-gray-900 px-3 mb-3">마이페이지</h2>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-primary text-background' : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <PersonIcon className="w-4 h-4" />
        프로필
      </NavLink>
      <NavLink
        to="/my-study"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-primary text-background' : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <PeopleIcon className="w-4 h-4" />
        스터디
      </NavLink>
      <NavLink
        to="/notification"
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-primary text-background' : 'text-gray-700 hover:bg-gray-100'
          }`
        }
      >
        <NotificationIcon className="w-4 h-4" />
        알림
      </NavLink>
    </aside>
  )
}

export default MyPageSidebar