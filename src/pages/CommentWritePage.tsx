import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment } from "@/api/comment";
import IconSquareCheck from "@/assets/base/icon-square-Check.svg?react";
import IconSquareCheckFill from "@/assets/base/icon-square-Check-fill.svg?react";
import Header from "@/components/layout/Header";

const CommentWritePage = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const MAX_LENGTH = 1000;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await createComment(Number(studyId), { content, is_secret: isSecret });
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      {/* textarea */}
      <div className="flex-1 px-4 pt-4">
        <div className="border border-gray-300 rounded-lg overflow-hidden h-72">
          <textarea
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTH)
                setContent(e.target.value);
            }}
            placeholder="다른 사람의 권리를 침해하거나 명예를 훼손하는 댓글은 관련 법률에 의해 제재를 받을 수 있습니다."
            className="w-full h-full px-4 pt-4 pb-2 text-base text-gray-700 placeholder:text-gray-500 resize-none focus:outline-none"
            autoFocus
          />
        </div>
        <p className="text-right text-sm text-gray-500 mt-1 pr-1">
          {content.length}/{MAX_LENGTH}
        </p>
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center border-t border-gray-300 bg-background">
        <label className="flex items-center gap-2 flex-1 px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSecret}
            onChange={(e) => setIsSecret(e.target.checked)}
            className="hidden"
          />
          {isSecret ? (
            <IconSquareCheckFill className="w-5 h-5 text-primary flex-shrink-0" />
          ) : (
            <IconSquareCheck className="w-5 h-5 text-gray-300 flex-shrink-0" />
          )}
          <span
            className={`text-base font-medium ${isSecret ? "text-primary" : "text-gray-500"}`}
          >
            비밀댓글
          </span>
        </label>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="px-8 py-3 text-base font-medium border-l border-gray-300 text-gray-900"
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommentWritePage;
