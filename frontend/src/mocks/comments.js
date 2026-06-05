/** 댓글/좋아요 — social 팀 담당 (mock) */
export const MOCK_COMMENTS = [
  {
    id: 1,
    author: { id: 2, nickname: '박리액트', avatarColor: '#6366f1' },
    content: '저도 같은 문제 겪었는데 useEffect에서 클라이언트 전용 로직 분리하니까 해결됐어요!',
    createdAt: '1시간 전',
    likes: 12,
  },
  {
    id: 2,
    author: { id: 3, nickname: '이넥스트', avatarColor: '#ec4899' },
    content: 'Next.js 13+ app router 쓰시면 suppressHydrationWarning도 참고해보세요.',
    createdAt: '45분 전',
    likes: 8,
  },
  {
    id: 3,
    author: { id: 4, nickname: '최타입', avatarColor: '#14b8a6' },
    content: 'typeof window !== "undefined" 체크 패턴 정리해주셔서 감사합니다 🙏',
    createdAt: '30분 전',
    likes: 5,
  },
];
