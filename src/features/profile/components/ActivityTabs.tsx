import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeartIcon from '@/assets/base/icon-heart.svg?react'
import HeartFillIcon from '@/assets/base/icon-heart-fill.svg?react'
import PeopleIcon from '@/assets/base/icon-people.svg?react'
import RecruitIcon from '@/assets/base/icon-모집중.svg?react'
import LeftIcon from '@/assets/base/icon-left.svg?react'
import RightIcon from '@/assets/base/icon-right.svg?react'
import { likeStudy, unlikeStudy } from '@/api/study'
import { useMyStudies } from '../hooks/useMyStudies'
import { useAssociateGuard } from '@/hooks/useAssociateGuard'

const PAGE_SIZE = 10

interface ActivityTabsProps {
  // ProfileCard와 getProfile()을 공유하기 위해 부모에서 prop으로 받음
  // 부모(Profile 페이지)에서 한 번만 fetch → 중복 API 호출 제거
  locationName?: string
}

const ActivityTabs = ({ locationName = '-' }: ActivityTabsProps) => {
  const navigate = useNavigate()
  const { withAssociateGuard } = useAssociateGuard()
  const [activeTab, setActiveTab] = useState<'my' | 'joined' | 'ended' | 'liked'>('my')
  const [likedStudies, setLikedStudies] = useState<number[]>([])
  const [likeLoadingIds, setLikeLoadingIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const endpoint =
    activeTab === 'ended'
      ? '/study/my-closed-study/'
      : activeTab === 'my'
        ? '/study/my-study/'
        : activeTab === 'joined'
          ? '/study/my-participating-study/'
          : '/study/my-like-study/'

  const { studies, isLoading, error } = useMyStudies(endpoint)

  const totalPages = Math.ceil(studies.length / PAGE_SIZE)
  const pagedStudies = studies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    setLikedStudies(studies.filter((s) => s.is_liked).map((s) => s.id))
    setCurrentPage(1)
  }, [studies])

  const toggleLike = async (id: number) => {
    if (likeLoadingIds.includes(id)) return
    setLikeLoadingIds((prev) => [...prev, id])
    const isLiked = likedStudies.includes(id)
    try {
      if (isLiked) {
        await unlikeStudy(id)
        setLikedStudies((prev) => prev.filter((i) => i !== id))
      } else {
        await likeStudy(id)
        setLikedStudies((prev) => [...prev, id])
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setLikedStudies((prev) =>
          isLiked ? prev.filter((i) => i !== id) : [...prev, id],
        )
      }
    } finally {
      setLikeLoadingIds((prev) => prev.filter((i) => i !== id))
    }
  }

  const handleTab = (tab: 'my' | 'joined' | 'ended' | 'liked') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col">

      <div className="px-4 py-3">
        <div className="border border-gray-300 rounded-xl overflow-hidden grid grid-cols-2">
          <button
            onClick={() => handleTab('my')}
            className={`py-3 text-base font-medium border-b border-r border-gray-300 ${
              activeTab === 'my' ? 'bg-primary text-background' : 'bg-background text-gray-500'
            }`}
          >
            내가 만든 스터디
          </button>
          <button
            onClick={() => handleTab('joined')}
            className={`py-3 text-base font-medium border-b border-gray-300 ${
              activeTab === 'joined' ? 'bg-primary text-background' : 'bg-background text-gray-500'
            }`}
          >
            참여 중 스터디
          </button>
          <button
            onClick={() => handleTab('ended')}
            className={`py-3 text-base font-medium border-r border-gray-300 ${
              activeTab === 'ended' ? 'bg-primary text-background' : 'bg-background text-gray-500'
            }`}
          >
            종료된 스터디
          </button>
          <button
            onClick={() => handleTab('liked')}
            className={`py-3 text-base font-medium ${
              activeTab === 'liked' ? 'bg-primary text-background' : 'bg-background text-gray-500'
            }`}
          >
            관심 스터디
          </button>
        </div>
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

      {!isLoading && !error && (
        studies.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-500">
            <p className="text-base">아직 스터디가 없어요!</p>
            <p className="text-sm">
              {activeTab === 'liked'
                ? '관심 있는 스터디에 좋아요를 눌러보세요'
                : '스터디를 만들거나 참여해보세요'}
            </p>
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
            <div className="grid grid-cols-2 gap-5 px-2 pb-3">
              {pagedStudies.map((study) => (
                <div
                  key={study.id}
                  className="bg-background rounded-2xl shadow-md border border-gray-300 flex flex-col cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/study/${study.id}`)}
                >
                  <div className="flex justify-between items-center px-2 pt-2 pb-1">
                    <RecruitIcon className="w-16 h-6" />
                    <span className="text-xs text-gray-900 bg-gray-100 rounded-full px-2 py-0.5">
                      {locationName}
                    </span>
                  </div>
                  <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                    {study.thumbnail ? (
                      <img
                        src={study.thumbnail}
                        alt={study.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(study.id)
                      }}
                      disabled={likeLoadingIds.includes(study.id)}
                      className="absolute bottom-2 right-2 w-9 h-9 bg-background rounded-full flex items-center justify-center shadow-md"
                    >
                      {likedStudies.includes(study.id) ? (
                        <HeartFillIcon className="w-5 h-5 text-error" />
                      ) : (
                        <HeartIcon className="w-5 h-5 text-error" />
                      )}
                    </button>
                  </div>

                  <div className="px-2 py-4 flex flex-col gap-2">
                    <div className="flex gap-1 flex-wrap">
                      {study.subject && (
                        <span className="text-xs border border-gray-300 rounded-full px-2 py-0.5 text-gray-500">
                          {study.subject.name}
                        </span>
                      )}
                      {study.difficulty && (
                        <span className="text-xs border border-gray-300 rounded-full px-2 py-0.5 text-gray-500">
                          {study.difficulty.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{study.title}</p>
                    <div className="flex items-center gap-1">
                      <PeopleIcon className="w-3 h-3 text-gray-300" />
                      <p className="text-xs text-gray-300">
                        현재 <span className="text-primary font-medium">{study.current_participants ?? 0}명</span>이 신청했어요.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-4 py-4">
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
  )
}

export default ActivityTabs