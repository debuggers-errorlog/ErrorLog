export function isLoggedIn() {
  return !!localStorage.getItem('accessToken');
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
