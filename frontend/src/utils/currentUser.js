// 현재 로그인한 유저의 id를 JWT에서 꺼내는 헬퍼.
// 백엔드 access token은 sub(subject)에 userId를 문자열로 담아준다.
// (지금 좋아요/댓글/팔로우 컨트롤러가 userId를 쿼리파라미터로 받기 때문에 필요)

export function getCurrentUserId() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = JSON.parse(json);
    return decoded.sub != null ? Number(decoded.sub) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!localStorage.getItem('accessToken');
}