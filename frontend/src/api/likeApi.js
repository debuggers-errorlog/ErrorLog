import api from './axios';

export async function fetchLikeStatus(postId) {
  const { data } = await api.get(`/likes/${postId}/status`);
  return data;
}

export async function toggleLike(postId) {
  const { data } = await api.post(`/likes/${postId}`);
  return data;
}
