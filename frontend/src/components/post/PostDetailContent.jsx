import styled from 'styled-components';
import { Heart, Bookmark, Share2, UserPlus, UserCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Avatar, Badge, Button, Card } from '../common/Styled';
import MarkdownImage from './MarkdownImage';

const Article = styled.article``;

const TopBadge = styled(Badge)`
  margin-bottom: 12px;
  background: ${({ $bg }) => `${$bg}22`};
  color: ${({ $bg }) => $bg};
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  line-height: 1.35;
  margin-bottom: 16px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  span.name {
    font-weight: 600;
  }

  span.time {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const FollowButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 12px;
  font-weight: 600;
  border: 1px solid
    ${({ theme, $following }) => ($following ? theme.colors.borderLight : theme.colors.accent)};
  background: ${({ theme, $following }) =>
    $following ? theme.colors.surfaceHover : theme.colors.accentDim};
  color: ${({ theme, $following }) => ($following ? theme.colors.textMuted : theme.colors.accent)};

  &:hover {
    opacity: 0.9;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  color: ${({ theme }) => theme.colors.textMuted};

  button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 13px;
    color: inherit;
    &:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
    }
  }
`;

const Content = styled.div`
  font-size: 15px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textSecondary};

  h2 {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.text};
    margin: 28px 0 12px;
  }

  pre {
    background: ${({ theme }) => theme.colors.bg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 16px;
    overflow-x: auto;
    margin: 16px 0;
    font-family: ${({ theme }) => theme.font.mono};
    font-size: 13px;
    color: ${({ theme }) => theme.colors.danger};
  }

  code {
    font-family: ${({ theme }) => theme.font.mono};
  }

  p {
    margin-bottom: 12px;
  }

  ol,
  ul {
    padding-left: 20px;
    margin-bottom: 16px;
    li {
      list-style: disc;
      margin-bottom: 6px;
    }
  }
`;

const LockedBanner = styled.div`
  padding: 32px;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};

  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 16px;
    line-height: 1.6;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 12px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border-radius: ${({ theme }) => theme.radius.md};

  span.label {
    display: block;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 4px;
  }

  span.value {
    font-size: 20px;
    font-weight: 800;
    color: ${({ $color }) => $color};
  }
`;

export default function PostDetailContent({
  post,
  liked = false,
  following = false,
  showFollow = false,
  onLikeToggle,
  onFollowToggle,
}) {
  return (
    <Article>
      <TopBadge $bg={post.categoryColor}>
        {post.categoryLabel || 'General'}
      </TopBadge>
      <Title>{post.title}</Title>

      <MetaRow>
        <AuthorInfo>
          <Avatar $color={post.author?.avatarColor}>
            {post.author?.nickname?.[0]}
          </Avatar>
          <div>
            <span className="name">{post.author?.nickname}</span>
            {showFollow && (
              <FollowButton type="button" $following={following} onClick={onFollowToggle}>
                {following ? <UserCheck size={14} /> : <UserPlus size={14} />}
                {following ? '팔로잉' : '팔로우'}
              </FollowButton>
            )}
            <span className="time"> · {post.createdAt}</span>
          </div>
        </AuthorInfo>
        <Actions>
          <button
            type="button"
            onClick={onLikeToggle}
            style={liked ? { color: '#f85149' } : undefined}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} /> {post.likeCount}
          </button>
          <button type="button">
            <Bookmark size={16} />
          </button>
          <button type="button">
            <Share2 size={16} />
          </button>
        </Actions>
      </MetaRow>

      {post.locked ? (
        <LockedBanner>
          <h3>구독자 전용 게시글</h3>
          <p>{post.excerpt || '이 글의 전체 내용은 작성자를 구독한 사용자만 열람할 수 있습니다.'}</p>
          <Button $variant="primary" type="button" disabled>
            구독하기 (준비 중)
          </Button>
        </LockedBanner>
        ) : (
          <Content>
            <ReactMarkdown
              components={{
                img: MarkdownImage,
              }}
            >
              {post.content || post.excerpt}
            </ReactMarkdown>
          </Content>
        )}
    </Article>
  );
}

export function PostDetailSidebar({ post, followerCount }) {
  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>게시물 통계</h3>
      <StatGrid>
        <StatItem $color="#58a6ff">
          <span className="label">조회수</span>
          <span className="value">{post.viewCount?.toLocaleString()}</span>
        </StatItem>
        <StatItem $color="#f85149">
          <span className="label">좋아요</span>
          <span className="value">{post.likeCount}</span>
        </StatItem>
        <StatItem $color="#a371f7">
          <span className="label">댓글</span>
          <span className="value">{post.commentCount}</span>
        </StatItem>
        <StatItem $color="#3fb950">
          <span className="label">팔로워</span>
          <span className="value">{followerCount ?? 0}</span>
        </StatItem>
      </StatGrid>
    </Card>
  );
}

export const CommentSection = styled.section`
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    font-size: 18px;
    margin-bottom: 20px;
  }

  textarea {
    width: 100%;
    min-height: 100px;
    padding: 14px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    resize: vertical;
    margin-bottom: 12px;
    outline: none;
    font-size: 14px;

    &:focus {
      border-color: ${({ theme }) => theme.colors.accent};
    }
  }

  .comment-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

export const CommentItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 6px 0 0;
  }

  .meta {
    font-size: 13px;
    font-weight: 600;
  }

  .time {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }
`;

export const EmptyComments = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 16px;
`;
