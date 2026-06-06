# ErrorLog Frontend

React (Vite) + Styled-components 다크 모드 UI

## 실행

```bash
npm install
npm run dev
```

백엔드 API 연동: `http://localhost:8080` (vite proxy)

## 페이지

| 경로 | 설명 |
|------|------|
| `/` | 메인 피드 |
| `/posts/:id` | 게시글 상세 |
| `/write` | 글 작성 |
| `/search?q=` | 검색 |
| `/mypage` | 마이페이지 (mock) |

## 구조

```
src/
├── theme/           GlobalStyle, theme tokens
├── components/
│   ├── layout/      Header, MainLayout
│   ├── sidebar/     Category, Filter, WeeklyStats
│   ├── post/        PostCard, PostFeed, WriteForm
│   └── common/      Button, Badge, Card
├── pages/           Home, Detail, Write, Search, MyPage
├── mocks/           백엔드 미구현 데이터
└── api/             board API 연동
```

## Mock vs API

| 기능 | 상태 |
|------|------|
| 게시글 목록/상세/작성 | API (`/api/posts`) |
| 태그/검색 | API (실패 시 mock) |
| 이미지 업로드 | API (`/api/posts/{id}/images`) |
| 작성자 닉네임/아바타 | **mock** → user 팀 |
| 댓글 | **mock** → social 팀 |
| 좋아요/북마크/공유 | **mock** → social 팀 |
| 카테고리 UI 필터 | **mock** → board category 매핑 협의 |
| 주간 통계 | **mock** → admin/analytics |
| 마이페이지 | **mock** → user 팀 |
| 구독 잠금 blur | API `locked` + subscription 팀 |
