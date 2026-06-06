import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Eye, MessageCircle, Heart, Lock } from 'lucide-react';
import { Avatar, Badge } from '../common/Styled';

const CardLink = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  transition: border-color 0.15s, transform 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    transform: translateY(-1px);
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CategoryBadge = styled(Badge)`
  background: ${({ $bg }) => `${$bg}22`};
  color: ${({ $bg }) => $bg};
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.text};
`;

const Excerpt = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 16px;
  ${({ $locked }) =>
    $locked &&
    `
    filter: blur(5px);
    user-select: none;
    pointer-events: none;
  `}
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const Tag = styled.span`
  padding: 4px 10px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  span.name {
    font-size: 14px;
    font-weight: 600;
  }

  span.time {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

export default function PostCard({ post }) {
  const locked = post.locked || post.isPremium;

  return (
    <CardLink to={`/posts/${post.id}`}>
      <TopRow>
        <CategoryBadge $bg={post.categoryColor}>{post.categoryLabel}</CategoryBadge>
        {post.isPremium && (
          <Badge $color="premium">
            <Lock size={12} />
            프리미엄
          </Badge>
        )}
      </TopRow>

      <Title>{post.title}</Title>
      <Excerpt $locked={locked}>{post.excerpt}</Excerpt>

      <TagRow>
        {post.tags?.map((tag) => (
          <Tag key={tag}>#{tag}</Tag>
        ))}
      </TagRow>

      <Footer>
        <AuthorRow>
          <Avatar $color={post.author?.avatarColor} $size={32}>
            {post.author?.nickname?.[0]}
          </Avatar>
          <div>
            <span className="name">{post.author?.nickname}</span>
            <span className="time"> · {post.createdAt}</span>
          </div>
        </AuthorRow>
        <Stats>
          <span>
            <Eye size={15} />
            {post.viewCount?.toLocaleString()}
          </span>
          <span>
            <MessageCircle size={15} />
            {post.commentCount}
          </span>
          <span>
            <Heart size={15} />
            {post.likeCount}
          </span>
        </Stats>
      </Footer>
    </CardLink>
  );
}
