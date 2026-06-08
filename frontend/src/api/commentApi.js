import api from './axios';

export async function fetchComments(postId) {
  const { data } = await api.get('/comments', { params: { postId } });
  return data;
}

export async function createComment(postId, content, parentId = null) {
  const { data } = await api.post('/comments', { postId, parentId, content });
  return data;
}
