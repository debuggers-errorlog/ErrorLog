import styled from 'styled-components';
import PostCard from './PostCard';

const FeedHeader = styled.div`
  margin-bottom: 20px;

  h1 {
    font-size: 22px;
    font-weight: 700;
  }
`;

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Empty = styled.p`
  text-align: center;
  padding: 48px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export default function PostFeed({ posts, title = '최신 에러 해결 방법' }) {
  return (
    <>
      <FeedHeader>
        <h1>{title}</h1>
      </FeedHeader>
      <FeedList>
        {posts.length === 0 ? (
          <Empty>표시할 게시물이 없습니다.</Empty>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </FeedList>
    </>
  );
}
