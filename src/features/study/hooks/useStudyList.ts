import { useState, useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import { Study } from "../../../types/study";

// fix: activeTab → API study_status 파라미터 ID 매핑
const STATUS_MAP: Record<string, number> = {
  "모집 중 스터디": 1,
  "진행 중 스터디": 3,
};

export const useStudyList = (category: string, searchTerm: string = "", activeTab: string = "최신 스터디") => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // fix1: category는 API 미지원 파라미터 → 제거
        // fix2: study_status 필터를 서버에서 처리 (클라이언트 filter() 제거)
        const response = await axiosInstance.get("/study/", {
          params: {
            search: searchTerm || undefined,
            study_status: STATUS_MAP[activeTab] ?? undefined,
          },
        });

        const data = response.data.results || response.data;
        const rawStudies: Study[] = Array.isArray(data) ? data : [];

        setStudies(rawStudies);
      } catch (err) {
        setError("스터디 목록을 불러오는 데 실패했습니다.");
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudies();
  }, [category, searchTerm, activeTab]);

  return { studies, isLoading, error };
};