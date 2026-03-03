import { useEffect, useState } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@/assets/base/icon-person.svg?react'
import { getProfile, UserProfile } from '@/api/profile'
import { storage } from '@/utils/storage'
import { getFullUrl } from '@/api/upload'

interface ProfileCardProps {
  isMyProfile?: boolean
}

const ProfileCard = ({ isMyProfile = true }: ProfileCardProps) => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = storage.getUserId()
      if (!userId) return
      try {
        const data = await getProfile(userId)
        setProfile(data)
      } catch {
        setError('프로필을 불러오는 데 실패했어요.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-gray-500 text-sm">
        불러오는 중...
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center py-16 text-error text-sm">
        {error ?? '프로필을 불러올 수 없어요.'}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 gap-4 bg-background">

      {/* 프로필 이미지 */}
      <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {profile.profile_img ? (
          <img
            src={getFullUrl(profile.profile_img)}
            alt="프로필 이미지"
            className="w-full h-full object-cover"
          />
        ) : (
          <PersonIcon className="w-14 h-14 text-gray-300" />
        )}
      </div>

      {/* 닉네임 */}
      <h2 className="text-lg font-bold text-gray-900">{profile.nickname}</h2>

      {/* 등급 */}
      <span className="text-sm text-primary font-medium">Lv. {profile.grade}</span>

      {/* 소개글 */}
      <p className="text-base text-gray-500 text-center bg-gray-100 rounded-lg px-4 py-3 w-full">
        {profile.introduction || '소개글이 없어요.'}
      </p>

      <div className="w-full border-t border-gray-300" />

      {/* 정보 목록 */}
      <div className="w-full flex flex-col gap-4">

        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-900 w-28">이메일(ID)</span>
          <span className="text-base text-gray-700 flex-1 text-right">{profile.user}</span>
        </div>

        {isMyProfile && profile.name && (
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-gray-900 w-28">이름</span>
            <span className="text-base text-gray-700 flex-1 text-right">{profile.name}</span>
          </div>
        )}

        {isMyProfile && profile.phone && (
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-gray-900 w-28">전화번호</span>
            <span className="text-base text-gray-700 flex-1 text-right">{profile.phone}</span>
          </div>
        )}

        {profile.preferred_region && (
          <div className="flex justify-between items-center">
            <span className="text-base font-medium text-gray-900 w-28">내 지역</span>
            <span className="text-base text-gray-700 flex-1 text-right">
              {profile.preferred_region.location}
            </span>
          </div>
        )}

        {profile.github_username && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-900 w-28">GitHub</span>
              <span className="text-base text-gray-700 flex-1 text-right">
                {profile.github_username}
              </span>
            </div>
            <div className="w-full overflow-x-auto">
              <GitHubCalendar
                username={profile.github_username}
                blockSize={8}
                blockMargin={2}
                fontSize={8}
                colorScheme="light"
              />
            </div>
          </div>
        )}

      </div>

      <div className="w-full border-t border-gray-300" />

      {/* 관심 분야 태그 */}
      {profile.tag.length > 0 && (
        <div className="w-full">
          <p className="text-base font-medium text-gray-900 mb-2">관심 분야</p>
          <div className="flex flex-wrap gap-2">
            {profile.tag.map((tag) => (
              <span
                key={tag.id}
                className="bg-activation text-primary text-sm px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="w-full border-t border-gray-300" />

      {isMyProfile && (
        <button
          onClick={() => navigate('/profile/edit')}
          className="w-40 py-2 border border-gray-300 rounded-lg text-base text-gray-700 hover:bg-activation"
        >
          수정하기
        </button>
      )}

    </div>
  )
}

export default ProfileCard
