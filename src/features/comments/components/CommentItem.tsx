import { useState } from "react";
import type { Comment } from "@/api/comment";
import { getFullUrl } from "@/api/upload";
import { useModalStore } from "@/store/modalStore";
import IconLock from "@/assets/base/icon-Lock.svg?react";
import DotsIcon from "@/assets/base/icon-dots.svg?react";
import RecommentList from "./RecommentList";
import { isNormalUser, isWithdrawnUser } from "@/api/comment";
import withdrawnProfileImg from "@/assets/base/User-Profile-L.svg";

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentPk: number, content: string, isSecret: boolean) => void;
  onDelete: (commentPk: number) => void;
  onCreateRecomment: (
    commentPk: number,
    content: string,
    isSecret: boolean,
  ) => void;
  onUpdateRecomment: (
    commentPk: number,
    recommentPk: number,
    content: string,
    isSecret: boolean,
  ) => void;
  onDeleteRecomment: (commentPk: number, recommentPk: number) => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const CommentItem = ({
  comment,
  onUpdate,
  onDelete,
  onCreateRecomment,
  onUpdateRecomment,
  onDeleteRecomment,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editIsSecret, setEditIsSecret] = useState(comment.is_secret ?? false);
  const [showRecommentInput, setShowRecommentInput] = useState(false);
  const [taggedUser, setTaggedUser] = useState<
    { id: number; nickname: string } | undefined
  >(undefined);
  const { openConfirm, openModal } = useModalStore();

  const isDeleted = !!comment.is_delete;
  const isAuthor =
    !!comment.user &&
    !isWithdrawnUser(comment.user) &&
    isNormalUser(comment.user) &&
    comment.user.is_author;

  // 닉네임 추출
  const nickname = comment.user
    ? isWithdrawnUser(comment.user)
      ? "탈퇴한 회원"
      : isNormalUser(comment.user)
        ? comment.user.profile.nickname
        : comment.user.profile.nickname
    : "익명";

  const profileImg =
    comment.user && !isWithdrawnUser(comment.user) && isNormalUser(comment.user)
      ? getFullUrl(comment.user.profile.profile_img) || withdrawnProfileImg
      : comment.user && isWithdrawnUser(comment.user)
        ? withdrawnProfileImg
        : withdrawnProfileImg;

  const handleUpdate = () => {
    if (!editContent.trim()) return;
    onUpdate(comment.id, editContent, editIsSecret ?? false);
    setIsEditing(false);
  };

  return (
    <div className="py-[10px]">
      <div className="flex gap-[10px]">
        {comment.is_secret && !isAuthor ? (
          <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-100 border border-gray-300" />
        ) : !isWithdrawnUser(comment.user!) && isNormalUser(comment.user!) && !isAuthor ? (
          <button
            className="flex-shrink-0"
            onClick={() => openModal('user-info', comment.user && isNormalUser(comment.user) ? comment.user.id : undefined)}
          >
            <img
              src={profileImg}
              alt={nickname}
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          </button>
        ) : (
          <img
            src={profileImg}
            alt={nickname}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-300"
          />
        )}

        <div className="flex-1 min-w-0">
          {/* 모바일 */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[10px]">
                <span
                  className={`text-base font-bold ${isDeleted ? "text-gray-500" : "text-surface"}`}
                >
                  {nickname}
                </span>
                {!isDeleted && (
                  <button
                    onClick={() => {
                      setTaggedUser(undefined);
                      setShowRecommentInput((prev) => !prev);
                    }}
                    className="text-base text-gray-500 underline"
                  >
                    답글달기
                  </button>
                )}
              </div>
              {!isDeleted && (
                <button
                  onClick={() =>
                    openModal(
                      isAuthor ? 'comment-mine' : 'comment-other',
                      comment.id,
                      undefined,
                      'comment',
                      isAuthor ? () => setIsEditing(true) : undefined,
                      isAuthor ? () => onDelete(comment.id) : undefined,
                    )
                  }
                >
                  <DotsIcon className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-[2px]">
              {comment.created ? formatDate(comment.created) : ""}
            </p>
          </div>

          {/* 웹 */}
          <div className="hidden md:flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-base font-bold ${isDeleted ? "text-gray-500" : "text-surface"}`}
              >
                {nickname}
              </span>
              {isAuthor && (
                <span className="text-xs text-primary border border-primary rounded px-2 py-1 leading-none">
                  내댓글
                </span>
              )}
              {!isDeleted && (
                <button
                  onClick={() => {
                    setTaggedUser(undefined);
                    setShowRecommentInput((prev) => !prev);
                  }}
                  className="text-sm text-gray-500 underline"
                >
                  답글달기
                </button>
              )}
            </div>
            {!isDeleted && (
              <div className="flex items-center gap-3 flex-shrink-0">
                {isAuthor ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-gray-500 underline"
                    >
                      수정
                    </button>
                    <button
                      onClick={() =>
                        openConfirm("delete", () => onDelete(comment.id))
                      }
                      className="text-sm text-gray-500 underline"
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() =>
                      openModal('report', comment.id, undefined, 'comment')
                    }
                    className="text-sm text-gray-500 underline"
                  >
                    신고
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 웹 날짜 */}
          <p className="hidden md:block text-sm text-gray-500 mt-1">
            {comment.created ? formatDate(comment.created) : ""}
          </p>

          {/* 내용 or 수정 입력창 */}
          {isEditing ? (
            <div className="mt-2 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                className="flex-1 text-base focus:outline-none"
              />
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-gray-500 underline"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdate}
                  className="text-sm text-primary underline"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-[10px]">
              {comment.is_secret && isAuthor && (
                <IconLock className="w-4 h-4 text-primary flex-shrink-0" />
              )}
              <p className="text-base break-all text-gray-700">
                {isDeleted ? "삭제된 댓글입니다." : comment.content}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 대댓글 */}
      {((comment.recomments && comment.recomments.length > 0) ||
        showRecommentInput) && (
        <RecommentList
          recomments={comment.recomments ?? []}
          commentPk={comment.id}
          onCreateRecomment={onCreateRecomment}
          onUpdateRecomment={onUpdateRecomment}
          onDeleteRecomment={onDeleteRecomment}
          showInput={showRecommentInput}
          onCloseInput={() => setShowRecommentInput(false)}
          taggedUser={taggedUser}
          onRecommentReply={(user) => {
            setTaggedUser(user);
            setShowRecommentInput(true);
          }}
        />
      )}
    </div>
  );
};

export default CommentItem;
