import { useNavigate } from "react-router-dom";
import useComments from "../hooks/useComments";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  studyPk: number;
  leaderId?: number;
}

const CommentSection = ({ studyPk, leaderId }: CommentSectionProps) => {
  const navigate = useNavigate();
  const {
    comments,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateRecomment,
    handleUpdateRecomment,
    handleDeleteRecomment,
  } = useComments(studyPk);

  return (
    <div>
      {/* 웹: 댓글 입력창 */}
      <div className="hidden md:block mb-4">
        <CommentInput onSubmit={handleCreate} />
      </div>
      {/* 모바일: 작성하기 버튼 */}
      <button
        onClick={() => navigate(`/study/${studyPk}/comment/write`)}
        className="md:hidden w-full h-10 border border-gray-300 rounded-[8px] text-base font-medium text-surface text-center mb-[30px]"
      >
        작성하기
      </button>
      {error && <p className="text-sm text-error mt-2">{error}</p>}
      <div>
        {loading ? (
          <p className="text-base text-gray-500">댓글을 불러오는 중...</p>
        ) : comments.length === 0 ? (
          <p className="text-base text-gray-500 py-4">
            아직 댓글이 없어요. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              leaderId={leaderId}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onCreateRecomment={handleCreateRecomment}
              onUpdateRecomment={handleUpdateRecomment}
              onDeleteRecomment={handleDeleteRecomment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;