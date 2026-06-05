import styled from 'styled-components';
import { Filter } from 'lucide-react';
import PostCard from './PostCard';

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h1 {
    font-size: 22px;
    font-weight: 700;
  }
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
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
        <FilterBtn type="button">
          <Filter size={15} />
          필터
        </FilterBtn>
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
