import { useState, useEffect, Component, type ReactNode } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { getProfile, type UserProfile } from '@/api/profile';
import { getFullUrl } from '@/api/upload';
import ReportModal from '@/components/common/ReportModal';
import defaultProfileImg from '@/assets/base/User-Profile-L.svg';
import CloseIcon from '@/assets/base/icon-button-(X).svg?react';

// throwOnError로 에러를 throw하면 에러 바운더리에서 catch해서 null 반환
class GitHubCalendarBoundary extends Component<
  { username: string },
  { hasError: boolean }
> {
  constructor(props: { username: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render(): ReactNode {
    if (this.state.hasError) return null;
    return (
      <GitHubCalendar
        username={this.props.username}
        throwOnError
        blockSize={8}
        blockMargin={2}
        fontSize={8}
        colorScheme="light"
      />
    );
  }
}

interface UserInfoModalProps {
  userId: number;
  onClose: () => void;
}

const UserInfoModal = ({ userId, onClose }: UserInfoModalProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getProfile(userId)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isReportOpen) {
    return (
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="user"
        targetId={userId}
      />
    );
  }

  const profileImgSrc = profile
    ? getFullUrl(profile.profile_img) || defaultProfileImg
    : defaultProfileImg;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center py-10"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative z-10 w-[390px] rounded-[10px] bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : profile ? (
          <div className="px-[20px] pt-[20px] pb-10 flex flex-col items-center">
            {/* 닫기 버튼 (우상단 모서리 겹침) */}
            <button
              onClick={onClose}
              className="absolute -top-3 -right-3 z-20"
            >
              <CloseIcon className="w-8 h-8" />
            </button>

            {/* 헤더 행: 지역칩 | 신고하기 */}
            <div className="w-full flex items-center justify-between mb-6">
              {profile.preferred_region ? (
                <span className="text-[12px] text-gray-600 bg-[#F3F5FA] rounded-full px-3 py-1">
                  {profile.preferred_region.location}
                </span>
              ) : (
                <span />
              )}
              <button
                onClick={() => setIsReportOpen(true)}
                className="text-[12px] text-[#8D9299] underline"
              >
                신고하기
              </button>
            </div>

            {/* 프로필 이미지 */}
            <img
              src={profileImgSrc}
              alt={profile.nickname}
              className="w-[130px] h-[130px] rounded-full object-cover border border-gray-300"
            />

            {/* 닉네임 */}
            <h2 className="mt-4 text-xl font-bold text-black">
              {profile.nickname}
            </h2>

            {/* 콘텐츠 영역 */}
            <div className="mt-[30px] w-full flex flex-col gap-10">
              {/* 자기소개 */}
              <div className="w-full border border-[#D9DBE0] rounded-xl px-4 py-4">
                <p className="text-base text-gray-700 leading-6 whitespace-pre-line w-full">
                  {profile.introduction || '소개글이 없어요.'}
                </p>
              </div>

              {/* 잔디 농사 */}
              <div className="w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-3">잔디 농사</h3>
                <div className="w-full overflow-x-auto">
                  {profile.github_username ? (
                    <GitHubCalendarBoundary username={profile.github_username} />
                  ) : (
                    <p className="text-sm text-gray-400">GitHub 계정이 연동되지 않았어요.</p>
                  )}
                </div>
              </div>

              {/* 관심 분야 */}
              <div className="w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-3">관심 분야</h3>
                {profile.tag.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.tag.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-[14px] py-[6px] bg-primary text-background text-base rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">등록된 관심 분야가 없어요.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-gray-500">
            프로필을 불러올 수 없어요.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoModal;
