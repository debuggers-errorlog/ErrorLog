// 좋아요 / 댓글 / 팔로우 백엔드 API 연동
// axios 인스턴스(client)는 baseURL이 '/api'이고, 로그인 토큰을 자동으로 붙여준다.
// 백엔드 컨트롤러가 userId를 @RequestParam으로 받으므로 params로 함께 보낸다.
import client from './client';
import { getCurrentUserId } from '../utils/currentUser';

/* ---------------- 좋아요 ---------------- */

// 좋아요 상태 + 개수 조회  →  { liked, likeCount }
export async function getLikeStatus(postId) {
  const userId = getCurrentUserId();
  const { data } = await client.get(`/likes/${postId}/status`, { params: { userId } });
  return data;
}

// 좋아요 토글  →  { liked, likeCount }
export async function toggleLike(postId) {
  const userId = getCurrentUserId();
  const { data } = await client.post(`/likes/${postId}`, null, { params: { userId } });
  return data;
}

/* ---------------- 댓글 ---------------- */

// 게시글의 댓글 목록  →  [{ id, postId, userId, parentId, content, status, createdAt }]
export async function getComments(postId) {
  const { data } = await client.get('/comments', { params: { postId } });
  return data;
}

// 댓글 작성 (parentId가 있으면 대댓글)  →  새 댓글 id
export async function createComment(postId, content, parentId = null) {
  const userId = getCurrentUserId();
  const { data } = await client.post(
    '/comments',
    { postId, parentId, content },
    { params: { userId } },
  );
  return data;
}

// 댓글 수정
export async function updateComment(commentId, content) {
  const userId = getCurrentUserId();
  await client.put(`/comments/${commentId}`, { content }, { params: { userId } });
}

// 댓글 삭제 (소프트 삭제)
export async function deleteComment(commentId) {
  const userId = getCurrentUserId();
  await client.delete(`/comments/${commentId}`, { params: { userId } });
}

/* ---------------- 팔로우 ---------------- */

// 팔로우 상태  →  { following, followerCount, followingCount }
export async function getFollowStatus(targetUserId) {
  const viewerId = getCurrentUserId();
  const { data } = await client.get(`/follows/${targetUserId}/status`, { params: { viewerId } });
  return data;
}

// 팔로우 토글  →  { following, followerCount }
export async function toggleFollow(targetUserId) {
  const followerId = getCurrentUserId();
  const { data } = await client.post(`/follows/${targetUserId}`, null, { params: { followerId } });
  return data;
}
