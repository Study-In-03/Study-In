import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <p className="text-gray-600 text-sm mb-6 text-center">
          스터디를 만들어
          <br />
          사람들과 함께 공부할 수 있어요!
        </p>
        <button
          onClick={() => navigate("/create-study")} // 이동할 경로 설정
          className="w-full py-3 bg-primary text-white rounded-[8px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95"
        >
          스터디 만들기
        </button>
      </div>
    );
  }

  // 2. 로그인 후 (첫 번째 & 두 번째 사진 상황 공통 부분)
  return (
    <div className="flex flex-col gap-6 w-[280px]">
      {/* 상단 프로필 카드 영역 */}
      <div className="bg-blue-50/30 rounded-[12px] p-6 flex flex-col items-center border border-gray-100 shadow-sm">
        <div className="relative mb-4">
          <img
            src={userImage || "/assets/user-rabbit.png"}
            alt="프로필"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
          />
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-background rounded-full flex items-center justify-center shadow-sm">
            <img src="/assets/woniv-logo.png" alt="logo" className="w-6 h-6" />
          </div>
        </div>
        <h3 className="font-bold text-lg mb-6">{userName}</h3>
        <button className="w-full py-3 bg-primary text-white rounded-[8px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90">
          스터디 만들기
        </button>
      </div>

      {/* 하단 참여 중인 스터디 목록 영역 */}
      <div className="flex flex-col gap-3">
        <h4 className="font-bold text-lg">
          참여 중인 스터디{" "}
          <span className="text-primary">{studies.length}개</span>
        </h4>

        {studies.length > 0 ? (
          // 스터디가 있는 경우 (첫 번째 사진 상황)
          <div className="flex flex-col gap-2 p-4 bg-background border border-gray-100 rounded-[12px]">
            {studies.slice(0, 4).map((study) => (
              <div
                key={study.id}
                className="flex gap-3 py-2 border-b last:border-0 border-gray-50"
              >
                <img
                  src={study.image}
                  className="w-12 h-12 rounded-[8px] object-cover"
                  alt="스터디"
                />
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                    <span> {study.status}</span>
                    <span>({study.dDay})</span>
                  </div>
                  <p className="text-xs font-bold truncate">{study.title}</p>
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
