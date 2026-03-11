import ActivityTabs from '@/features/profile/components/ActivityTabs'
import MyPageSidebar from '@/components/common/MyPageSidebar'

const MyStudy = () => {
  return (
    <div className="flex gap-[30px] py-6">
      <MyPageSidebar />
      <div className="flex-1 min-w-0">
        <ActivityTabs />
      </div>
    </div>
  )
}

export default MyStudy