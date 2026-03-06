import { useState, useEffect } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  createRecomment,
  updateRecomment,
  deleteRecomment,
  type Comment,
} from "@/api/comment";

const useComments = (studyPk: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComments(studyPk);
      setComments(data);
    } catch (err) {
      setError("댓글을 불러오는 데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (content: string, isSecret: boolean = false) => {
    if (!content.trim()) return;
    try {
      const newComment = await createComment(studyPk, {
        content,
        is_secret: isSecret,
      });
      setComments((prev) => [...prev, newComment]);
    } catch (err) {
      setError("댓글 작성에 실패했습니다.");
      console.error(err);
    }
  };

  const handleUpdate = async (
    commentPk: number,
    content: string,
    isSecret: boolean = false,
  ) => {
    if (!content.trim()) return;
    try {
      const updated = await updateComment(studyPk, commentPk, {
        content,
        is_secret: isSecret,
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentPk ? { ...updated, recomments: c.recomments } : c,
        ),
      );
    } catch (err) {
      setError("댓글 수정에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDelete = async (commentPk: number) => {
    try {
      await deleteComment(studyPk, commentPk);
      await fetchComments(); // 재호출
    } catch (err) {
      setError("댓글 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  const handleCreateRecomment = async (
    commentPk: number,
    content: string,
    isSecret: boolean = false,
    taggedUserId?: number,
  ) => {
    if (!content.trim()) return;

    try {
      const payload: any = {
        content,
        is_secret: isSecret,
      };

      // taggedUserId 있을 때만 추가
      if (taggedUserId !== undefined) {
        payload.tagged_user = taggedUserId;
      }

      const newRecomment = await createRecomment(studyPk, commentPk, payload);

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentPk
            ? { ...c, recomments: [...(c.recomments || []), newRecomment] }
            : c,
        ),
      );
    } catch (err) {
      setError("대댓글 작성에 실패했습니다.");
      console.error(err);
    }
  };

  const handleUpdateRecomment = async (
    commentPk: number,
    recommentPk: number,
    content: string,
    isSecret: boolean = false,
  ) => {
    if (!content.trim()) return;
    try {
      const updated = await updateRecomment(studyPk, commentPk, recommentPk, {
        content,
        is_secret: isSecret,
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentPk
            ? {
                ...c,
                recomments: (c.recomments || []).map((r) =>
                  r.recomment_id === recommentPk ? updated : r,
                ),
              }
            : c,
        ),
      );
    } catch (err) {
      setError("대댓글 수정에 실패했습니다.");
      console.error(err);
    }
  };

  const handleDeleteRecomment = async (
    commentPk: number,
    recommentPk: number,
  ) => {
    try {
      await deleteRecomment(studyPk, commentPk, recommentPk);
      await fetchComments(); // 재호출
    } catch (err) {
      setError("대댓글 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [studyPk]);

  return {
    comments,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateRecomment,
    handleUpdateRecomment,
    handleDeleteRecomment,
  };
};

export default useComments;
