export function isLoggedIn() {
  return !!localStorage.getItem('accessToken');
}

export function getCurrentUserId() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
    );
    const id = payload.sub ?? payload.userId;
    return id != null ? Number(id) : null;
  } catch {
    return null;
  }
}

export function notifyAuthChange() {
  window.dispatchEvent(new Event('auth-change'));
}

export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  notifyAuthChange();
}

export function clearAuth() {
  localStorage.clear();
  notifyAuthChange();
}
