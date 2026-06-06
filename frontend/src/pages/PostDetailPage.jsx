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

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(MOCK_POST_DETAIL);
  const [activeCategory, setActiveCategory] = useState('all');

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
        <Button $variant="primary">댓글 작성</Button>

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
