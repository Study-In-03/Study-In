import { useState, useEffect, Component, type ReactNode } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { getProfile, type UserProfile } from '@/api/profile';
import { getFullUrl } from '@/api/upload';
import ReportModal from '@/components/common/ReportModal';
import defaultProfileImg from '@/assets/base/User-Profile-L.svg';
import HelpCircleIcon from '@/assets/base/icon-help-circle.svg?react';
import CloseIcon from '@/assets/base/icon-btn-X.svg?react';

interface GitHubCalendarBoundaryProps {
  username: string;
  blockSize?: number;
  blockMargin?: number;
  fontSize?: number;
}

class GitHubCalendarBoundary extends Component<
  GitHubCalendarBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: GitHubCalendarBoundaryProps) {
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
        blockSize={this.props.blockSize ?? 8}
        blockMargin={this.props.blockMargin ?? 2}
        fontSize={this.props.fontSize ?? 8}
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
      className="fixed inset-0 z-50 flex items-end sm:overflow-y-auto sm:items-start sm:justify-center sm:py-10 md:items-center md:py-0"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 sm:hidden" />
      <div
        className="relative z-10 w-full sm:w-[390px] rounded-t-[20px] sm:rounded-[10px] bg-background shadow-xl max-h-[90vh] overflow-y-auto sm:max-h-none sm:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 (모바일만) */}
        <div className="flex justify-center pt-5 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full opacity-70" />
        </div>

        {/* 닫기 버튼 (웹만) */}
        <button
          onClick={onClose}
          className="hidden sm:block absolute -top-3 -right-3 z-20"
        >
          <CloseIcon className="w-8 h-8" />
        </button>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : profile ? (
          <div className="px-[30px] sm:px-[20px] pt-3 sm:pt-[20px] pb-10 flex flex-col items-center">

            {/* 지역칩 + 신고하기 */}
            <div className="w-full flex items-center justify-between mb-4 sm:mb-6">
              {profile.preferred_region ? (
                <span className="text-xs sm:text-sm text-surface sm:text-gray-700 bg-gray-100 rounded-full px-[13px] sm:px-3 py-[5px] sm:py-1">
                  {profile.preferred_region.location}
                </span>
              ) : (
                <span />
              )}
              <button
                onClick={() => setIsReportOpen(true)}
                className="text-xs sm:text-sm text-gray-500 underline"
              >
                신고하기
              </button>
            </div>

            {/* 프로필 이미지 */}
            <img
              src={profileImgSrc}
              alt={profile.nickname}
              className="w-[90px] h-[90px] md:w-[130px] md:h-[130px] rounded-full object-cover border border-gray-300"
            />

            {/* 닉네임 */}
            <h2 className="mt-5 sm:mt-4 text-lg sm:text-xl font-bold text-black text-center">
              {profile.nickname}
            </h2>

            {/* 레벨 (모바일만) */}
            {profile.grade && (
              <p className="mt-1 text-xs font-bold text-primary sm:hidden">
                Lv. {profile.grade}
              </p>
            )}

            {/* 콘텐츠 영역 */}
            <div className="mt-5 sm:mt-[30px] w-full flex flex-col gap-5 sm:gap-10">
              {/* 자기소개 */}
              <div className="w-full border border-gray-300 sm:border-gray-300 rounded-[10px] sm:rounded-xl px-4 py-4">
                <p className="text-sm sm:text-base text-surface sm:text-gray-700 leading-5 sm:leading-6 whitespace-pre-line">
                  {profile.introduction || '소개글이 없어요.'}
                </p>
              </div>

              {/* 잔디 농사 */}
              <div className="w-full">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-black sm:text-gray-900">잔디 농사</h3>
                  <HelpCircleIcon className="w-5 h-5 text-gray-300 sm:hidden" />
                </div>
                {/* 모바일: bg박스 안에 소형 캘린더 */}
                <div className="sm:hidden w-full h-[100px] bg-gray-100 border border-gray-300 rounded-[10px] overflow-hidden flex items-center justify-center">
                  {profile.github_username ? (
                    <GitHubCalendarBoundary username={profile.github_username} blockSize={5} blockMargin={1} fontSize={7} />
                  ) : (
                    <p className="text-sm text-gray-500">GitHub 계정이 연동되지 않았어요.</p>
                  )}
                </div>
                {/* 웹: overflow-x-auto 원래 방식 */}
                <div className="hidden sm:block w-full overflow-x-auto">
                  {profile.github_username ? (
                    <GitHubCalendarBoundary username={profile.github_username} blockSize={8} blockMargin={2} fontSize={8} />
                  ) : (
                    <p className="text-sm text-gray-500">GitHub 계정이 연동되지 않았어요.</p>
                  )}
                </div>
              </div>

              {/* 관심 분야 */}
              <div className="w-full">
                <h3 className="text-base sm:text-lg font-bold text-black sm:text-gray-900 mb-[10px] sm:mb-3">관심 분야</h3>
                {profile.tag.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.tag.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-[14px] py-[6px] bg-primary text-background text-sm sm:text-base rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">등록된 관심 분야가 없어요.</p>
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
