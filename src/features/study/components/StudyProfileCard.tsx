import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IconSpeaker from "@/assets/base/icon-speaker.svg?react";
import { STATUS_COLOR } from "@/constants/study";
import defaultProfile from "@/assets/base/Ellipse 46.svg";

interface Study {
  id: number;
  title: string;
  status: "진행 중" | "모집 중";
  dDay: string;
  image: string;
}

interface StudyProfileCardProps {
  isLoggedIn: boolean;
  userName?: string;
  userImage?: string;
  studies?: Study[];
}

export default function StudyProfileCard({
  isLoggedIn,
  userName = "파이썬 연금술사",
  userImage, // assets에서 가져온 토끼 이미지 경로
  studies = [],
}: StudyProfileCardProps) {
  const navigate = useNavigate();
  // 1. 로그인 이전 (세 번째 사진 상황)
  if (!isLoggedIn) {
    return (
      <div className="w-[280px] h-[300px] bg-gray-50 rounded-[12px] flex flex-col items-center justify-center p-6 border border-gray-100">
        <img src={defaultProfile} alt="프로필" className="w-20 h-20 rounded-full mb-4 object-cover" />
        <p className="text-gray-600 text-sm mb-6 text-center">
          스터디를 만들어
          <br />
          사람들과 함께 공부할 수 있어요!
        </p>
        <button
          onClick={() => navigate("/study/create")}
          className="w-full py-3 bg-primary text-white rounded-[8px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95"
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
      <div className="bg-blue-50/30 rounded-[12px] p-6 flex flex-col items-center border border-gray-100 shadow-sm">
        <div className="relative mb-4">
          <img
            src={userImage || defaultProfile}
            alt="프로필"
            className="w-[100px] h-[100px] rounded-full object-cover border-4 border-white shadow-sm"
          />
        </div>
        <h3 className="font-bold text-lg mb-6">{userName}</h3>
        <button
          onClick={() => navigate("/study/create")}
          className="w-full py-3 bg-primary text-white rounded-[8px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90"
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
          <div className="flex flex-col gap-2 p-4 bg-background border border-gray-100 rounded-[12px]">
            {studies.map((study) => (
              <div
                key={study.id}
                className="flex gap-3 py-2 border-b last:border-0 border-gray-50"
              >
                <img
                  src={study.image}
                  className="w-[60px] h-[60px] rounded-[8px] object-cover shrink-0"
                  alt="스터디"
                />
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="flex items-center gap-1 font-medium">
                    <IconSpeaker className={`w-3 h-3 shrink-0 ${STATUS_COLOR[study.status] ?? "text-gray-400"}`} />
                    <span className={`text-[12px] ${STATUS_COLOR[study.status] ?? "text-gray-400"}`}>
                      {study.status === "모집 중" ? "모집 중!" : study.status}
                      {study.dDay && ` (${study.dDay})`}
                    </span>
                  </div>
                  <p className="text-[14px] font-medium truncate">{study.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 스터디가 없는 경우 (두 번째 사진 상황)
          <div className="py-10 text-center bg-background border border-dashed border-gray-200 rounded-[12px]">
            <p className="text-gray-400 text-sm">
              아직 참여 중인 스터디가 없어요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
