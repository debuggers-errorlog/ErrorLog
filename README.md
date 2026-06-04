# ErrorLog

개발자 트러블슈팅 사례 공유 SNS (구독형 유료 게시글 지원).

## 구조

- `backend/` — Spring Boot API (게시글/태그/검색: `board` 패키지)
- `frontend/` — React (Vite)
- `backend/sql/schema.sql` — 통합 DB 스키마 (팀 공용)

## 빠른 시작

1. [backend/README.md](backend/README.md) 에서 MySQL 스키마 적용 및 API 서버 실행
2. `cd frontend && npm install && npm run dev`