import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeartIcon from '@/assets/base/icon-heart.svg?react'
import HeartFillIcon from '@/assets/base/icon-heart-fill.svg?react'
import PeopleIcon from '@/assets/base/icon-people.svg?react'
import LeftIcon from '@/assets/base/icon-left.svg?react'
import RightIcon from '@/assets/base/icon-right.svg?react'
import iconRecruiting from '@/assets/base/icon-모집중.svg'
import defaultThumbnail from '@/assets/base/User-Profile-L.svg'
import { getProfile } from '@/api/profile'
import { storage } from '@/utils/storage'
import { useMyStudies } from '../hooks/useMyStudies'
import { useAssociateGuard } from '@/hooks/useAssociateGuard'

const PAGE_SIZE = 10

const ActivityTabs = () => {
  const navigate = useNavigate()
  const { withAssociateGuard } = useAssociateGuard()
  const [activeTab, setActiveTab] = useState<'my' | 'joined' | 'ended' | 'liked'>('my')
  const [likedStudies, setLikedStudies] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [locationName, setLocationName] = useState<string>('-')

  const endpoint =
    activeTab === 'ended'
      ? '/study/my-closed-study/'
      : activeTab === 'my'
        ? '/study/my-study/'
        : activeTab === 'joined'
          ? '/study/my-participating-study/'
          : null

  const { studies, isLoading, error } = useMyStudies(
    activeTab === 'liked' ? null : endpoint,
  )

  const totalPages = Math.ceil(studies.length / PAGE_SIZE)
  const pagedStudies = studies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    const userId = storage.getUserId()
    if (!userId) return
    getProfile(userId).then((profile) => {
      setLocationName(profile.preferred_region?.location ?? '-')
    })
  }, [])

  useEffect(() => {
    setLikedStudies(studies.filter((s) => s.is_liked).map((s) => s.id))
    setCurrentPage(1)
  }, [studies])

  const toggleLike = (id: number) => {
    setLikedStudies((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleTab = (tab: 'my' | 'joined' | 'ended' | 'liked') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const labels = {
    my: '내가 만든 스터디',
    joined: '참여 중 스터디',
    ended: '종료된 스터디',
    liked: '관심 스터디',
  }

  return (
    <div className="px-4 py-3">

      <div className="border border-gray-300 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {(['my', 'joined', 'ended', 'liked'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-background'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {labels[tab]}
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

        {!isLoading && !error && activeTab === 'liked' && (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-500">
            <p className="text-base">관심 스터디 기능은 준비 중이에요!</p>
          </div>
        )}

        {!isLoading && !error && activeTab !== 'liked' && (
          studies.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-gray-500">
              <p className="text-base">아직 스터디가 없어요!</p>
              <p className="text-sm">스터디를 만들거나 참여해보세요</p>
              {activeTab === 'my' && (
                <button
                  onClick={() => withAssociateGuard(() => navigate('/study/create'))}
                  className="mt-2 px-6 py-2 bg-primary text-background rounded-lg text-base font-medium"
                >
                  스터디 만들기
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pagedStudies.map((study) => (
                  <div
                    key={study.id}
                    onClick={() => navigate(`/study/${study.id}`)}
                    className="flex flex-col bg-background rounded-[24px] border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <img src={iconRecruiting} alt="모집중" className="w-20 h-7" />
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {locationName}
                      </span>
                    </div>
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {study.thumbnail ? (
                        <img
                          src={study.thumbnail}
                          alt={study.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={defaultThumbnail}
                          className="w-32 h-32 object-contain opacity-40 group-hover:scale-110 transition-transform"
                          alt="기본 썸네일"
                        />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLike(study.id)
                        }}
                        className="absolute bottom-4 right-4 w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                      >
                        {likedStudies.includes(study.id) ? (
                          <HeartFillIcon className="w-5 h-5 text-error" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-error" />
                        )}
                      </button>
                    </div>
                    <div className="p-4 flex flex-col flex-1 border-t border-gray-100">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {study.subject && (
                          <span className="px-2 py-0.5 border border-gray-300 text-gray-500 text-xs rounded-full">
                            {study.subject.name}
                          </span>
                        )}
                        {study.difficulty && (
                          <span className="px-2 py-0.5 border border-gray-300 text-gray-500 text-xs rounded-full">
                            {study.difficulty.name}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
                        {study.title}
                      </h3>
                      <div className="mt-auto flex items-center gap-1">
                        <PeopleIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          현재 <span className="text-primary font-bold">{study.current_participants ?? 0}명</span>이 신청했어요.
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center gap-4 py-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? 'text-gray-300' : 'text-gray-500'}
                >
                  <LeftIcon className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm ${
                      currentPage === page
                        ? 'bg-primary text-background'
                        : 'text-gray-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'text-gray-300' : 'text-gray-500'}
                >
                  <RightIcon className="w-4 h-4" />
                </button>
              </div>
            </>
          )
        )}

      </div>
    </div>
  )
}

export default ActivityTabs