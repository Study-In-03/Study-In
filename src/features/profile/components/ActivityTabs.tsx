import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeartIcon from '@/assets/base/icon-heart.svg?react'
import HeartFillIcon from '@/assets/base/icon-heart-fill.svg?react'
import SpeakerIcon from '@/assets/base/icon-speaker-1.svg?react'
import PersonIcon from '@/assets/base/icon-person.svg?react'
import { useMyStudies } from '../hooks/useMyStudies'

const ActivityTabs = () => {
  const navigate = useNavigate()
  const [activeMainTab, setActiveMainTab] = useState<'my' | 'joined'>('my')
  const [activeSubTab, setActiveSubTab] = useState<'ended' | 'liked' | null>(null)
  const [likedStudies, setLikedStudies] = useState<number[]>([])

  const endpoint =
    activeSubTab === 'ended'
      ? '/study/my-closed-study/'
      : activeMainTab === 'my'
        ? '/study/my-study/'
        : '/study/my-participating-study/'

  const { studies, isLoading, error } = useMyStudies(
    activeSubTab === 'liked' ? null : endpoint,
  )

  useEffect(() => {
    setLikedStudies(studies.filter((s) => s.is_liked).map((s) => s.id))
  }, [studies])

  const toggleLike = (id: number) => {
    setLikedStudies((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleMainTab = (tab: 'my' | 'joined') => {
    setActiveMainTab(tab)
    setActiveSubTab(null)
  }

  const handleSubTab = (tab: 'ended' | 'liked') => {
    setActiveSubTab((prev) => (prev === tab ? null : tab))
  }

  return (
    <div className="flex flex-col gap-0">

      <div className="flex">
        <button
          onClick={() => handleMainTab('my')}
          className={`flex-1 py-3 text-base font-medium ${
            activeMainTab === 'my' && activeSubTab === null
              ? 'text-primary border-b-2 border-primary bg-activation'
              : 'text-gray-500 border-b border-gray-300'
          }`}
        >
          내가 만든 스터디
        </button>
        <button
          onClick={() => handleMainTab('joined')}
          className={`flex-1 py-3 text-base font-medium ${
            activeMainTab === 'joined' && activeSubTab === null
              ? 'text-primary border-b-2 border-primary bg-activation'
              : 'text-gray-500 border-b border-gray-300'
          }`}
        >
          참여 중인 스터디
        </button>
      </div>

      <div className="flex border-b border-gray-300">
        <button
          onClick={() => handleSubTab('ended')}
          className={`flex-1 py-2 text-sm ${
            activeSubTab === 'ended' ? 'text-primary font-medium' : 'text-gray-500'
          }`}
        >
          종료된 스터디
        </button>
        <button
          onClick={() => handleSubTab('liked')}
          className={`flex-1 py-2 text-sm ${
            activeSubTab === 'liked' ? 'text-primary font-medium' : 'text-gray-500'
          }`}
        >
          관심 스터디
        </button>
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

      {!isLoading && !error && activeSubTab === 'liked' && (
        <div className="flex flex-col items-center gap-2 py-16 text-gray-500">
          <p className="text-base">관심 스터디 기능은 준비 중이에요!</p>
        </div>
      )}

      {!isLoading && !error && activeSubTab !== 'liked' && (
        studies.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-gray-500">
            <p className="text-base">아직 스터디가 없어요!</p>
            <p className="text-sm">스터디를 만들거나 참여해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {studies.map((study) => (
              <div
                key={study.id}
                className="border border-gray-300 flex flex-col cursor-pointer"
                onClick={() => navigate(`/study/${study.id}`)}
              >
                <div className="flex justify-between items-center px-2 pt-2">
                  <div className="flex items-center gap-1">
                    <SpeakerIcon className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-medium">
                      {study.study_status?.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {study.is_offline ? '오프라인' : '온라인'}
                  </span>
                </div>

                <div className="w-full h-20 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {study.thumbnail ? (
                    <img
                      src={study.thumbnail}
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PersonIcon className="w-10 h-10 text-gray-300 opacity-30" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleLike(study.id)
                    }}
                    className="absolute bottom-2 right-2"
                  >
                    {likedStudies.includes(study.id) ? (
                      <HeartFillIcon className="w-5 h-5 text-error" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                </div>

                <div className="px-2 py-2 flex flex-col gap-1">
                  <div className="flex gap-1">
                    {study.subject && (
                      <span className="text-xs border border-gray-300 rounded px-1 text-gray-500">
                        {study.subject.name}
                      </span>
                    )}
                    {study.difficulty && (
                      <span className="text-xs border border-gray-300 rounded px-1 text-gray-500">
                        {study.difficulty.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{study.title}</p>
                  <div className="flex items-center gap-1">
                    <PersonIcon className="w-3 h-3 text-gray-500" />
                    <p className="text-xs text-gray-500">
                      현재 {study.current_participants ?? 0}명이 신청했어요.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  )
}

export default ActivityTabs