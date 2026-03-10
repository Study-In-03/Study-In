import { useState, useEffect } from "react";
import { axiosInstance } from "../../../api/axios";
import { Study } from "../../../types/study";
import { normalizeStudy } from "@/utils/study";
import { DEFAULT_STUDY_TAB, type StudyTab } from "@/constants/study";

export const PAGE_SIZE = 8;

// activeTab → API study_status 파라미터 ID 매핑 (서버사이드 필터링)
const STATUS_MAP: Partial<Record<StudyTab, number>> = {
  "모집 중 스터디": 1,
  "진행 중 스터디": 3,
};

export const useStudyList = (
  category: string,
  searchTerm: string = "",
  activeTab: string = DEFAULT_STUDY_TAB,
  page: number = 1,
  locationId?: number,
) => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get("/study/", {
          params: {
            search: searchTerm || undefined,
            study_status: STATUS_MAP[activeTab as StudyTab] ?? undefined,
            page,
            limit: PAGE_SIZE,
            study_location: locationId ?? undefined,
          },
        });

        const raw = response.data;
        const results = Array.isArray(raw.results)
          ? raw.results
          : Array.isArray(raw)
            ? raw
            : [];

        const count = raw.count ?? results.length;
        setTotalCount(count);
        setStudies(results.map(normalizeStudy));

        const computed = Math.max(1, Math.ceil(count / PAGE_SIZE));
        // 현재 페이지 결과가 PAGE_SIZE보다 적으면 이 페이지가 마지막
        // 결과가 비어있고 page > 1이면 실제 마지막 페이지는 page-1
        const actual =
          results.length === 0 && page > 1
            ? page - 1
            : results.length > 0 && results.length < PAGE_SIZE
              ? page
              : computed;
        setTotalPages(actual);
      } catch (err: any) {
        // 404: 해당 페이지 없음 → 마지막 페이지를 page-1로 조정
        if (err.response?.status === 404 && page > 1) {
          setTotalPages(page - 1);
          setStudies([]);
          setError(null);
        } else {
          setError("스터디 목록을 불러오는 데 실패했습니다.");
          console.error("API Error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudies();
  }, [category, searchTerm, activeTab, page, locationId]);

  return { studies, isLoading, error, totalCount, totalPages };
};