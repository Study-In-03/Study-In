import { useState } from "react";
import type { Recomment } from "@/api/comment";
//
import { getFullUrl } from "@/api/upload";
import { useModalStore } from "@/store/modalStore";
import CommentArrowIcon from "@/assets/base/icon-comment-arrow.svg?react";
import IconLock from "@/assets/base/icon-Lock.svg?react";
import withdrawnProfileImg from "@/assets/base/User-Profile-L.svg";
import { isNormalUser, isWithdrawnUser } from "@/api/comment";

interface TaggedUser {
  id: number;
  nickname: string;
}

interface RecommentListProps {
  recomments: Recomment[];
  commentPk: number;
  onCreateRecomment: (
    commentPk: number,
    content: string,
    isSecret: boolean,
    taggedUserId?: number,
  ) => void;
  onUpdateRecomment: (
    commentPk: number,
    recommentPk: number,
    content: string,
    isSecret: boolean,
  ) => void;
  onDeleteRecomment: (commentPk: number, recommentPk: number) => void;
  showInput: boolean;
  onCloseInput: () => void;
  taggedUser?: TaggedUser;
  onRecommentReply?: (user: TaggedUser) => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const RecommentList = ({
  recomments,
  commentPk,
  onCreateRecomment,
  onUpdateRecomment,
  onDeleteRecomment,
  showInput,
  onCloseInput,
  taggedUser,
  onRecommentReply,
}: RecommentListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const { openConfirm } = useModalStore();

  const handleUpdate = (recommentPk: number, isSecret: boolean) => {
    if (!editContent.trim()) return;
    onUpdateRecomment(commentPk, recommentPk, editContent, isSecret);
    setEditingId(null);
  };

  const handleSubmitReply = () => {
    if (!replyInput.trim()) return;
    onCreateRecomment(commentPk, replyInput, false, taggedUser?.id); // taggedUser?.id 추가
    setReplyInput("");
    onCloseInput();
  };

  return (
    <div className="mt-2">
      {recomments.map((recomment) => {
        const isAuthor =
          !isWithdrawnUser(recomment.user) &&
          isNormalUser(recomment.user) &&
          recomment.user.is_author;
        // 닉네임 추출

        const nickname = isWithdrawnUser(recomment.user)
          ? "탈퇴한 회원"
          : isNormalUser(recomment.user)
            ? recomment.user.profile.nickname
            : recomment.user.profile.nickname;

        // 프로필 이미지 추출
        const profileImg = isWithdrawnUser(recomment.user)
          ? withdrawnProfileImg
          : isNormalUser(recomment.user)
            ? getFullUrl(recomment.user.profile.profile_img) ||
              "/default-profile.png"
            : "/default-profile.png";
        return (
          <div
            key={recomment.recomment_id}
            className="flex gap-[12px] mt-[1px]"
          >
            {/* 화살표 아이콘 */}
            <CommentArrowIcon className="w-[22px] h-[26px] text-gray-300 flex-shrink-0 mt-2" />

            <div className="flex-1 min-w-0">
              <div className="flex gap-[10px]">
                {/* 프로필 이미지 */}
                {recomment.is_secret && !isAuthor ? (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-100 border border-gray-300" />
                ) : (
                  <img
                    src={profileImg}
                    alt={nickname}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-300"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      {/* 닉네임 + 날짜 */}
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-surface">
                          {nickname}
                        </span>
                        {isAuthor && (
                          <span className="text-xs text-primary border border-primary rounded px-2 py-1 leading-none">
                            내댓글
                          </span>
                        )}
                        {/* 타인 대댓글에만 답글달기 표시 (내 댓글, 비밀댓글 제외) */}
                        {!isAuthor && (
                          <button
                            onClick={() =>
                              onRecommentReply?.({
                                id: isNormalUser(recomment.user)
                                  ? recomment.user.id
                                  : 0,
                                nickname,
                              })
                            }
                            className="text-sm text-gray-500 underline"
                          >
                            답글달기
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-[2px]">
                        {formatDate(recomment.created)}
                      </p>
                    </div>

                    {/* 웹 전용: 수정/삭제/신고 */}
                    <div className="hidden md:flex gap-2 flex-shrink-0">
                      {isAuthor ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(recomment.recomment_id);
                              setEditContent(recomment.content);
                            }}
                            className="text-sm text-gray-500 underline"
                          >
                            수정
                          </button>
                          <button
                            onClick={() =>
                              openConfirm("delete", () =>
                                onDeleteRecomment(
                                  commentPk,
                                  recomment.recomment_id,
                                ),
                              )
                            }
                            className="text-sm text-gray-500 underline"
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            openConfirm("report", () => console.log("신고"))
                          }
                          className="text-sm text-gray-500 underline"
                        >
                          신고
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 내용 or 수정 입력창 */}
                  {editingId === recomment.recomment_id ? (
                    <div className="mt-1 flex items-center gap-2 border border-gray-300 rounded px-2 py-2">
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          handleUpdate(
                            recomment.recomment_id,
                            recomment.is_secret,
                          )
                        }
                        className="flex-1 text-base focus:outline-none min-w-0"
                      />
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-sm text-gray-500 underline flex-shrink-0"
                      >
                        취소
                      </button>
                      <button
                        onClick={() =>
                          handleUpdate(
                            recomment.recomment_id,
                            recomment.is_secret,
                          )
                        }
                        className="text-sm text-primary underline flex-shrink-0"
                      >
                        저장
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-[10px]">
                     {recomment.is_secret && isAuthor && (
                        <IconLock className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                      {recomment.tagged_user && (
                        <span className="text-primary text-base font-medium flex-shrink-0">
                          @{recomment.tagged_user.nickname}
                        </span>
                      )}
                      <p className="text-base break-all text-gray-700">
                        {recomment.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* 답글 입력창 */}
      {showInput && (
        <div className="flex gap-[12px] mt-[16px]">
          <CommentArrowIcon className="w-[22px] h-[26px] text-gray-300 flex-shrink-0 mt-2" />
          <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
            {taggedUser && (
              <span className="text-primary text-base font-medium flex-shrink-0">
                @{taggedUser.nickname}
              </span>
            )}
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
              placeholder="답글을 입력하세요"
              className="flex-1 text-base focus:outline-none"
              autoFocus
            />
            <button
              onClick={onCloseInput}
              className="text-sm text-gray-500 underline flex-shrink-0"
            >
              취소
            </button>
            <button
              onClick={handleSubmitReply}
              disabled={!replyInput.trim()}
              className={`text-sm underline flex-shrink-0 ${replyInput.trim() ? "text-primary" : "text-gray-300"}`}
            >
              등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommentList;
