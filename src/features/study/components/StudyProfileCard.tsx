import { useNavigate } from "react-router-dom";
import IconSpeaker from "@/assets/base/icon-speaker.svg?react";
import { STATUS_COLOR } from "@/constants/study";
import defaultProfile from "@/assets/base/icon-empty-profile.svg";
import { useModalStore } from "@/store/modalStore";

interface Study {
  id: number;
  title: string;
  status: string;
  dDay: string;
  image: string;
}

interface StudyProfileCardProps {
  isLoggedIn: boolean;
  userName?: string;
  userImage?: string;
  userId?: number;
  studies?: Study[];
}

export default function StudyProfileCard({
  isLoggedIn,
  userName,
  userImage,
  userId,
  studies = [],
}: StudyProfileCardProps) {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  // 로그인 이전 (세 번째 사진 상황)
  if (!isLoggedIn) {
    return (
      <div className="w-[280px] h-[300px] bg-gray-100 rounded-xl flex flex-col items-center justify-center p-6 border border-gray-100">
        <img src={defaultProfile} alt="프로필" className="w-20 h-20 rounded-full mb-4 object-cover" />
        <p className="text-gray-700 text-sm mb-6 text-center">
          스터디를 만들어
          <br />
          사람들과 함께 공부할 수 있어요!
        </p>
        <button
          onClick={() => navigate("/study/create")}
          className="w-full py-3 bg-primary text-background rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all active:scale-95"
        >
          스터디 만들기
        </button>
      </div>
    );
  }

  // 2. 로그인 후 (첫 번째 & 두 번째 사진 상황 공통 부분)
  return (
    <div className="flex flex-col gap-6 w-[290px]">
      {/* 상단 프로필 카드 영역 */}
      <div className="bg-activation/30 rounded-xl p-6 flex flex-col items-center border border-gray-100 shadow-sm">
        <div className="relative mb-4">
          <img
            src={userImage || defaultProfile}
            alt="프로필"
            onClick={() => userId && openModal('user-info', userId)}
            className="w-[100px] h-[100px] rounded-full object-cover border-4 border-background shadow-sm cursor-pointer"
          />
        </div>
        <h3 className="font-bold text-lg mb-6">{userName}</h3>
        <button
          onClick={() => navigate("/study/create")}
          className="w-full py-3 bg-primary text-background rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-light"
        >
          스터디 만들기
        </button>
      </div>

      {/* 하단 참여 중인 스터디 목록 영역 */}
      <div className="flex flex-col gap-3">
        <h4 className="font-bold text-2xl">
          참여 중인 스터디{" "}
          <span className="text-primary">{studies.length}개</span>
        </h4>

        {studies.length > 0 ? (
          // 스터디가 있는 경우 (첫 번째 사진 상황)
          <div className="flex flex-col gap-2 p-4 bg-background border border-gray-100 rounded-xl">
            {studies.map((study) => (
              <div
                key={study.id}
                className="flex gap-3 py-2 border-b last:border-0 border-gray-100"
              >
                <img
                  src={study.image}
                  className="w-[60px] h-[60px] rounded-lg object-cover shrink-0"
                  alt="스터디"
                />
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="flex items-center gap-1 font-medium">
                    <IconSpeaker className={`w-3 h-3 shrink-0 ${STATUS_COLOR[study.status] ?? "text-gray-500"}`} />
                    <span className={`text-sm ${STATUS_COLOR[study.status] ?? "text-gray-500"}`}>
                      {study.status === "모집 중" ? "모집 중!" : study.status}
                      {study.dDay && ` (${study.dDay})`}
                    </span>
                  </div>
                  <p className="text-base font-medium truncate">{study.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 스터디가 없는 경우 (두 번째 사진 상황)
          <div className="py-10 text-center bg-background border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500 text-sm">
              아직 참여 중인 스터디가 없어요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
