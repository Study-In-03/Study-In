import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudy, joinStudy, leaveStudy } from '@/api/study';
import { STATUS_BG_COLOR } from '@/constants/study';
import { storage } from '@/utils/storage';
import { StudyApiData, likeStudy, unlikeStudy } from '@/api/study';
import { useAssociateGuard } from '@/hooks/useAssociateGuard';
import { getFullUrl } from '@/api/upload';
import { useModalStore } from '@/store/modalStore';
import SpeakerIcon from "@/assets/base/icon-speaker.svg?react";
import CrownIcon from "@/assets/base/icon-crown-fill.svg?react";
import HeartIcon from "@/assets/base/icon-heart.svg?react";
import HeartFillIcon from "@/assets/base/icon-heart-fill.svg?react";
import ShareIcon from "@/assets/base/icon-Share.svg?react";
import CommentSection from "@/features/comments/components/CommentSection";

function TagChip({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-gray-300 bg-background px-[14px] py-[6px] text-sm text-gray-700">
      {label}
    </div>
  );
}

export default function StudyDetail() {
  const navigate = useNavigate();
  const { studyId } = useParams<{ studyId: string }>();
  const { withAssociateGuard } = useAssociateGuard();
  const { openModal } = useModalStore();

  const [liked, setLiked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [studyDetail, setStudyDetail] = useState<StudyApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const thumbnailCardRef = useRef<HTMLDivElement>(null);

  const myPk = useMemo(() => Number(storage.getUserId()), []);
  const isLeader = studyDetail?.leader?.id === myPk;

  useEffect(() => {
    const fetchDetail = async () => {
      if (!studyId) return;
      try {
        setIsLoading(true);
        const data = await getStudy(Number(studyId));
        setStudyDetail(data);
        const alreadyJoined = data.participants.some((p: any) => p.id === myPk);
        if (alreadyJoined) setIsJoined(true);
        const alreadyLiked = data.like_users?.includes(myPk) ?? false;
        setLiked(alreadyLiked);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [studyId]);

  const handleLike = async () => {
    if (!studyId || isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      if (liked) {
        await unlikeStudy(Number(studyId));
      } else {
        await likeStudy(Number(studyId));
      }
      setLiked((prev) => !prev);
    } catch (error: any) {
      if (error.response?.status === 409) setLiked((prev) => !prev);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleJoinOrChat = async () => {
    if (!studyId || !studyDetail) return;
    if (isLeader || isJoined) {
      navigate(`/chat/${studyId}`);
      return;
    }
    try {
      await joinStudy(Number(studyId));
      setIsJoined(true);
      setJoinSuccess(true);
      setTimeout(() => setJoinSuccess(false), 3000);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || "참여 신청 중 오류가 발생했습니다.";
      alert(errorMsg);
      if (error.response?.status === 409) setIsJoined(true);
    }
  };

  const handleLeave = async () => {
    if (!studyId) return;
    if (!window.confirm("스터디에서 탈퇴하시겠습니까?")) return;
    try {
      await leaveStudy(Number(studyId));
      setIsJoined(false);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "탈퇴 중 오류가 발생했습니다.";
      alert(errorMsg);
    }
  };

  if (isLoading)
    return <div className="p-10 text-center text-gray-500">불러오는 중...</div>;
  if (!studyDetail)
    return (
      <div className="p-10 text-center text-gray-500">
        데이터를 찾을 수 없습니다.
      </div>
    );

  const isCompleted = studyDetail.study_status.name === "완료";
  const STATUS_DISPLAY: Record<string, string> = {
    "모집 중": "모집 중!",
    "진행 중": "진행 중",
    "모집 완료": "모집 완료",
    "완료": "종료",
  };
  const DAYS_ORDER = ["월", "화", "수", "목", "금", "토", "일"];
  const leaderProfile = studyDetail.leader.profile;
  const leaderImgUrl = leaderProfile.profile_img
    ? getFullUrl(leaderProfile.profile_img)
    : null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}(${dayNames[d.getDay()]})`;
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 참여 성공 토스트 */}
      {joinSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-surface text-background text-sm font-medium px-5 py-3 rounded-full shadow-lg">
          스터디 참여 신청이 완료되었습니다 🎉
        </div>
      )}

      <div className="hidden md:block">

        <div className="mx-auto max-w-[1190px] pt-6">
          <div
            ref={thumbnailCardRef}
            className="rounded-xl border border-gray-300 bg-background overflow-hidden"
          >
            <div className="flex h-[390px]">
              <div className="w-[390px] shrink-0 relative">
                <img
                  src={getFullUrl(studyDetail.thumbnail)}
                  alt={studyDetail.title}
                  className="w-full h-full object-cover"
                />
                {studyDetail.study_status?.name === "완료" && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <span className="text-background text-lg font-bold">완료된 스터디입니다 :)</span>
                  </div>
                )}
              </div>
              <div className="flex-1 px-[30px] py-[30px] flex flex-col">
                <div className="flex flex-col gap-[30px]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-[6px]">
                      <TagChip label={studyDetail.subject.name} />
                      <TagChip label={studyDetail.difficulty.name} />
                    </div>
                    {studyDetail.study_location && (
                      <span className="h-8 flex items-center px-[14px] text-sm bg-gray-100 rounded-full text-surface shrink-0">
                        {studyDetail.study_location.location}
                      </span>
                    )}
                  </div>
                  <h1 className="text-[30px] font-bold text-surface leading-[40px]">
                    {studyDetail.title}
                  </h1>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-[30px]">
                  {studyDetail.search_tag.length > 0 && (
                    <p className="flex-1 text-base font-bold text-primary">
                      {studyDetail.search_tag.map((tag) => (
                        <span key={tag.id}>#{tag.name} </span>
                      ))}
                    </p>
                  )}
                  {studyDetail.search_tag.length === 0 && <div className="flex-1" />}
                  <div className="flex items-center gap-[10px] shrink-0">
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 w-[190px] h-[50px] text-base font-medium text-gray-700">
                      <ShareIcon className="w-5 h-5" />
                      공유하기
                    </button>
                    <button
                      onClick={handleLike}
                      disabled={isLikeLoading}
                      className="w-[50px] h-[50px] flex items-center justify-center rounded-lg border border-gray-300"
                    >
                      {liked
                        ? <HeartFillIcon className="w-5 h-5 text-error" />
                        : <HeartIcon className="w-5 h-5 text-gray-500" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1190px] pt-[60px] pb-6 flex gap-[60px] items-start">

          <div className="flex-1 min-w-0 flex flex-col gap-[60px]">

            {/* 소개 + 일정 + 그룹장 */}
            <div className="flex flex-col gap-[30px]">

              {/* 스터디 소개 */}
              <div className="flex flex-col gap-[20px]">
                <h2 className="text-[30px] font-bold text-surface leading-[40px]">스터디 소개</h2>
                <p className="whitespace-pre-line text-base text-surface leading-[24px]">
                  {studyDetail.study_info}
                </p>
              </div>

              <div className="h-[2px] bg-gray-300" />

              {/* 스터디 일정 */}
              <div className="flex flex-col gap-[20px]">
                <h2 className="text-[30px] font-bold text-surface leading-[40px]">스터디 일정</h2>
                {studyDetail.schedule_info
                  ? (
                    <p className="whitespace-pre-line text-base text-surface leading-[24px]">
                      {studyDetail.schedule_info}
                    </p>
                  )
                  : <p className="text-base text-gray-300">일정 정보가 없습니다.</p>
                }
              </div>

              <div className="h-[2px] bg-gray-300" />

              {/* 그룹장 소개 */}
              <div className="flex flex-col gap-[30px]">
                <h2 className="text-[30px] font-bold text-surface leading-[40px]">그룹장 소개</h2>
                <div
                  className="cursor-pointer flex items-center gap-[30px]"
                  onClick={() => openModal("user-info", studyDetail.leader.id)}
                >
                  <div className="w-[130px] h-[130px] rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-300">
                    {leaderImgUrl
                      ? (
                        <img
                          src={leaderImgUrl}
                          alt={leaderProfile.nickname}
                          className="w-full h-full object-cover"
                        />
                      )
                      : <div className="w-full h-full bg-gray-100" />
                    }
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center gap-[10px]">
                      <div className="flex items-center gap-[6px]">
                        <span className="text-[18px] font-bold text-surface">
                          {leaderProfile.nickname}
                        </span>
                        <CrownIcon className="w-[26px] h-[26px] text-[#FFC533]" />
                      </div>
                      {leaderProfile.preferred_region && (
                        <span className="h-[26px] flex items-center px-[13px] text-xs text-surface bg-gray-100 rounded-full">
                          {leaderProfile.preferred_region.location}
                        </span>
                      )}
                    </div>
                    {leaderProfile.introduction && (
                      <div
                        className="bg-[#FFE187] px-[30px] py-[20px]"
                        style={{ borderRadius: "2px 30px 30px 30px" }}
                      >
                        <p className="text-sm text-surface leading-[20px]">
                          {leaderProfile.introduction}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 그룹장에게 질문하기 */}
            <div className="flex flex-col gap-[30px]">
              <h2 className="text-[30px] font-bold text-surface leading-[40px]">
                그룹장에게 질문하기
              </h2>
              <CommentSection
                studyPk={studyDetail.id}
                leaderId={studyDetail.leader.id}
                currentUserId={myPk}
              />
            </div>

          </div>
          <div className="w-[290px] shrink-0 sticky top-6 self-start">
            {/* 상태 바 */}
            <div className={`h-[60px] ${STATUS_BG_COLOR[studyDetail.study_status.name] ?? 'bg-primary'} rounded-t-xl px-[12px] pb-3 flex items-center gap-2`}>
              <SpeakerIcon className="h-5 w-5 text-background shrink-0" />
              <span className="text-background text-lg font-bold">
                {STATUS_DISPLAY[studyDetail.study_status.name] ?? studyDetail.study_status.name}
              </span>
            </div>
            {/* 흰색 콘텐츠 카드 - 상태 바 아래 16px 겹쳐서 자체 라운드 처리 */}
            <div className="rounded-xl border border-gray-300 bg-background -mt-4 relative z-10 drop-shadow-[0px_5px_15px_rgba(71,73,77,0.10)]">
              <div className="px-[20px] py-[20px] flex flex-col gap-[16px]">
                <p className="text-[24px] font-bold text-surface leading-[34px] text-center">
                  스터디 일정
                </p>
                <div className="flex justify-between">
                  {DAYS_ORDER.map((d) => {
                    const active = studyDetail.study_day.some(
                      (day) => day.name === d
                    );
                    return (
                      <div
                        key={d}
                        className={`w-[30px] h-[30px] flex items-center justify-center rounded-full text-sm font-medium
                          ${active
                            ? "bg-primary text-background"
                            : "bg-gray-100 text-gray-400"
                          }`}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
                <div className="h-[2px] bg-gray-300" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-primary">시작일</span>
                  <span className="text-base text-primary">
                    {studyDetail.start_date}
                  </span>
                </div>
                <div className="h-[2px] bg-gray-300" />
                <div className="flex flex-col gap-[4px]">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-surface">시간</span>
                    <span className="text-base text-surface">
                      {studyDetail.start_time.slice(0, 5)} ~{" "}
                      {studyDetail.end_time.slice(0, 5)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 text-right">
                    {studyDetail.term}주 진행
                  </p>
                </div>
                <div className="h-[2px] bg-gray-300" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-surface">모집 인원</span>
                  <span className="text-base font-bold text-primary">
                    {studyDetail.participants.length}/{studyDetail.recruitment}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  {isLeader || isJoined ? (
                    <button
                      onClick={() => navigate(`/chat/${studyId}`)}
                      className="w-full h-[50px] rounded-lg font-medium text-base bg-primary text-background"
                    >
                      채팅방 가기
                    </button>
                  ) : (
                    <button
                      onClick={() => withAssociateGuard(handleJoinOrChat, 'associate-join')}
                      disabled={isCompleted}
                      className={`w-full h-[50px] rounded-lg font-medium text-base ${isCompleted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-background"}`}
                    >
                      참여하기
                    </button>
                  )}
                  <div className="flex items-center gap-[10px]">
                    {isLeader && (
                      <button
                        onClick={() => navigate(`/study/${studyId}/edit`)}
                        className="w-[130px] h-[50px] rounded-lg border border-gray-300 text-base font-medium text-surface"
                      >
                        수정하기
                      </button>
                    )}
                    {isJoined && !isLeader && (
                      <button
                        onClick={handleLeave}
                        className="w-[130px] h-[50px] rounded-lg border border-error text-base font-medium text-error"
                      >
                        탈퇴하기
                      </button>
                    )}
                    <button className="flex-1 h-[50px] flex items-center justify-center gap-2 rounded-lg border border-gray-300 text-base font-medium text-gray-700">
                      <ShareIcon className="w-5 h-5" />
                      {!isLeader && !isJoined && "공유하기"}
                    </button>
                    <button
                      onClick={handleLike}
                      disabled={isLikeLoading}
                      className="w-[50px] h-[50px] flex items-center justify-center rounded-lg border border-gray-300"
                    >
                      {liked
                        ? <HeartFillIcon className="w-5 h-5 text-error" />
                        : <HeartIcon className="w-5 h-5 text-gray-500" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="md:hidden pb-[80px]">

        {/* 상단 카드 (detail-bar-Top) */}
        <div className="mx-4 mt-4 rounded-xl border border-gray-300 overflow-hidden bg-background">
          {/* 태그 + 지역 */}
          <div className="px-[16px] pt-[16px] pb-[14px] flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <TagChip label={studyDetail.subject.name} />
              <TagChip label={studyDetail.difficulty.name} />
            </div>
            {studyDetail.study_location && (
              <span className="text-xs bg-gray-100 rounded-full px-[10px] py-[4px] text-gray-700 flex-shrink-0">
                {studyDetail.study_location.location}
              </span>
            )}
          </div>
          {/* 썸네일 */}
          <div className="relative w-full aspect-square bg-gray-100">
            <img
              src={getFullUrl(studyDetail.thumbnail)}
              alt={studyDetail.title}
              className="w-full h-full object-cover"
            />
            {studyDetail.study_status?.name === "완료" && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                <span className="text-background text-lg font-bold">완료된 스터디입니다 :)</span>
              </div>
            )}
          </div>
          {/* 제목 + 해시태그 */}
          <div className="px-[16px] pt-[20px] pb-[20px]">
            <h1 className="text-xl font-bold text-surface leading-[26px]">
              {studyDetail.title}
            </h1>
            {studyDetail.search_tag.length > 0 && (
              <p className="mt-[16px] text-base font-medium text-primary-light">
                {studyDetail.search_tag.map((tag) => (
                  <span key={tag.id}>#{tag.name} </span>
                ))}
              </p>
            )}
          </div>
        </div>

        {/* 스터디 상태 카드 */}
        <div className="mx-4 mt-3">
          {/* 상태 바 */}
          <div className={`h-[60px] ${STATUS_BG_COLOR[studyDetail.study_status.name] ?? 'bg-primary'} rounded-t-xl px-[12px] pb-3 flex items-center gap-2`}>
            <SpeakerIcon className="h-5 w-5 text-background shrink-0" />
            <span className="text-background text-lg font-bold">
              {STATUS_DISPLAY[studyDetail.study_status.name] ?? studyDetail.study_status.name}
            </span>
          </div>
          {/* 흰색 콘텐츠 카드 */}
          <div className="rounded-xl border border-gray-300 bg-background -mt-4 relative z-10">
            <div className="px-[20px] py-[20px] flex flex-col gap-[16px]">
              <p className="text-xl font-bold text-surface text-center">스터디 일정</p>
              <div className="flex justify-between">
                {DAYS_ORDER.map((d) => {
                  const active = studyDetail.study_day.some(
                    (day: { name: string }) => day.name === d
                  );
                  return (
                    <div
                      key={d}
                      className={`w-[30px] h-[30px] flex items-center justify-center rounded-full text-base font-medium
                        ${active ? "bg-primary text-background" : "bg-gray-100 text-gray-500"}`}
                    >
                      {d}
                    </div>
                  );
                })}
              </div>
              <div className="h-[2px] bg-gray-300" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary">시작일</span>
                <span className="text-lg text-primary">{formatDate(studyDetail.start_date)}</span>
              </div>
              <div className="h-[2px] bg-gray-300" />
              <div className="flex flex-col gap-[4px]">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-surface">시간</span>
                  <span className="text-lg text-surface">
                    {studyDetail.start_time.slice(0, 5)} ~ {studyDetail.end_time.slice(0, 5)}
                  </span>
                </div>
                <p className="text-base text-gray-500 text-right">{studyDetail.term}주 진행</p>
              </div>
              <div className="h-[2px] bg-gray-300" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-surface">모집 인원</span>
                <span className="text-lg font-bold text-primary">
                  {studyDetail.participants.length}/{studyDetail.recruitment}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-2 bg-gray-100 mt-3" />

        <div className="bg-background px-[16px] py-[16px] flex flex-col gap-0">

          <section className="py-[20px]">
            <h2 className="text-2xl font-bold text-surface mb-[20px]">스터디 소개</h2>
            <p className="whitespace-pre-line text-lg text-surface leading-[24px]">
              {studyDetail.study_info}
            </p>
          </section>

          <div className="h-[2px] bg-gray-100 -mx-[16px]" />

          <section className="py-[20px]">
            <h2 className="text-2xl font-bold text-surface mb-[20px]">스터디 일정</h2>
            {studyDetail.schedule_info
              ? (
                <p className="whitespace-pre-line text-lg text-surface leading-[24px]">
                  {studyDetail.schedule_info}
                </p>
              )
              : <p className="text-base text-gray-300">일정 정보가 없습니다.</p>
            }
          </section>

          <div className="h-[2px] bg-gray-100 -mx-[16px]" />

          <section className="py-[20px]">
            <h2 className="text-2xl font-bold text-surface mb-[30px]">그룹장 소개</h2>
            <div className="flex gap-[14px] cursor-pointer" onClick={() => openModal('user-info', studyDetail.leader.id)}>
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-300">
                {leaderImgUrl
                  ? <img src={leaderImgUrl} alt={leaderProfile.nickname} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gray-100" />
                }
              </div>
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-[6px] flex-wrap">
                  <span className="text-base font-bold text-surface">{leaderProfile.nickname}</span>
                  <CrownIcon className="w-5 h-5 text-[#FFC533] flex-shrink-0" />
                  {leaderProfile.preferred_region && (
                    <span
                      className="bg-gray-100 text-surface rounded-full text-xs"
                      style={{ padding: "4px 10px 2px" }}
                    >
                      {leaderProfile.preferred_region.location}
                    </span>
                  )}
                </div>
                {leaderProfile.introduction && (
                  <div
                    className="bg-[#FFE187] px-[20px] py-[20px]"
                    style={{ borderRadius: "2px 20px 20px 20px" }}
                  >
                    <p className="text-lg text-surface leading-[24px]">
                      {leaderProfile.introduction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="h-[2px] bg-gray-100 -mx-[16px]" />

          {/* 그룹장에게 질문하기 */}
          <section className="py-[20px]">
            <h2 className="text-2xl font-bold text-surface mb-[20px]">그룹장에게 질문하기</h2>
            <CommentSection
              studyPk={studyDetail.id}
              leaderId={studyDetail.leader.id}
              currentUserId={myPk}
            />
          </section>

        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-background z-10">
          <div className="mx-auto flex h-[70px] max-w-[390px] items-center gap-2 px-4">
            {isLeader && (
              <button
                onClick={() => navigate(`/study/${studyId}/edit`)}
                className="flex h-[50px] w-[110px] items-center justify-center rounded-lg border border-gray-300 text-sm text-gray-700"
              >
                수정하기
              </button>
            )}
            {isJoined && !isLeader && (
              <button
                onClick={handleLeave}
                className="flex h-[50px] w-[110px] items-center justify-center rounded-lg border border-error text-sm text-error"
              >
                탈퇴하기
              </button>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: studyDetail.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("링크가 복사되었습니다.");
                }
              }}
              className={`flex h-[50px] items-center justify-center gap-2 rounded-lg border border-gray-300 text-sm text-gray-700 ${isLeader || isJoined ? "w-[50px]" : "w-[110px]"}`}>
              <ShareIcon className="w-4 h-4" />
              {!isLeader && !isJoined && "공유"}
            </button>
            <button
              onClick={handleLike}
              disabled={isLikeLoading}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-300"
            >
              {liked
                ? <HeartFillIcon className="w-5 h-5 text-error" />
                : <HeartIcon className="w-5 h-5 text-gray-500" />
              }
            </button>
            <button
              onClick={() => isJoined || isLeader ? navigate(`/chat/${studyId}`) : withAssociateGuard(handleJoinOrChat, 'associate-join')}
              disabled={!isJoined && !isLeader && isCompleted}
              className={`h-[50px] flex-1 rounded-lg font-medium text-sm ${!isJoined && !isLeader && isCompleted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-background"}`}
            >
              {isLeader || isJoined ? "채팅방 가기" : "참여하기"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}