import { useState, useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import { Study } from "../../../types/study";

// 1. activeTab 매개변수를 추가했습니다.
export const useStudyList = (category: string, searchTerm: string = "", activeTab: string = "최신 스터디") => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 카테고리와 검색어를 파라미터로 전송
        const response = await axiosInstance.get("/study/", {
          params: { 
            category: category !== "all" ? category : undefined,
            search: searchTerm || undefined 
          },
        });

        const data = response.data.results || response.data;
        const rawStudies = Array.isArray(data) ? data : [];

        // 2. activeTab에 따른 프론트엔드 필터링 로직 추가
        // 서버에서 필터링된 데이터를 주지 않더라도 프론트에서 즉시 대응합니다.
        const filteredData = rawStudies.filter((study: Study) => {
          if (activeTab === "최신 스터디") return true;
          if (activeTab === "모집 중 스터디") return study.status === "모집 중";
          if (activeTab === "진행 중 스터디") return study.status === "진행 중";
          return true;
        });

        setStudies(filteredData); 

      } catch (err) {
        setError("스터디 목록을 불러오는 데 실패했습니다.");
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudies();
    // 3. activeTab이 바뀔 때마다 필터링이 다시 일어나도록 의존성 배열에 추가합니다.
  }, [category, searchTerm, activeTab]); 

  return { studies, isLoading, error };
};