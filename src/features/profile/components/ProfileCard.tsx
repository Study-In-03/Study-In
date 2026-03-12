import { useEffect, useState } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@/assets/base/icon-person.svg?react'
import UserProfileL from '@/assets/base/User-Profile-L.svg?react'
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

  const isAssociateMember = !profile.is_associate_member

  if (isAssociateMember) {
    return (
      <div className="flex flex-col gap-10 bg-background">
        <div className="flex flex-col border border-gray-300 rounded-xl overflow-hidden">

          {/* 상단: 준회원 안내 */}
          <div className="flex flex-col items-center gap-[30px] px-4 md:px-[195px] py-8 md:py-10 border-b border-gray-300">
            <div className="flex flex-col items-center gap-5">
              <div className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full border border-gray-300 overflow-hidden flex items-center justify-center">
                <UserProfileL className="w-full h-full" />
              </div>
              <p className="text-base md:text-lg font-bold text-gray-400 text-center">(프로필 등록을 완료해주세요)</p>
            </div>
            <div className="w-full bg-gray-100 rounded-[10px] px-4 md:px-[30px] py-5 md:py-[30px] flex items-center justify-center min-h-[80px]">
              <p className="text-sm text-gray-400 text-center">프로필 등록을 완료하면 스터디에 참여할 수 있어요!</p>
            </div>
          </div>

          {/* 하단: 정보 (준회원 - 모든 필드 표시, 빈 값은 "-") */}
          <div className="flex flex-col gap-[30px] px-4 md:px-10 py-5 md:py-[30px]">
            <div className="flex flex-col gap-4 md:gap-5">

              <div className="flex items-center gap-3 md:gap-[30px]">
                <span className="text-xs md:text-sm font-bold text-gray-700 w-[70px] shrink-0">이메일(ID)</span>
                <span className="text-sm md:text-base text-gray-700 break-all">{storage.getEmail() ?? '-'}</span>
              </div>

              <div className="flex items-center gap-3 md:gap-[30px]">
                <span className="text-xs md:text-sm font-bold text-gray-700 w-[70px] shrink-0">이름</span>
                <span className="text-sm md:text-base text-gray-700">{profile.name || '-'}</span>
              </div>

              <div className="flex items-center gap-3 md:gap-[30px]">
                <span className="text-xs md:text-sm font-bold text-gray-700 w-[70px] shrink-0">전화번호</span>
                <span className="text-sm md:text-base text-gray-700">{profile.phone || '-'}</span>
              </div>

              <div className="flex items-center gap-3 md:gap-[30px]">
                <span className="text-xs md:text-sm font-bold text-gray-700 w-[70px] shrink-0">내 지역</span>
                <span className="text-sm md:text-base text-gray-700">{profile.preferred_region?.location || '-'}</span>
              </div>

              <div className="flex items-center gap-3 md:gap-[30px]">
                <span className="text-xs md:text-sm font-bold text-gray-700 w-[70px] shrink-0">GitHub</span>
                <span className="text-sm md:text-base text-gray-700">{profile.github_username || '-'}</span>
              </div>

              {/* 깃허브 캘린더 빈 박스 */}
              <div className="w-full h-[120px] md:h-[160px] bg-gray-100 rounded-[10px] border border-gray-300" />

            </div>

            <div className="flex items-center">
              <span className="text-xs md:text-sm font-bold text-gray-700 shrink-0">관심 분야</span>
            </div>
          </div>
        </div>

        {isMyProfile && (
          <button
            onClick={() => navigate('/profile/edit')}
            className="w-[250px] h-[50px] border border-gray-300 rounded-lg text-base font-medium text-surface hover:bg-gray-100 mx-auto"
          >
            수정하기
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 bg-background">
      <div className="flex flex-col border border-gray-300 rounded-xl overflow-hidden">

        {/* 상단: 프로필 이미지 + 닉네임 + 소개 */}
        <div className="flex flex-col items-center gap-[30px] px-4 md:px-[195px] py-8 md:py-10 border-b border-gray-300">
          <div className="flex flex-col items-center gap-5">
            <div className="w-[130px] h-[130px] rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
              {profile.profile_img ? (
                <img
                  src={getFullUrl(profile.profile_img)}
                  alt="프로필 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <PersonIcon className="w-16 h-16 text-gray-300" />
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-base font-bold text-surface text-center">{profile.nickname}</h2>
              {profile.grade && (
                <span className="text-xs font-bold text-primary">Lv. {profile.grade}</span>
              )}
            </div>
          </div>
          <p className="text-sm text-surface text-center bg-gray-100 rounded-[10px] px-[14px] py-6 w-full min-h-[80px] flex items-center justify-center">
            {profile.introduction || '소개글이 없어요.'}
          </p>
        </div>

        {/* 하단: 정보 */}
        <div className="flex flex-col gap-[30px] px-4 md:px-10 py-5 md:py-[30px]">
          <div className="flex flex-col gap-5">

            <div className="flex items-center gap-3 md:gap-[30px]">
              <span className="text-sm md:text-base font-bold text-gray-700 w-20 shrink-0">이메일(ID)</span>
              <span className="text-lg text-gray-700">{storage.getEmail() ?? ''}</span>
            </div>

            {isMyProfile && profile.name && (
              <div className="flex items-center gap-3 md:gap-[30px]">
                <span className="text-sm md:text-base font-bold text-gray-700 w-20 shrink-0">이름</span>
                <span className="text-lg text-gray-700">{profile.name}</span>
              </div>
            )}

            {isMyProfile && profile.phone && (
              <div className="flex items-center gap-3 md:gap-[30px]">
                <span className="text-sm md:text-base font-bold text-gray-700 w-20 shrink-0">전화번호</span>
                <span className="text-lg text-gray-700">{profile.phone}</span>
              </div>
            )}

            {profile.preferred_region && (
              <div className="flex items-center gap-3 md:gap-[30px]">
                <span className="text-sm md:text-base font-bold text-gray-700 w-20 shrink-0">내 지역</span>
                <span className="text-lg text-gray-700">{profile.preferred_region.location}</span>
              </div>
            )}

            {profile.github_username && (
              <div className="flex items-start gap-3 md:gap-[30px]">
                <span className="text-sm md:text-base font-bold text-gray-700 w-20 shrink-0 mt-1">GitHub</span>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <span className="text-lg text-gray-700">{profile.github_username}</span>
                  {/* 모바일 */}
                  <div className="md:hidden w-full overflow-x-auto rounded-[10px] border border-gray-300 bg-gray-100 p-4">
                    <GitHubCalendar
                      username={profile.github_username}
                      blockSize={8}
                      blockMargin={2}
                      fontSize={10}
                      colorScheme="light"
                    />
                  </div>
                  {/* 웹 */}
                  <div className="hidden md:flex w-full max-w-[810px] h-[160px] items-center justify-center overflow-hidden rounded-[10px] border border-gray-300 bg-gray-100">
                    <GitHubCalendar
                      username={profile.github_username}
                      blockSize={12}
                      blockMargin={2}
                      fontSize={10}
                      colorScheme="light"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {profile.tag.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-[30px]">
              <span className="text-sm md:text-base font-bold text-gray-700 shrink-0">관심 분야</span>
              <div className="flex flex-wrap gap-[10px]">
                {profile.tag.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-primary-light text-background text-sm md:text-base px-[14px] py-[6px] rounded-[36px]"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {isMyProfile && (
        <button
          onClick={() => navigate('/profile/edit')}
          className="w-[250px] h-[50px] border border-gray-300 rounded-lg text-base font-medium text-surface hover:bg-gray-100 mx-auto"
        >
          수정하기
        </button>
      )}

    </div>
  )
}

export default ProfileCard