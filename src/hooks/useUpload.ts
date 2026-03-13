import { useState } from "react";
import { uploadImage, uploadFile } from "../api/upload";

interface UseUploadReturn {
  uploading: boolean;
  error: string | null;
  handleImageUpload: (file: File) => Promise<string | null>;
  handleFileUpload: (file: File) => Promise<string | null>;
}

/**
 * 파일/이미지 업로드 커스텀 훅
 * 팀원들(주현-썸네일, 하리-프로필, 수민-채팅)이 공통으로 사용
 *
 * 사용 예시:
 * const { uploading, handleImageUpload } = useUpload();
 * const url = await handleImageUpload(file);
 */
const useUpload = (): UseUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    // 5MB 제한 체크
    if (file.size > 5 * 1024 * 1024) {
      setError("이미지 크기는 5MB를 초과할 수 없습니다.");
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadImage(file);
      return url;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.";
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    // 5MB 제한 체크
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기가 5MB를 초과합니다.");
      return null;
    }

    // 이미지 파일 차단 (파일 업로드 API는 이미지 불가)
    if (file.type.startsWith("image/")) {
      setError("이미지 파일은 이미지 업로드를 이용해주세요.");
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadFile(file);
      return url;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "파일 업로드에 실패했습니다.";
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, handleImageUpload, handleFileUpload };
};

export default useUpload;