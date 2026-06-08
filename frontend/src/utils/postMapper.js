import { avatarColorFromName } from './avatar';
import { getCategoryColor } from './categoryStyles';
import { normalizeMarkdownImages } from './imageUrl';

export function mapApiPost(apiPost) {
  const nickname = apiPost.authorNickname || `User${apiPost.authorId}`;
  return {
    id: apiPost.id,
    authorId: apiPost.authorId,
    author: { nickname, avatarColor: avatarColorFromName(nickname) },
    title: apiPost.title,
    excerpt: apiPost.excerpt || '내용 미리보기 없음',
    category: apiPost.category ?? 'OTHER',
    categoryLabel: apiPost.category ?? 'Other',
    categoryColor: getCategoryColor(apiPost.category),
    visibility: apiPost.visibility,
    locked: apiPost.locked ?? false,
    isPremium: apiPost.visibility === 'SUBSCRIBERS',
    tags: apiPost.tags || [],
    viewCount: apiPost.viewCount ?? 0,
    commentCount: apiPost.commentCount ?? 0,
    likeCount: apiPost.likeCount ?? 0,
    createdAt: apiPost.createdAt?.slice?.(0, 10) ?? '',
  };
}

export function mapApiPostDetail(data) {
  const base = mapApiPost(data);
  return {
    ...base,
    content: normalizeMarkdownImages(data.content),
    excerpt: data.locked ? base.excerpt : (data.content?.slice?.(0, 160) || base.excerpt),
    troubleshootingMeta: data.troubleshootingMeta,
    images: data.images || [],
  };
}

export function mapApiComment(comment) {
  const nickname = comment.authorNickname || `User${comment.userId}`;
  return {
    id: comment.id,
    parentId: comment.parentId,
    content: comment.content,
    createdAt: comment.createdAt?.slice?.(0, 10) ?? '',
    author: { nickname, avatarColor: avatarColorFromName(nickname) },
  };
}
