import { useState } from "react";
import type { Recomment } from "@/api/comment";
import { getFullUrl } from "@/api/upload";
import { useModalStore } from "@/store/modalStore";
import CommentArrowIcon from "@/assets/base/icon-comment-arrow.svg?react";
import CrownIcon from "@/assets/base/icon-crown-fill.svg?react";
import IconLock from "@/assets/base/icon-Lock.svg?react";
import DotsIcon from "@/assets/base/icon-dots.svg?react";
import withdrawnProfileImg from "@/assets/base/User-Profile-L.svg";
import { isNormalUser, isWithdrawnUser } from "@/api/comment";
import CommentInputField from "./CommentInputField";
import { formatDate } from "@/utils/date";

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
  leaderId: number;
  parentIsSecret?: boolean;
  showInput: boolean;
  onCloseInput: () => void;
  taggedUser?: TaggedUser;
  onRecommentReply?: (user: TaggedUser) => void;
}

const RecommentList = ({
  recomments,
  commentPk,
  onCreateRecomment,
  onUpdateRecomment,
  onDeleteRecomment,
  leaderId,
  parentIsSecret,
  showInput,
  onCloseInput,
  taggedUser,
  onRecommentReply,
}: RecommentListProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const { openConfirm, openModal } = useModalStore();

  const handleUpdate = (recommentPk: number, isSecret: boolean) => {
    if (!editContent.trim()) return;
    onUpdateRecomment(commentPk, recommentPk, editContent, isSecret);
    setEditingId(null);
  };

  const handleSubmitReply = () => {
    if (!replyInput.trim()) return;
    onCreateRecomment(commentPk, replyInput, parentIsSecret ?? false, taggedUser?.id);
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

        const nickname = isWithdrawnUser(recomment.user)
          ? "미지의 사용자"
          : recomment.user.profile.nickname;

        const profileImg = isWithdrawnUser(recomment.user)
          ? withdrawnProfileImg
          : isNormalUser(recomment.user)
            ? getFullUrl(recomment.user.profile.profile_img) || withdrawnProfileImg
            : withdrawnProfileImg;

        return (
          <div
            key={recomment.recomment_id}
            className="flex gap-[12px] mt-[1px]"
          >
            <CommentArrowIcon className="w-[22px] h-[26px] text-gray-300 flex-shrink-0 mt-2" />

            <div className="flex-1 min-w-0">
              <div className="flex gap-[10px] items-start">
                {/* 프로필 이미지 */}
                {recomment.is_secret && !isAuthor ? (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-100 border border-gray-300" />
                ) : !isWithdrawnUser(recomment.user) && isNormalUser(recomment.user) && !isAuthor ? (
                  <button
                    className="flex-shrink-0"
                    onClick={() => openModal('user-info', isNormalUser(recomment.user) ? recomment.user.id : undefined)}
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
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <span className="text-sm font-bold text-surface">
                            {nickname}
                          </span>
                          {isNormalUser(recomment.user) && recomment.user.id === leaderId && (
                            <CrownIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          )}
                        </span>
                        {isAuthor && (
                          <span className="text-xs text-primary border border-primary rounded px-2 py-1 leading-none">
                            내댓글
                          </span>
                        )}
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
                      <p className="text-xs text-gray-400 mt-[2px]">
                        {formatDate(recomment.created)}
                      </p>
                    </div>

                    {/* 모바일 전용: ⋮ 버튼 */}
                    <button
                      className="md:hidden flex-shrink-0"
                      onClick={() =>
                        openModal(
                          isAuthor ? 'comment-mine' : 'comment-other',
                          recomment.recomment_id,
                          undefined,
                          'recomment',
                          isAuthor ? () => {
                            setEditingId(recomment.recomment_id);
                            setEditContent(recomment.content);
                          } : undefined,
                          isAuthor ? () => onDeleteRecomment(commentPk, recomment.recomment_id) : undefined,
                        )
                      }
                    >
                      <DotsIcon className="w-5 h-5 text-gray-500" />
                    </button>

                    {/* 웹 전용: 수정/삭제/신고 (수정 중엔 취소/삭제) */}
                    <div className="hidden md:flex gap-3 flex-shrink-0">
                      {isAuthor ? (
                        <>
                          {editingId === recomment.recomment_id ? (
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-sm text-gray-500 underline"
                            >
                              취소
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(recomment.recomment_id);
                                setEditContent(recomment.content);
                              }}
                              className="text-sm text-gray-500 underline"
                            >
                              수정
                            </button>
                          )}
                          <button
                            onClick={() =>
                              openConfirm("delete", () =>
                                onDeleteRecomment(commentPk, recomment.recomment_id),
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
                            openModal('report', recomment.recomment_id, undefined, 'recomment')
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
                    <CommentInputField
                      value={editContent}
                      onChange={setEditContent}
                      onSubmit={() => handleUpdate(recomment.recomment_id, recomment.is_secret)}
                      placeholder="대댓글 수정하기"
                      className="mt-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-[10px]">
                      {recomment.is_secret && isAuthor && (
                        <IconLock className="w-4 h-4 text-primary-light flex-shrink-0" />
                      )}
                      {recomment.tagged_user && (
                        <span className="text-primary text-base font-medium flex-shrink-0">
                          @{recomment.tagged_user.nickname}
                        </span>
                      )}
                      <p className="text-base break-all text-surface">
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
        <div className="mt-[16px]">
          <CommentInputField
            value={replyInput}
            onChange={setReplyInput}
            onSubmit={handleSubmitReply}
            placeholder={parentIsSecret ? "비밀 답글을 입력하세요" : "답글을 입력하세요"}
            prefix={
              <>
                {parentIsSecret && (
                  <IconLock className="w-4 h-4 text-primary-light flex-shrink-0" />
                )}
                {taggedUser && (
                  <span className="text-primary text-base font-medium flex-shrink-0">
                    @{taggedUser.nickname}
                  </span>
                )}
              </>
            }
          />
        </div>
      )}
    </div>
  );
};

export default RecommentList;
