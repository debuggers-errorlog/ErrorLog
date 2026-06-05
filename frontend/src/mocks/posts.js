/** 게시글 mock — API 실패 시 fallback. 작성자/통계 일부는 user·social 팀 mock */
export const MOCK_POSTS = [
  {
    id: 1,
    authorId: 1,
    author: { nickname: '김개발', avatarColor: '#3b82f6' },
    title: 'React 18에서 "Hydration failed" 에러 해결 방법',
    excerpt:
      'Next.js SSR 환경에서 Hydration failed 에러가 발생했을 때, 서버와 클라이언트 렌더링 결과 불일치를 해결하는 방법을 정리했습니다.',
    category: 'frontend',
    categoryLabel: 'React',
    categoryColor: '#61dafb',
    visibility: 'PUBLIC',
    locked: false,
    isPremium: false,
    tags: ['React', 'SSR', 'Next.js', 'Hydration'],
    viewCount: 1234,
    commentCount: 45,
    likeCount: 189,
    createdAt: '2시간 전',
    troubleshootingMeta: {
      category: 'RUNTIME',
      environment: { framework: 'React', language: 'TypeScript' },
      error: { message: 'Hydration failed because the initial UI does not match', type: 'Error' },
      symptom: 'SSR 페이지 로드 시 콘솔에 Hydration failed 출력',
      rootCause: '서버/클라이언트 HTML 불일치',
      resolutionSummary: 'useEffect로 클라이언트 전용 로직 분리',
    },
  },
  {
    id: 2,
    authorId: 5,
    author: { nickname: '최DB', avatarColor: '#2dd4bf' },
    title: 'PostgreSQL Connection Pool 고갈 문제 해결',
    excerpt:
      'HikariCP max pool size 부족으로 API 500 에러가 간헐적으로 발생하는 문제의 원인 분석과 해결 과정입니다.',
    category: 'database',
    categoryLabel: 'Database',
    categoryColor: '#2dd4bf',
    visibility: 'SUBSCRIBERS',
    locked: true,
    isPremium: true,
    tags: ['PostgreSQL', 'HikariCP', 'Spring Boot'],
    viewCount: 856,
    commentCount: 32,
    likeCount: 124,
    createdAt: '5시간 전',
    troubleshootingMeta: {
      category: 'DATABASE',
      environment: { framework: 'Spring Boot', language: 'Java' },
      error: { message: 'Connection refused', type: 'SQLException' },
      symptom: 'API 호출 시 간헐적 500',
    },
  },
  {
    id: 3,
    authorId: 6,
    author: { nickname: '정데브옵스', avatarColor: '#f97316' },
    title: 'Docker 컨테이너 OOMKilled 트러블슈팅',
    excerpt:
      '메모리 limit 미설정으로 컨테이너가 OOMKilled 되는 현상을 cgroup 메모리 분석으로 추적한 사례입니다.',
    category: 'devops',
    categoryLabel: 'DevOps',
    categoryColor: '#f97316',
    visibility: 'PUBLIC',
    locked: false,
    isPremium: false,
    tags: ['Docker', 'Kubernetes', 'Memory'],
    viewCount: 567,
    commentCount: 18,
    likeCount: 76,
    createdAt: '1일 전',
    troubleshootingMeta: {
      category: 'DEPLOY',
      environment: { deployTarget: 'Docker' },
      symptom: '컨테이너가 반복적으로 재시작됨',
    },
  },
];

export const MOCK_POST_DETAIL = {
  ...MOCK_POSTS[0],
  content: `Next.js 13+ App Router 환경에서 SSR을 사용할 때 Hydration failed 에러가 발생하는 경우가 많습니다.

## 문제 상황

\`\`\`
Error: Hydration failed because the initial UI does not match what was rendered on the server.
\`\`\`

## 원인 분석

- 서버와 클라이언트에서 렌더링 결과 HTML이 다름
- \`window\`, \`localStorage\` 등 브라우저 전용 API를 렌더 중 사용
- Date.now(), Math.random() 등 비결정적 값 사용

## 해결 방법

1. 클라이언트 전용 컴포넌트를 \`useEffect\` + \`useState\`로 분리
2. \`dynamic(() => import(...), { ssr: false })\` 사용
3. \`suppressHydrationWarning\`은 최후의 수단으로만 사용

## 결론

SSR 환경에서는 "서버에서 렌더 가능한가?"를 먼저 판단하고, 브라우저 API는 클라이언트 사이드로 분리하는 것이 핵심입니다.`,
  bookmarkCount: 67,
  techStack: ['React', 'Next.js', 'TypeScript'],
  images: [],
};
