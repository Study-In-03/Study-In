import logo2022Src from '@/assets/base/Logo-2022.svg';
import wenivWorldLogo from '@/assets/base/Group.svg';
import arrowIcon from '@/assets/base/icon-diagonal-arrow.svg';
import { useAuthStore } from '@/store/authStore';

const SOCIAL_LINKS = [
  { label: 'SNS 1', href: '#' },
  { label: 'SNS 2', href: '#' },
  { label: 'SNS 3', href: '#' },
  { label: 'SNS 4', href: '#' },
  { label: 'SNS 5', href: '#' },
];

const POLICY_LINKS = [
  { label: '이용약관', href: '/terms' },
  { label: '위치기반서비스이용약관', href: '/location-terms' },
  { label: '개인정보 처리방침', href: '/privacy' },
];

export default function Footer() {
  const { isLoggedIn } = useAuthStore();

  return (
    <footer className="border-t border-gray-100">

      {/* 모바일 푸터 (lg 미만) */}
      <div className="lg:hidden pt-7.5 pb-6 px-4">
        <div className="flex flex-col gap-6 items-center">

          {/* 링크 2컬럼 그리드 */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-1 ">
            <a href="https://weniv.co.kr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-end gap-1 text-sm text-gray-500">회사 소개 <img src={arrowIcon} alt="" className="w-3 h-3" /></a>
            <a href="/terms" className="text-sm text-gray-500">이용약관</a>
            <a href="https://jejucodingcamp.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-end gap-1 text-sm text-gray-500">제주코딩베이스캠프 <img src={arrowIcon} alt="" className="w-3 h-3" /></a>
            <a href="/location-terms" className="text-sm text-gray-500">위치기반서비스이용약관</a>
            <a href="/guide" className="text-sm justify-end text-gray-500">위니브월드 이용 가이드</a>
            <a href="/privacy" className="text-sm text-gray-500">개인정보 처리방침</a>
          </div>

          {/* 소셜 아이콘 4개 */}
          <div className="flex gap-2">
            {SOCIAL_LINKS.slice(0, 4).map(({ label, href }) => (
              <a key={label} href={href} aria-label={label}
                className="w-10 h-10 rounded-xl border border-gray-300 bg-background" />
            ))}
          </div>

          {/* 로고 */}
          <img src={wenivWorldLogo} alt="weniv world" className="h-4" />
        </div>
      </div>

      {/* 데스크탑 풀 푸터 - 비로그인 (lg 이상) */}
      {!isLoggedIn && (
        <div className="hidden lg:block min-h-[334px] py-10">
          <div className="max-w-[990px] mx-auto px-4">

            {/* 상단: 링크 컬럼 + 소셜 아이콘 */}
            <div className="flex justify-between items-start mb-10">

              {/* 링크 컬럼 3개 */}
              <div className="flex gap-16">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold text-gray-700">위니브</p>
                  <a href="https://weniv.co.kr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">회사 소개 <img src={arrowIcon} alt="" className="w-3 h-3" /></a>
                  <a href="https://jejucodingcamp.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">제주코딩베이스캠프 <img src={arrowIcon} alt="" className="w-3 h-3" /></a>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold text-gray-700">위니브월드</p>
                  <a href="/guide" className="text-sm text-gray-500 hover:text-gray-700">위니브월드 이용 가이드</a>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold text-gray-700">정책</p>
                  {POLICY_LINKS.map(({ label, href }) => (
                    <a key={label} href={href} className="text-sm text-gray-500 hover:text-gray-700">{label}</a>
                  ))}
                </div>
              </div>

              {/* 소셜 아이콘 */}
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a key={label} href={href} aria-label={label}
                    className="w-10 h-10 rounded-xl border border-gray-300 bg-background" />
                ))}
              </div>
            </div>

            {/* 하단: 로고 + 사업자 정보 */}
            <div className="flex justify-between items-end border-t border-gray-100 pt-6">
              <div className="flex flex-col gap-2">
                <img src={logo2022Src} alt="Studyin" className="h-4 self-start" />
                <p className="text-xs text-gray-300">
                  (주)위니브 | 대표 이호준 | 사업자 번호 546-86-01737 | 정보통신산업 | 주소 제주특별자치도 제주시 수목원일
                </p>
              </div>
              <p className="text-xs text-gray-300">ⓒ WENIV Corp.</p>
            </div>
          </div>
        </div>
      )}

      {/* 데스크탑 심플 푸터 - 로그인 (lg 이상) */}
      {isLoggedIn && (
        <div className="hidden lg:flex flex-col items-center justify-center gap-3 bg-background py-6">
          <div className="flex items-center gap-4">
            {POLICY_LINKS.map(({ label, href }, index) => (
              <span key={label} className="flex items-center gap-4">
                <a href={href} className="text-sm text-gray-500 hover:text-gray-300">{label}</a>
                {index < POLICY_LINKS.length - 1 && <span className="text-gray-700">|</span>}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-700">ⓒ Copyright WENIV Corp. All Rights Reserved</p>
        </div>
      )}

    </footer>
  );
}