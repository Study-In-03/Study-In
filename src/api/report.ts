import { axiosInstance } from './axios'

export type ReportTargetType = 'study' | 'user' | 'comment' | 'recomment'

export interface CreateReportRequest {
  report_reason: number
  report_content: string
  reported_study?: number
  reported_user?: number
  reported_comment?: number
  reported_recomment?: number
}

export interface ReportListItem {
  id: number;
  user: { id: number; email: string };
  report_reason: string;
  report_content: string;
  reported_study: number | null;
  reported_user: number | null;
  reported_comment: number | null;
  reported_recomment: number | null;
}

export interface CreateReportResponse {
  id: number
  user: { id: number; email: string }
  report_reason: string
  report_content: string
  reported_study: number | null
  reported_user: number | null
  reported_comment: number | null
  reported_recomment: number | null
}

export const REPORT_REASONS = [
  { id: 1, label: '부적절한 홍보 게시글' },
  { id: 2, label: '욕설/반말/비방/부적절한 언어 사용' },
  { id: 3, label: '음란성/청소년에게 부적합한 내용' },
  { id: 4, label: '명예훼손/사생활/초상권/저작권 침해' },
  { id: 5, label: '도배성 게시물' },
  { id: 6, label: '악성코드' },
  { id: 7, label: '기타' },
]

export async function createReport(data: CreateReportRequest): Promise<CreateReportResponse> {
  const res = await axiosInstance.post<CreateReportResponse>('/report/', data)
  return res.data
}

export async function getReports(): Promise<ReportListItem[]> {
  const res = await axiosInstance.get<ReportListItem[]>('/report/');
  return res.data;
}