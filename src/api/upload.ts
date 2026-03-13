import { axiosInstance } from "./axios";

// 이미지 업로드 응답 타입
interface ImageUploadResponse {
  detail: string;
  image_url: string;
}

// 파일 업로드 응답 타입
interface FileUploadResponse {
  detail: string;
  file_url: string;
}

/**
 * 이미지 업로드 함수
 * - 지원 형식: JPG, JPEG, PNG, GIF, BMP, TIFF, WebP, ICO
 * - 최대 용량: 5MB
 * - 업로드 후 가로 900px로 자동 리사이징 (비율 유지)
 * @param file 업로드할 이미지 파일
 * @returns 업로드된 이미지 URL
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosInstance.post<ImageUploadResponse>(
    "/file-uploader/image/",  // baseURL이 있으므로 경로만
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.image_url;
};

/**
 * 파일 업로드 함수 (이미지 제외)
 * - 이미지를 제외한 모든 파일 업로드 가능
 * - 최대 용량: 5MB
 * @param file 업로드할 파일
 * @returns 업로드된 파일 URL
 */
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<FileUploadResponse>(
    "/file-uploader/file/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.file_url;
};

/**
 * 이미지 URL을 전체 URL로 변환
 * API가 /media/... 형태의 상대 경로를 반환하므로 전체 URL로 변환
 * @param path API에서 반환된 이미지/파일 경로
 * @returns 전체 URL
 */
export const getFullUrl = (path: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_BASE_URL}${path}`;
};