import { useState, useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import { Study } from "../../../types/study";

// searchTerm(검색어) 매개변수 추가
export const useStudyList = (category: string, searchTerm: string = "") => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        setIsLoading(true);
        setError(null); // 새로운 요청 시 에러 초기화

        // 카테고리와 검색어를 함께 파라미터 전송
        const response = await axiosInstance.get("/study/", {
          params: { 
            category: category !== "all" ? category : undefined,
            search: searchTerm || undefined // 검색어가 있을 때만 포함
          },
        });

        // 서버 응답 구조가 { results: [...] } 인지 확인 후 저장
        // 만약 results가 없다면 response.data를 바로 사용하도록 안전장치 추가
        const data = response.data.results || response.data;
        setStudies(Array.isArray(data) ? data : []); 

      } catch (err) {
        setError("스터디 목록을 불러오는 데 실패했습니다.");
        console.error("API Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // 지금은 우선 직관적으로 category와 searchTerm이 바뀔 때마다 실행
    fetchStudies();
  }, [category, searchTerm]); // 의존성 배열에 searchTerm 추가

  return { studies, isLoading, error };
};