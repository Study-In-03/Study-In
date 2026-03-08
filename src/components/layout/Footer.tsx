import logo2022Src from '@/assets/base/Logo-2022.svg';
import wenivWorldLogo from '@/assets/base/Group.svg';
import arrowIcon from '@/assets/base/icon-diagonal-arrow.svg';
import { useLocation } from 'react-router-dom';

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

// 초기 프로필 생성 페이지 구현 후 해당 경로를 아래에 추가할 것
const SIMPLE_FOOTER_PATHS = [
  '/login',
  // '/profile/create',
];

// 웹(lg 이상)에서 푸터를 완전히 숨길 경로
const NO_DESKTOP_FOOTER_PATHS = [
  '/register',
];

export default function Footer() {
  const { pathname } = useLocation();
  const isSimpleFooter = SIMPLE_FOOTER_PATHS.includes(pathname);
  const isNoDesktopFooter = NO_DESKTOP_FOOTER_PATHS.includes(pathname);

  return (
    <footer className="border-t border-gray-300">

      {/* 모바일 푸터 (lg 미만) */}
      <div className="lg:hidden pt-[30px] pb-6">
        <div className="flex flex-col items-center">

          {/* 링크 2컬럼 */}
          <div className="flex w-full px-[66px]">
            {/* 왼쪽 컬럼: flex-end 정렬 */}
            <div className="flex flex-col gap-[6px] flex-1 items-end pr-[16px]">
              <a
                href="https://weniv.co.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap"
              >
                회사 소개
                <img src={arrowIcon} alt="" className="w-[10px] h-[10px]" />
              </a>
              <a
                href="https://jejucodingcamp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap"
              >
                제주코딩베이스캠프
                <img src={arrowIcon} alt="" className="w-[10px] h-[10px]" />
              </a>
              <a href="/guide" className="text-sm text-gray-500 whitespace-nowrap">
                위니브월드 이용 가이드
              </a>
            </div>

            {/* 오른쪽 컬럼: flex-start 정렬 */}
            <div className="flex flex-col gap-[6px] flex-1 items-start pl-[16px]">
              <a href="/terms" className="text-sm text-gray-500 whitespace-nowrap">
                이용약관
              </a>
              <a href="/location-terms" className="text-sm text-gray-500 whitespace-nowrap">
                위치기반서비스이용약관
              </a>
              <a href="/privacy" className="text-sm text-gray-500 whitespace-nowrap">
                개인정보 처리방침
              </a>
            </div>
          </div>

          {/* 소셜 아이콘 5개 */}
          <div className="flex gap-[10px] mt-[30px]">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-[30px] h-[30px] rounded-[8px] border border-gray-300 bg-background"
              />
            ))}
          </div>

          {/* 로고 */}
          <img src={wenivWorldLogo} alt="weniv world" className="h-[18px] mt-[14px] mb-6" />
        </div>
      </div>

      {/* 데스크탑 풀 푸터 - 로그인/회원가입 페이지 제외 (lg 이상) */}
      {!isSimpleFooter && !isNoDesktopFooter && (
        <div className="hidden lg:block py-[50px]">
          <div className="max-w-[1190px] mx-auto">

            {/* 상단: 링크 컬럼 3개 + 소셜 아이콘 */}
            <div className="flex justify-between items-start">
              <div className="flex">

                {/* 위니브 컬럼 */}
                <div className="w-[200px] flex flex-col gap-[20px]">
                  <p className="text-base font-bold text-surface">위니브</p>
                  <div className="flex flex-col gap-[10px]">
                    <a
                      href="https://weniv.co.kr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-base text-gray-500 hover:text-gray-700"
                    >
                      회사 소개
                      <img src={arrowIcon} alt="" className="w-[10px] h-[10px]" />
                    </a>
                    <a
                      href="https://jejucodingcamp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-base text-gray-500 hover:text-gray-700"
                    >
                      제주코딩베이스캠프
                      <img src={arrowIcon} alt="" className="w-[10px] h-[10px]" />
                    </a>
                  </div>
                </div>

                {/* 위니브월드 컬럼 */}
                <div className="w-[200px] flex flex-col gap-[20px]">
                  <p className="text-base font-bold text-surface">위니브월드</p>
                  <a href="/guide" className="text-base text-gray-500 hover:text-gray-700">
                    위니브월드 이용 가이드
                  </a>
                </div>

                {/* 정책 컬럼 */}
                <div className="w-[200px] flex flex-col gap-[20px]">
                  <p className="text-base font-bold text-surface">정책</p>
                  <div className="flex flex-col gap-[10px]">
                    {POLICY_LINKS.map(({ label, href }) => (
                      <a key={label} href={href} className="text-base text-gray-500 hover:text-gray-700">
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* 소셜 아이콘 5개 */}
              <div className="flex gap-[10px]">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-[30px] h-[30px] rounded-[8px] border border-gray-300 bg-background"
                  />
                ))}
              </div>
            </div>

            {/* 하단: 로고 + 사업자 정보 */}
            <div className="flex justify-between items-end mt-[90px] pt-[30px]">
              <div className="flex flex-col gap-[16px]">
                <img src={logo2022Src} alt="Studyin" className="h-[32px] self-start" />
                <p className="text-xs text-gray-500">
                  (주)위니브  |  대표 :  이호준  |  사업자 번호 :  546-86-01737  |  정보통신업  |  주소 : 제주특별자치도 제주시 수목원길
                </p>
              </div>
              <p className="text-xs font-bold text-gray-500">ⓒ WENIV Corp.</p>
            </div>
          </div>
        </div>
      )}

      {/* 데스크탑 심플 푸터 - 로그인 페이지 (lg 이상) */}
      {isSimpleFooter && (
        <div className="hidden lg:flex flex-col items-center gap-[12px] bg-background pt-10 pb-6">
          <div className="flex items-center gap-[10px]">
            {POLICY_LINKS.map(({ label, href }, index) => (
              <span key={label} className="flex items-center gap-[10px]">
                <a href={href} className="text-base text-gray-500 hover:text-gray-700">
                  {label}
                </a>
                {index < POLICY_LINKS.length - 1 && (
                  <span className="text-base text-gray-500">|</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-bold">ⓒ </span>
            Copyright
            <span className="font-bold"> WENIV Corp. </span>
            All Rights Reserved.
          </p>
        </div>
      )}

    </footer>
  );
}