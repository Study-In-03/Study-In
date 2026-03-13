import ProfileEditForm from '../features/profile/components/ProfileEditForm'
import MyPageSidebar from '@/components/common/MyPageSidebar'

const ProfileEdit = () => {
  return (
    <div className="flex gap-8 px-4 md:px-0 py-6">
      <MyPageSidebar />
      <div className="flex-1 min-w-0">
        <ProfileEditForm />
      </div>
    </div>
  )
}

export default ProfileEdit