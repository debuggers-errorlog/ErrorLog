import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CategorySidebar from '../components/sidebar/CategorySidebar';
import FilterSidebar from '../components/sidebar/FilterSidebar';
import PostDetailContent, {
  PostDetailSidebar,
  CommentSection,
  CommentList,
  CommentItem,
} from '../components/post/PostDetailContent';
import { Avatar, Button } from '../components/common/Styled';
import { CATEGORIES } from '../mocks/categories';
import { MOCK_POST_DETAIL } from '../mocks/posts';
import { fetchPost } from '../api/postApi';
import {
  getComments, createComment, deleteComment,
  getLikeStatus, toggleLike,
} from '../api/socialApi';
import { getCurrentUserId } from '../utils/currentUser';
import ReportModal from '../components/report/ReportModal.jsx';

function formatTime(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('ko-KR');
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const myId = getCurrentUserId();

  const [post, setPost] = useState(MOCK_POST_DETAIL);
  const [activeCategory, setActiveCategory] = useState('all');
  const [reportOpen, setReportOpen] = useState(false);

  // 좋아요 상태
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 게시글 로드
  useEffect(() => {
    fetchPost(postId).then((data) => {
      if (data?.title) {
        setPost({ ...MOCK_POST_DETAIL, ...data, author: MOCK_POST_DETAIL.author });
      }
    });
  }, [postId]);

  // 좋아요 상태 + 댓글 로드
  useEffect(() => {
    if (!postId) return;
    getLikeStatus(postId)
      .then((s) => { setLiked(s.liked); setLikeCount(s.likeCount); })
      .catch(() => { /* 비로그인 등 */ });
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  function loadComments() {
    getComments(postId)
      .then(setComments)
      .catch(() => { /* 비로그인 등 */ });
  }

  async function handleToggleLike() {
    if (!myId) { alert('로그인이 필요합니다.'); return; }
    try {
      const r = await toggleLike(postId);
      setLiked(r.liked);
      setLikeCount(r.likeCount);
    } catch {
      alert('좋아요 처리에 실패했습니다.');
    }
  }

  async function handleSubmitComment() {
    if (!myId) { alert('로그인이 필요합니다.'); return; }
    const content = newComment.trim();
    if (!content) return;
    setSubmitting(true);
    try {
      await createComment(postId, content);
      setNewComment('');
      loadComments();
    } catch {
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    try {
      await deleteComment(commentId);
      loadComments();
    } catch {
      alert('본인 댓글만 삭제할 수 있습니다.');
    }
  }

  return (
    <MainLayout
      leftSidebar={
        <>
          <CategorySidebar
            categories={CATEGORIES}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
          <FilterSidebar
            showFree
            showPremium
            onToggleFree={() => {}}
            onTogglePremium={() => {}}
          />
        </>
      }
      rightSidebar={
        <PostDetailSidebar
          post={{ ...post, likeCount, commentCount: comments.length }}
        />
      }
    >
      <PostDetailContent
        post={post}
        liked={liked}
        likeCount={likeCount}
        onToggleLike={handleToggleLike}
      />

      <CommentSection>
        <h2>댓글 {comments.length}</h2>
        <textarea
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button $variant="primary" onClick={handleSubmitComment} disabled={submitting}>
            {submitting ? '작성 중...' : '댓글 작성'}
          </Button>
          <Button $variant="primary" onClick={() => setReportOpen(true)}>게시글 신고</Button>
        </div>
        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          targetType="POST"
          targetId={post.id}
        />

        <CommentList>
          {comments.map((c) => (
            <CommentItem key={c.id}>
              <Avatar $color="#6366f1" $size={36}>
                {(c.nickname ?? String(c.userId)).charAt(0)}
              </Avatar>
              <div>
                <div className="meta">
                  {c.nickname ?? `유저 ${c.userId}`}
                  <span className="time"> · {formatTime(c.createdAt)}</span>
                </div>
                <p>{c.content}</p>
                <div className="actions">
                  {myId === c.userId && (
                    <span onClick={() => handleDeleteComment(c.id)}>삭제</span>
                  )}
                </div>
              </div>
            </CommentItem>
          ))}
        </CommentList>
      </CommentSection>
    </MainLayout>
  );
}
