import styled from 'styled-components';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Avatar, Badge, Card } from '../common/Styled';

const Article = styled.article``;

const TopBadge = styled(Badge)`
  margin-bottom: 12px;
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

  ol, ul {
    padding-left: 20px;
    margin-bottom: 16px;
    li {
      list-style: disc;
      margin-bottom: 6px;
    }
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

const TechList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.accent};
    }
  }
`;

export default function PostDetailContent({ post }) {
  return (
    <>
      <Article>
        <TopBadge $bg="#61dafb" $text="#61dafb">
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
              <span className="time"> · {post.createdAt}</span>
            </div>
          </AuthorInfo>
          <Actions>
            <button type="button">
              <Heart size={16} /> {post.likeCount}
            </button>
            <button type="button">
              <Bookmark size={16} />
            </button>
            <button type="button">
              <Share2 size={16} />
            </button>
          </Actions>
        </MetaRow>

        <Content>
          <ReactMarkdown>{post.content || post.excerpt}</ReactMarkdown>
        </Content>
      </Article>
    </>
  );
}

export function PostDetailSidebar({ post }) {
  return (
    <>
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
            <span className="label">북마크</span>
            <span className="value">{post.bookmarkCount ?? 0}</span>
          </StatItem>
        </StatGrid>
      </Card>

      {post.techStack && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>사용된 기술 스택</h3>
          <TechList>
            {post.techStack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </TechList>
        </Card>
      )}
    </>
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
    margin: 6px 0 10px;
  }

  .meta {
    font-size: 13px;
    font-weight: 600;
  }

  .time {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 400;
  }

  .actions {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;
