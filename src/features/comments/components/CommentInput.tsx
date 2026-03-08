import { useState } from "react";
import { useAssociateGuard } from "@/hooks/useAssociateGuard";
import IconSquareCheck from "@/assets/base/icon-square-Check.svg?react";
import IconSquareCheckFill from "@/assets/base/icon-square-Check-fill.svg?react";

interface CommentInputProps {
  onSubmit: (content: string, isSecret: boolean) => void;
  placeholder?: string;
  isRecomment?: boolean;
}

const CommentInput = ({
  onSubmit,
  placeholder = "다른 사람의 권리를 침해하거나 명예를 훼손하는 댓글은 관련 법률에 의해 제재를 받을 수 있습니다.",
  isRecomment = false,
}: CommentInputProps) => {
  const [content, setContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const MAX_LENGTH = 1000;
  const { withAssociateGuard } = useAssociateGuard();

  const handleSubmit = () => {
    if (!content.trim()) return;
    withAssociateGuard(() => {
      onSubmit(content, isSecret);
      setContent("");
      setIsSecret(false);
    });
  };

  return (
    <div className="flex flex-col">
      {/* textarea */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= MAX_LENGTH) setContent(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full px-4 pt-4 pb-2 text-base text-gray-900 placeholder:text-gray-500 resize-none focus:outline-none min-h-20 max-md:min-h-48"
        />
        {/* 웹: 글자수 + 비밀댓글 + 등록 버튼 */}
        <div className="hidden md:flex items-center justify-between border-t border-gray-300 px-4 py-2">
          <div className="flex items-center gap-2">
            {!isRecomment && (
              <>
                <button onClick={() => setIsSecret((prev) => !prev)}>
                  {isSecret ? (
                    <IconSquareCheckFill className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <IconSquareCheck className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                </button>
                <label
                  htmlFor="is_secret_web"
                  className="text-base text-gray-500 cursor-pointer"
                >
                  비밀댓글
                </label>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {content.length}/{MAX_LENGTH}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={`px-5 py-2 rounded text-base font-medium transition ${
                content.trim()
                  ? "bg-primary text-background"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            >
              등록
            </button>
          </div>
        </div>
      </div>

      {/* 글자수 - 모바일 */}
      <div className="md:hidden text-right text-sm text-gray-500 mt-1 pr-1">
        {content.length}/{MAX_LENGTH}
      </div>

      {/* 모바일: 비밀댓글 + 등록 고정 하단 바 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 flex items-center border-t border-gray-300 bg-background z-10">
        {!isRecomment && (
          <label className="flex items-center gap-2 flex-1 px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span
              className={`text-base font-medium ${isSecret ? "text-primary" : "text-gray-500"}`}
            >
              비밀댓글
            </span>
          </label>
        )}
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`px-8 py-3 text-base font-medium border-l border-gray-300 ${
            content.trim() ? "text-gray-700" : "text-gray-300"
          }`}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
