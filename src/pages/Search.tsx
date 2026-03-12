import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getStudies } from '@/api/study';
import { normalizeStudy } from '@/utils/study';
import StudyCard from '@/features/study/components/StudyCard';
import type { Study } from '@/types/study';

import SearchIcon from '@/assets/base/icon-Search.svg?react';
import LeftIcon from '@/assets/base/icon-left.svg?react';
import FilterIcon from '@/assets/base/icon-filter.svg?react';
import TriangleUpIcon from '@/assets/base/icon-Triangle-Up.svg?react';
import TriangleDownIcon from '@/assets/base/icon-Triangle-Down.svg?react';

const SUBJECTS = ['개념학습', '응용/활용', '프로젝트', '챌린지', '자격증/시험', '취업/코테', '기타', '특강'];
const DIFFICULTIES = ['초급', '중급', '고급'];
const TYPES = ['내지역', '온라인'];
const STATUSES = ['모집 중', '모집 완료', '진행 중', '완료'];
const DAY_MAP: Record<string, number> = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6, 일: 7 };
const SUBJECT_MAP: Record<string, number> = { '개념학습': 1, '응용/활용': 2, '프로젝트': 3, '챌린지': 4, '자격증/시험': 5, '취업/코테': 6, '기타': 7, '특강': 8 };
const DIFFICULTY_MAP: Record<string, number> = { '초급': 1, '중급': 2, '고급': 3 };
const STATUS_MAP: Record<string, number> = { '모집 중': 1, '모집 완료': 2, '진행 중': 3, '완료': 4 };

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-[14px] h-[32px] rounded-full text-base font-regular leading-5 whitespace-nowrap transition-colors ${
        selected ? 'bg-primary-light text-background' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 md:gap-5 py-[10px] md:py-[14px]">
      <span className="text-sm font-bold text-gray-700 w-[34px] shrink-0 pt-[6px]">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const delta = 2;
  const left = Math.max(1, page - delta);
  const right = Math.min(totalPages, page + delta);
  const pages: number[] = [];
  for (let i = left; i <= right; i++) pages.push(i);

  const btnBase = 'w-9 h-9 flex items-center justify-center rounded-full text-base transition-colors';

  return (
    <div className="flex justify-center items-center gap-1 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} text-gray-500 disabled:opacity-30`}
      >
        &lt;
      </button>

      {left > 1 && (
        <button onClick={() => onChange(1)} className={`${btnBase} text-surface hover:bg-gray-100`}>1</button>
      )}
      {left > 2 && <span className="w-9 h-9 flex items-center justify-center text-gray-500">…</span>}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`${btnBase} ${p === page ? 'bg-primary text-background font-bold' : 'text-surface hover:bg-gray-100'}`}
        >
          {p}
        </button>
      ))}

      {right < totalPages - 1 && <span className="w-9 h-9 flex items-center justify-center text-gray-500">…</span>}
      {right < totalPages && (
        <button onClick={() => onChange(totalPages)} className={`${btnBase} text-surface hover:bg-gray-100`}>{totalPages}</button>
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} text-gray-500 disabled:opacity-30`}
      >
        &gt;
      </button>
    </div>
  );
}

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialQuery = searchParams.get('q') || '';
  const initialType = location.pathname.startsWith('/local') ? '내지역'
    : location.pathname.startsWith('/online') ? '온라인' : '';

  const initialSubject = searchParams.get('subject') || '';

  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [filterOpen, setFilterOpen] = useState(false);

  const [subjects, setSubjects] = useState<string[]>(initialSubject ? [initialSubject] : []);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>(initialType ? [initialType] : []);
  const [statuses, setStatuses] = useState<string[]>([]);

  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(12);

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchResults = async (params: {
    q: string;
    subjects: string[];
    difficulties: string[];
    days: string[];
    types: string[];
    statuses: string[];
    page: number;
  }) => {
    setIsLoading(true);
    setSearched(true);
    try {
      const urlParams = new URLSearchParams();
      if (params.q) urlParams.append('search', params.q);
      params.subjects.forEach((s) => urlParams.append('subject', String(SUBJECT_MAP[s])));
      params.difficulties.forEach((d) => urlParams.append('difficulty', String(DIFFICULTY_MAP[d])));
      params.days.forEach((d) => urlParams.append('study_day', String(DAY_MAP[d])));
      if (params.types.length === 1) urlParams.append('offline', params.types[0] === '내지역' ? '1' : '0');
      params.statuses.forEach((s) => urlParams.append('study_status', String(STATUS_MAP[s])));
      urlParams.append('page', String(params.page));

      const res = await getStudies(Object.fromEntries(urlParams));
      const raw = res.results ?? [];
      setTotalCount(res.count ?? 0);
      if (res.count && raw.length > 0) setPageSize(raw.length);
      setStudies(raw.map(normalizeStudy));
    } catch {
      setStudies([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setInputValue(initialQuery);
    setQuery(initialQuery);
    const t = initialType ? [initialType] : [];
    setTypes(t);
    const s = initialSubject ? [initialSubject] : [];
    setSubjects(s);
    setPage(1);
    if (initialQuery || initialSubject) {
      fetchResults({ q: initialQuery, subjects: s, difficulties: [], days: [], types: t, statuses: [], page: 1 });
    }
  }, [initialQuery, initialType, initialSubject]);

  const handleSearch = () => {
    setQuery(inputValue);
    setPage(1);
    fetchResults({ q: inputValue, subjects, difficulties, days, types, statuses, page: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleReset = () => {
    setSubjects([]);
    setDifficulties([]);
    setDays([]);
    setTypes([]);
    setStatuses([]);
  };

  const handleApplyFilter = () => {
    setFilterOpen(false);
    setPage(1);
    fetchResults({ q: query, subjects, difficulties, days, types, statuses, page: 1 });
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchResults({ q: query, subjects, difficulties, days, types, statuses, page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-[768px] mx-auto px-4 pb-10 md:max-w-[1190px] md:px-0 md:pt-[30px]">
      {/* 검색바 */}
      <div className="flex items-center gap-3 py-4 md:hidden">
        <button onClick={() => navigate(-1)} className="shrink-0 p-1">
          <LeftIcon className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center h-11 px-4 border-2 border-gray-300 rounded-full gap-2 bg-background">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="어떤 스터디를 찾고 계신가요?"
            className="flex-1 text-sm outline-none bg-transparent text-surface placeholder:text-gray-500"
          />
          <button onClick={handleSearch}>
            <SearchIcon className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>

      {/* 필터 토글 버튼 */}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-3 w-[170px] h-[40px] rounded-[8px] bg-background text-base font-medium text-gray-700 transition-colors ${
            filterOpen ? 'border border-primary' : 'border border-gray-300'
          }`}
        >
          <FilterIcon className="w-5 h-5" />
          <span>검색 필터</span>
            {filterOpen ? <TriangleUpIcon className="w-[18px] h-[18px] ml-auto" /> : <TriangleDownIcon className="w-[18px] h-[18px] ml-auto" />}
        </button>
      </div>

      {/* 필터 패널 */}
      {filterOpen && (
        <div className="border border-gray-300 rounded-[12px] p-[14px] mb-6 bg-background h-[460px] overflow-hidden md:h-[360px] md:pt-[10px] md:pl-[30px] md:pb-[30px] md:mb-[30px]">
          <FilterRow label="주제">
            {SUBJECTS.map((s) => (
              <Chip key={s} label={s} selected={subjects.includes(s)} onClick={() => toggle(subjects, setSubjects, s)} />
            ))}
          </FilterRow>
          <FilterRow label="난이도">
            {DIFFICULTIES.map((d) => (
              <Chip key={d} label={d} selected={difficulties.includes(d)} onClick={() => toggle(difficulties, setDifficulties, d)} />
            ))}
          </FilterRow>
          <FilterRow label="요일">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                {['월', '화', '수', '목', '금'].map((d) => (
                  <Chip key={d} label={d} selected={days.includes(d)} onClick={() => toggle(days, setDays, d)} />
                ))}
              </div>
              <div className="flex gap-2">
                {['토', '일'].map((d) => (
                  <Chip key={d} label={d} selected={days.includes(d)} onClick={() => toggle(days, setDays, d)} />
                ))}
              </div>
            </div>
          </FilterRow>
          <FilterRow label="유형">
            {TYPES.map((t) => (
              <Chip key={t} label={t} selected={types.includes(t)} onClick={() => toggle(types, setTypes, t)} />
            ))}
          </FilterRow>
          <div className="flex flex-col md:flex-row md:items-center gap-2 py-[10px] md:py-0">
            <div className="flex items-start gap-2 md:gap-5 flex-1">
              <span className="text-sm font-bold text-gray-700 w-[34px] shrink-0 pt-[6px]">상태</span>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <Chip key={s} label={s} selected={statuses.includes(s)} onClick={() => toggle(statuses, setStatuses, s)} />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-[10px] mt-[14px] md:mt-0 md:shrink-0">
              <button
                onClick={handleReset}
                className="w-[100px] h-[40px] border border-gray-300 rounded-[8px] text-base font-medium text-surface bg-background"
              >
                초기화
              </button>
              <button
                onClick={handleApplyFilter}
                className="w-[160px] h-[40px] bg-primary text-background rounded-[8px] text-base font-medium"
              >
                필터 적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 검색 결과 */}
      {searched && (
        <>
          <h2 className="text-3xl font-bold mb-4">
            {query ? (
              <><span className="text-primary">{query}</span> 검색결과</>
            ) : subjects.length > 0 ? (
              <><span className="text-primary">{subjects[0]}</span> 카테고리 검색결과</>
            ) : (
              <>검색결과</>
            )}
          </h2>

          {isLoading ? (
            <p className="text-center text-gray-500 py-16">검색 중입니다...</p>
          ) : studies.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-[20px]">
              <div className="flex flex-col items-center gap-[10px]">
                <p className="text-xl font-bold text-gray-700 text-center">
                  <span className="text-error">{query || subjects[0] || ''}</span>에 대한 검색결과가 없습니다.
                </p>
                <p className="text-lg font-regular text-gray-700 text-center">원하시는 스터디가 없나요? 스터디를 직접 만들어 보세요!</p>
              </div>
              <button
                onClick={() => navigate('/study/create')}
                className="w-[250px] h-[50px] bg-primary text-background rounded-[8px] text-lg font-medium"
              >
                스터디 만들기
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-6 md:px-4">
                {studies.map((study) => (
                  <StudyCard key={study.id} study={study} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
            </>
          )}
        </>
      )}
    </main>
  );
}
