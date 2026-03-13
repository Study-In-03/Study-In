import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LeftIcon from '@/assets/base/icon-left.svg?react'
import RightIcon from '@/assets/base/icon-right.svg?react'
import { useMyStudies, type TabKey } from '../hooks/useMyStudies'
import { useAssociateGuard } from '@/hooks/useAssociateGuard'
import StudyCard from '@/features/study/components/StudyCard'

const PAGE_SIZE = 10

const TABS: { key: TabKey; label: string }[] = [
  { key: 'my',     label: '내가 만든 스터디' },
  { key: 'joined', label: '참여 중 스터디' },
  { key: 'ended',  label: '종료된 스터디' },
  { key: 'liked',  label: '관심 스터디' },
]

const EMPTY_MESSAGES: Record<TabKey, string> = {
  my:     '아직 만든 스터디가 없어요',
  joined: '아직 참여 중인 스터디가 없어요',
  ended:  '아직 종료된 스터디가 없어요',
  liked:  '아직 관심 스터디가 없어요',
}

const ActivityTabs = () => {
  const navigate = useNavigate()
  const { withAssociateGuard } = useAssociateGuard()
  const [activeTab, setActiveTab] = useState<TabKey>('my')
  const [currentPage, setCurrentPage] = useState(1)

  const { studies, isLoading, error } = useMyStudies(activeTab)

  const totalPages = Math.ceil(studies.length / PAGE_SIZE)
  const pagedStudies = studies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    setCurrentPage(1)
  }, [studies])

  const handleTab = (tab: TabKey) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const displayPages = Math.max(1, totalPages)

  return (
    <div className="px-4 py-3 md:px-[55px] md:py-[30px] md:bg-background md:border md:border-gray-300 md:rounded-xl flex flex-col justify-between gap-[30px] md:gap-[40px] min-h-[400px] md:min-h-[844px]">

      <div className="flex flex-col gap-[30px] md:items-center">
        {/* 탭 버튼 - 모바일: 2x2 그리드 / 웹: 가로 pill */}
        <div className="md:hidden border border-gray-300 rounded-xl overflow-hidden grid grid-cols-2">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTab(key)}
              className={`py-3 text-base font-medium border-gray-300 ${
                key === 'my' ? 'border-b border-r' :
                key === 'joined' ? 'border-b' :
                key === 'ended' ? 'border-r' : ''
              } ${
                activeTab === key ? 'bg-primary text-background' : 'bg-background text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-[14px]">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTab(key)}
              className={`h-[44px] px-4 rounded-[44px] text-base transition-colors ${
                activeTab === key
                  ? 'bg-primary text-background font-bold'
                  : 'bg-gray-100 text-gray-700 font-normal'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center py-16 text-gray-500 text-sm">
            불러오는 중...
          </div>
        )}

        {!isLoading && error && (
          <div className="flex justify-center py-16 text-error text-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && studies.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[10px] md:gap-5 w-full">
            {pagedStudies.map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>
        )}
      </div>

      {!isLoading && !error && studies.length === 0 && (
        <div className="flex flex-col items-center gap-5">
          <p className="text-lg font-bold text-gray-700">{EMPTY_MESSAGES[activeTab]}</p>
          {activeTab === 'my' && (
            <button
              onClick={() => withAssociateGuard(() => navigate('/study/create'))}
              className="w-[250px] h-[50px] bg-primary text-background rounded-lg text-base font-medium"
            >
              스터디 만들기
            </button>
          )}
        </div>
      )}

      {/* 페이지네이션 - 항상 표시 */}
      {!isLoading && !error && (
        <div className="flex justify-center items-center gap-[10px] py-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={currentPage === 1 ? 'text-gray-300' : 'text-gray-500'}
          >
            <LeftIcon className="w-5 h-5" />
          </button>
          <div className="flex gap-[10px]">
            {Array.from({ length: displayPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-[11px] py-[5px] rounded-[30px] text-sm ${
                  currentPage === page ? 'bg-primary-light text-background font-bold' : 'text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(displayPages, p + 1))}
            disabled={currentPage === displayPages}
            className={currentPage === displayPages ? 'text-gray-300' : 'text-gray-700'}
          >
            <RightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  )
}

export default ActivityTabs
