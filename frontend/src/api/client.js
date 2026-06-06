// 우리 axios 인스턴스로 통일 (JWT 인터셉터 포함)
export { default } from './axios';

// WritePostPage 등에서 사용 중인 임시 함수 - JWT로 대체되어 실제로는 동작 안 함
export function setUserId() {}
