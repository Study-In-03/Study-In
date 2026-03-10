import StudyBanner from "../features/study/components/StudyBanner";
import StudyProfileCard from "../features/study/components/StudyProfileCard";
import StudyListSection from "../features/study/components/StudyList";
import { useState, useEffect } from "react";
import iconTopBtn from "@/assets/base/icon-top-btn.svg";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useMyStudies } from "@/features/profile/hooks/useMyStudies";
import { getProfile } from "@/api/profile";
import { storage } from "@/utils/storage";
import searchIcon from "@/assets/base/icon-Search.svg";
import IconSpeaker from "@/assets/base/icon-speaker.svg?react";
import { STATUS_COLOR } from "@/constants/study";
import iconSpecial from "../assets/category/subject_특강.svg";
import iconConcept from "../assets/category/subject_개념학습-2.svg";
import iconApply from "../assets/category/subject_응용활용.svg";
import iconProject from "../assets/category/subject_프로젝트.svg";
import iconChallenge from "../assets/category/subject_챌린지.svg";
import iconExam from "../assets/category/subject_자격증시험.svg";
import iconJob from "../assets/category/subject_취업코테.svg";
import iconEtc from "../assets/category/subject_기타.svg";

const categories = [
  { id: 1, name: "특강", icon: iconSpecial },
  { id: 2, name: "개념학습", icon: iconConcept },
  { id: 3, name: "응용/활용", icon: iconApply },
  { id: 4, name: "프로젝트", icon: iconProject },
  { id: 5, name: "챌린지", icon: iconChallenge },
  { id: 6, name: "자격증/시험", icon: iconExam },
  { id: 7, name: "취업/코테", icon: iconJob },
  { id: 8, name: "기타", icon: iconEtc },
];

