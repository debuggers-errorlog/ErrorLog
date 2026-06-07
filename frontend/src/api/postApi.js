import api from './axios';
import { extractUploadUrl } from '../utils/imageUrl';

export async function fetchPosts(params = {}) {
  const { data } = await api.get('/posts', { params });
  return data.content ?? data;
}

export async function fetchPostStats() {
  const { data } = await api.get('/posts/stats');
  return data;
}

export async function fetchPost(postId) {
  const { data } = await api.get(`/posts/${postId}`);
  return data;
}

export async function createPost(payload) {
  const { data } = await api.post('/posts', payload);
  return data;
}

export async function updatePost(postId, payload) {
  const { data } = await api.put(`/posts/${postId}`, payload);
  return data;
}

export async function uploadPostImage(postId, file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post(`/posts/${postId}/images`, form);
  return data;
}

export async function uploadEditorImage(file) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/images', form);
  const url = extractUploadUrl(data);
  if (!url) {
    throw new Error('Upload response missing url');
  }
  return { url };
}
