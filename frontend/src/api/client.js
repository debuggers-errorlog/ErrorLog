import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/** JWT 연동 전 임시 — user/인증 팀 */
export function setUserId(userId) {
  if (userId) {
    client.defaults.headers.common['X-User-Id'] = String(userId);
  } else {
    delete client.defaults.headers.common['X-User-Id'];
  }
}

export default client;