function calcDDay(startDate?: string, endDate?: string): string {
  const ref = endDate ?? startDate;
  if (!ref) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(ref);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "D-Day";
  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("최신 스터디");
  const [profileImg, setProfileImg] = useState<string | undefined>(undefined);
  const [nickname, setNickname] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { studies: myStudies } = useMyStudies(isLoggedIn ? '/study/my-participating-study/' : null);

  useEffect(() => {
    if (!isLoggedIn) return;
    const userId = storage.getUserId();
    if (!userId) return;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    getProfile(userId).then((profile) => {
      setNickname(profile.nickname);
      setProfileImg(profile.profile_img ? baseUrl + profile.profile_img : undefined);
    }).catch(() => {});
  }, [isLoggedIn]);

  return (
    <>
      {/* ── 모바일 레이아웃 ── */}
      <div className="md:hidden bg-gray-100">

        {/* 섹션 1: 배너 + 참여 중인 스터디 */}
        <div className="bg-background w-full pb-[30px] mb-2">
          <div className="mx-4 pt-[14px]">
            <StudyBanner />
          </div>
          {isLoggedIn && (
            <div className="mt-[30px] px-4">
              <h3 className="text-xl font-bold text-surface mb-4">
                참여 중인 스터디 <span className="text-primary">{myStudies.length}개</span>
              </h3>
              {myStudies.length === 0 ? (
                <p className="text-sm text-gray-500">아직 참여 중인 스터디가 없어요.</p>
              ) : (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {myStudies.map((study) => (
                    <div
                      key={study.id}
                      className="w-[130px] shrink-0 flex flex-col cursor-pointer"
                      onClick={() => navigate(`/study/${study.id}`)}
                    >
                      {/* 이미지 영역 */}
                      <div className="w-full h-[130px] bg-gray-100 border border-gray-300 rounded-[10px] overflow-hidden">
                        {study.thumbnail && (
                          <img src={study.thumbnail} alt={study.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      {/* 상태 뱃지 */}
                      <div className="flex items-center gap-1 mt-2">
                        <IconSpeaker className={`w-4 h-4 shrink-0 ${STATUS_COLOR[study.study_status.name] ?? "text-gray-400"}`} />
                        <span className={`text-sm font-bold ${STATUS_COLOR[study.study_status.name] ?? "text-gray-400"}`}>
                          {study.study_status.name === "모집 중" ? "모집 중!" : study.study_status.name}
                          {calcDDay(study.start_date, study.end_date) && ` (${calcDDay(study.start_date, study.end_date)})`}
                        </span>
                      </div>
                      {/* 제목 */}
                      <p className="text-base font-medium text-surface mt-1 line-clamp-2 leading-5">{study.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 섹션 2+3: 검색바 + 카테고리 */}
        <div className="bg-background px-4 pt-[30px] pb-[30px] mb-2">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center h-11 px-4 border-2 border-gray-300 rounded-full gap-2 bg-background"
          >
            <span className="flex-1 text-left text-base font-medium text-gray-500">
              어떤 스터디를 찾고 계신가요?
            </span>
            <img src={searchIcon} alt="검색" className="w-7 h-7 shrink-0" />
          </button>
          <div className="grid grid-cols-4 gap-5 mt-[30px] px-[9px]">
            {categories.map((category) => (
              <button key={category.id} className="flex flex-col items-center gap-2">
                <div className="w-[70px] h-[70px] rounded-[12px] bg-gray-100 flex items-center justify-center">
                  <img src={category.icon} alt={category.name} className="w-[62px] h-[62px] object-contain" />
                </div>
                <span className="text-base font-medium text-surface text-center">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 섹션 4: 스터디 둘러보기 */}
        <div className="bg-background px-4 pt-[26px] pb-10">
          <h2 className="text-xl font-bold text-surface mb-4">스터디 둘러보기</h2>
          <div className="flex gap-[10px] mb-4">
            {["최신 스터디", "모집 중 스터디", "진행 중 스터디"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-[14px] py-[6px] rounded-full text-base transition-all ${
                  activeTab === tab
                    ? "bg-primary text-background font-bold"
                    : "bg-gray-100 text-gray-700 font-regular"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <StudyListSection
            activeTab={activeTab}
            selectedCategory="전체"
            searchTerm=""
          />
        </div>
      </div>

      {/* ── 데스크탑 레이아웃 ── */}
      <div className="hidden md:block max-w-[1190px] mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            {isLoggedIn ? (
              <>
                <div className="w-full">
                  <StudyBanner />
                </div>
                <div className="flex items-center py-4 overflow-x-auto gap-[30px] no-scrollbar pl-[80px] mt-[40px]">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="flex flex-col items-center shrink-0 gap-3 group"
                    >
                      <div className="w-[60px] h-[60px] rounded-2xl bg-gray-50 flex items-center justify-center transition-all group-hover:bg-primary/10">
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-[50px] h-[50px] object-contain"
                        />
                      </div>
                      <span className="text-base font-semibold text-gray-500 group-hover:text-primary">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="space-y-6 mt-12">
                  <h2 className="text-2xl font-bold text-surface">스터디 둘러보기</h2>
                  <div className="flex gap-3">
                    {["최신 스터디", "모집 중 스터디", "진행 중 스터디"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all ${
                          activeTab === tab
                            ? "bg-primary text-background shadow-sm"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <StudyListSection
                    activeTab={activeTab}
                    selectedCategory="전체"
                    searchTerm=""
                    cols={3}
                  />
                </div>
              </>
            ) : (
              <div className="w-full aspect-[880/300] bg-gray-200 rounded-[12px]" />
            )}
          </div>

          <aside className="w-full md:w-[290px] sticky top-24">
            <StudyProfileCard
              isLoggedIn={isLoggedIn}
              userName={nickname}
              userImage={profileImg}
              studies={myStudies.map((s) => ({
                id: s.id,
                title: s.title,
                status: s.study_status.name as "진행 중" | "모집 중",
                dDay: calcDDay(s.start_date, s.end_date),
                image: s.thumbnail ?? "",
              }))}
            />
          </aside>
        </div>
      </div>

      {/* ── 상단으로 버튼 (데스크탑 전용, 로그인 시에만) ── */}
      <div className={`hidden ${isLoggedIn ? "md:flex" : ""} justify-end max-w-[1190px] mx-auto py-6`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="상단으로 이동"
        >
          <img src={iconTopBtn} alt="상단으로" className="w-[52px] h-[52px]" />
        </button>
      </div>
    </>
  );
}
