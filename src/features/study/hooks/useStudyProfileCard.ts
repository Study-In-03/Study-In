// 새로 추가 — src/features/study/hooks/useStudyProfileCard.ts

import { useState, useEffect } from "react";
import { getProfile } from "@/api/profile";
import { getParticipatingStudies, type StudyApiData } from "@/api/study";
import { useAuthStore } from "@/store/authStore";
import { storage } from "@/utils/storage";

interface StudyProfileCardData {
  userName: string;
  userImage: string;
  studies: StudyApiData[];
  isLoading: boolean;
}

export function useStudyProfileCard(): StudyProfileCardData {
  const { isLoggedIn } = useAuthStore();
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [studies, setStudies] = useState<StudyApiData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const userId = storage.getUserId();
    if (!userId) return;

    setIsLoading(true);

    Promise.all([
      getProfile(userId),
      getParticipatingStudies(),
    ])
      .then(([profile, participatingStudies]) => {
        setUserName(profile.nickname);
        setUserImage(profile.profile_img ?? "");
        // 진행 중(3) + 모집 중(1) 상태만 표시, 최대 5개
        setStudies(
          participatingStudies
            .filter((s) => [1, 3].includes(s.study_status?.id))
            .slice(0, 5)
        );
      })
      .catch(() => {
        // 실패 시 빈 상태 유지
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoggedIn]);

  return { userName, userImage, studies, isLoading };
}