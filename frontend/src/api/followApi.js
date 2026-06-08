import api from './axios';

export async function fetchFollowStatus(targetId) {
  const { data } = await api.get(`/follows/${targetId}/status`);
  return data;
}

export async function toggleFollow(targetId) {
  const { data } = await api.post(`/follows/${targetId}`);
  return data;
}
