import client from './client';
import { MOCK_POSTS, MOCK_POST_DETAIL } from '../mocks/posts';

export async function fetchPosts(params = {}) {
  try {
    const { data } = await client.get('/posts', { params });
    return data.content ?? data;
  } catch {
    return MOCK_POSTS;
  }
}

export async function fetchPost(postId) {
  try {
    const { data } = await client.get(`/posts/${postId}`);
    return data;
  } catch {
    return MOCK_POST_DETAIL;
  }
}

export async function createPost(payload) {
  const { data } = await client.post('/posts', payload);
  return data;
}

export async function updatePost(postId, payload) {
  const { data } = await client.put(`/posts/${postId}`, payload);
  return data;
}

export async function uploadPostImage(postId, file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await client.post(`/posts/${postId}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadEditorImage(file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await client.post('/images', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
