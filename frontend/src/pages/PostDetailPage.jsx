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
import { MOCK_COMMENTS } from '../mocks/comments';
import { fetchPost } from '../api/postApi';
import ReportModal from '../components/report/ReportModal.jsx'

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(MOCK_POST_DETAIL);
  const [activeCategory, setActiveCategory] = useState('all');
  const [reportOpen, setReportOpen] = useState(false)

  useEffect(() => {
    fetchPost(postId).then((data) => {
      if (data?.title) {
        setPost({ ...MOCK_POST_DETAIL, ...data, author: MOCK_POST_DETAIL.author });
      }
    });
  }, [postId]);

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
      rightSidebar={<PostDetailSidebar post={post} />}
    >
      <PostDetailContent post={post} />

      <CommentSection>
        <h2>댓글 {MOCK_COMMENTS.length}</h2>
        <textarea placeholder="댓글을 입력하세요..." />
        <div className="flex items-center gap-2">
          <Button $variant="primary">댓글 작성</Button>
          <Button $variant="primary" onClick={() => setReportOpen(true)}>게시글 신고</Button>
        </div>
        <ReportModal
            open={reportOpen}
            onClose={() => setReportOpen(false)}
            targetType="POST"     // 댓글이면 "COMMENT", 회원이면 "USER"
            targetId={post.id}    // 각각 comment.id / user.id
        />

        <CommentList>
          {MOCK_COMMENTS.map((comment) => (
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
                <div className="actions">
                  <span>♥ {comment.likes}</span>
                  <span>답글</span>
                </div>
              </div>
            </CommentItem>
          ))}
        </CommentList>
      </CommentSection>
    </MainLayout>
  );
}
