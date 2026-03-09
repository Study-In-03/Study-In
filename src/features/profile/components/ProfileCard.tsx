import { useEffect, useState } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@/assets/base/icon-person.svg?react'
import { getProfile } from '@/api/profile'
import type { UserProfile } from '@/types/user'
import { storage } from '@/utils/storage'
import { getFullUrl } from '@/api/upload'

const ProfileCard = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMyProfile, setIsMyProfile] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = storage.getUserId()
      if (!userId) return
      try {
        const data = await getProfile(userId)
        setProfile(data)
        // storage.getUserId()는 string | null → Number()로 변환해야 number인 data.user와 비교 가능
        setIsMyProfile(data.user === Number(userId))
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
    <div className="flex flex-col px-4 py-6 gap-4 bg-background">
      <div className="flex flex-col border border-gray-300 rounded-xl overflow-hidden">

        <div className="flex flex-col items-center gap-3 px-4 py-6">
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
          <h2 className="text-lg font-bold text-gray-900">{profile.nickname}</h2>
          <span className="text-sm text-primary font-medium">Lv. {profile.grade}</span>
          <p className="text-base text-gray-500 text-center bg-gray-100 rounded-lg px-4 py-3 w-full">
            {profile.introduction || '소개글이 없어요.'}
          </p>
        </div>

        <div className="w-full border-t border-gray-300" />
        <div className="flex flex-col gap-3 px-4 py-5">

          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-gray-900 w-24 shrink-0">이메일(ID)</span>
            <span className="text-base text-gray-700">{storage.getEmail() ?? ''}</span>
          </div>

          {isMyProfile && profile.name && (
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-gray-900 w-24 shrink-0">이름</span>
              <span className="text-base text-gray-700">{profile.name}</span>
            </div>
          )}

          {isMyProfile && profile.phone && (
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-gray-900 w-24 shrink-0">전화번호</span>
              <span className="text-base text-gray-700">{profile.phone}</span>
            </div>
          )}

          {profile.preferred_region && (
            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-gray-900 w-24 shrink-0">내 지역</span>
              <span className="text-base text-gray-700">{profile.preferred_region.location}</span>
            </div>
          )}

          {profile.github_username && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-gray-900 w-24 shrink-0">GitHub</span>
                <span className="text-base text-gray-700">{profile.github_username}</span>
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

          {profile.tag.length > 0 && (
            <>
              <div className="w-full border-t border-gray-300" />
              <p className="text-base font-medium text-gray-900">관심 분야</p>
              <div className="flex flex-wrap gap-2">
                {profile.tag.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-primary text-background text-sm px-3 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {isMyProfile && (
        <button
          onClick={() => navigate('/profile/edit')}
          className="w-40 py-2 border border-gray-300 rounded-lg text-base text-gray-700 hover:bg-activation mx-auto"
        >
          수정하기
        </button>
      )}

    </div>
  )
}

export default ProfileCard