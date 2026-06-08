import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CategorySidebar from '../components/sidebar/CategorySidebar';
import FilterSidebar from '../components/sidebar/FilterSidebar';
import PostDetailContent, {
  PostDetailSidebar,
  CommentSection,
  CommentList,
  CommentItem,
  EmptyComments,
} from '../components/post/PostDetailContent';
import { Avatar, Button } from '../components/common/Styled';
import { useBoardSidebarData } from '../hooks/useBoardSidebarData';
import { fetchPost } from '../api/postApi';
import { fetchComments, createComment } from '../api/commentApi';
import { fetchLikeStatus, toggleLike } from '../api/likeApi';
import { fetchFollowStatus, toggleFollow } from '../api/followApi';
import { mapApiPostDetail, mapApiComment } from '../utils/postMapper';
import { isLoggedIn } from '../utils/authSession';
import ReportModal from '../components/report/ReportModal.jsx';

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { categories, weeklyStats } = useBoardSidebarData();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reportOpen, setReportOpen] = useState(false);

  const loadComments = useCallback(() => {
    fetchComments(postId)
      .then((data) => setComments(Array.isArray(data) ? data.map(mapApiComment) : []))
      .catch(() => setComments([]));
  }, [postId]);

  useEffect(() => {
    setLoadError('');
    fetchPost(postId)
      .then((data) => {
        if (data?.title) {
          const mapped = mapApiPostDetail(data);
          setPost(mapped);

          fetchFollowStatus(mapped.authorId)
            .then((status) => {
              setFollowing(status.following);
              setFollowerCount(status.followerCount);
            })
            .catch(() => {});
        } else {
          setPost(null);
          setLoadError('게시글을 찾을 수 없습니다.');
        }
      })
      .catch(() => {
        setPost(null);
        setLoadError('게시글을 불러오지 못했습니다.');
      });

    loadComments();

    fetchLikeStatus(postId)
      .then((data) => {
        setLiked(data.liked);
        setPost((prev) => (prev ? { ...prev, likeCount: data.count } : prev));
      })
      .catch(() => {});
  }, [postId, loadComments]);

  const requireLogin = () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleLikeToggle = async () => {
    if (!requireLogin()) return;

    try {
      const data = await toggleLike(postId);
      setLiked(data.liked);
      setPost((prev) => (prev ? { ...prev, likeCount: data.count } : prev));
    } catch {
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleFollowToggle = async () => {
    if (!requireLogin() || !post?.authorId) return;

    try {
      const data = await toggleFollow(post.authorId);
      setFollowing(data.following);
      setFollowerCount(data.followerCount);
    } catch {
      alert('팔로우 처리에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    if (!requireLogin()) return;

    setSubmittingComment(true);
    try {
      await createComment(Number(postId), commentText.trim());
      setCommentText('');
      loadComments();
      setPost((prev) =>
        prev ? { ...prev, commentCount: (prev.commentCount ?? 0) + 1 } : prev,
      );
    } catch {
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loadError) {
    return (
      <MainLayout>
        <p style={{ color: '#f85149' }}>{loadError}</p>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <p>게시글을 불러오는 중...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      leftSidebar={
        <>
          <CategorySidebar
            categories={categories}
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
      rightSidebar={<PostDetailSidebar post={post} followerCount={followerCount} />}
    >
      <PostDetailContent
        post={post}
        liked={liked}
        following={following}
        showFollow={isLoggedIn()}
        onLikeToggle={handleLikeToggle}
        onFollowToggle={handleFollowToggle}
      />

      <CommentSection>
        <h2>댓글 {comments.length}</h2>
        <textarea
          placeholder={isLoggedIn() ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다.'}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={!isLoggedIn()}
        />
        <div className="comment-actions">
          <Button
            $variant="primary"
            onClick={handleCommentSubmit}
            disabled={submittingComment || !isLoggedIn()}
          >
            {submittingComment ? '작성 중...' : '댓글 작성'}
          </Button>
          {isLoggedIn() && (
            <Button $variant="ghost" onClick={() => setReportOpen(true)}>
              게시글 신고
            </Button>
          )}
        </div>
        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          targetType="POST"
          targetId={post.id}
        />

        <CommentList>
          {comments.length === 0 ? (
            <EmptyComments>아직 댓글이 없습니다.</EmptyComments>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id}>
                <Avatar $color={comment.author.avatarColor} $size={36}>
                  {comment.author.nickname[0]}
                </Avatar>
                <div>
                  <div className="meta">
                    {comment.author.nickname}
                    <span className="time"> · {comment.createdAt}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </CommentItem>
            ))
          )}
        </CommentList>
      </CommentSection>
    </MainLayout>
  );
}
