# ErrorLog Backend

게시글 / 태그 / 검색 API (Spring Boot 4, Java 21, MySQL).

## 로컬 실행

1. MySQL에 스키마 적용

```bash
mysql -u root -p < sql/schema.sql
```

2. (선택) 개발용 시드

```bash
mysql -u root -p < sql/seed-dev.sql
```

3. 환경 변수 설정 — `backend/.env.example` 참고

4. 서버 실행

```bash
./mvnw spring-boot:run
```

## 패키지 구조

```
com.errorlog.backend.board
├── controller   REST API
├── service      비즈니스 로직
├── repository   JPA Repository
├── domain
│   ├── entity   JPA 엔티티 (Post, Tag)
│   ├── dto      API 요청/응답
│   ├── vo       값 객체 (TroubleshootingMeta 등)
│   └── enums    도메인 enum
├── port         타 도메인 연동 인터페이스 (병합 시 교체)
└── stub         port 임시 구현 (개발용)

Post는 `user_id`(Long)만 보관합니다. 구독 열람은 `port.SubscriberAccessPort`로만 조회합니다.
```

## API 개요

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/posts` | 게시글 목록 |
| GET | `/api/posts/{id}` | 게시글 상세 |
| POST | `/api/posts` | 게시글 작성 (`X-User-Id` 필수) |
| PUT | `/api/posts/{id}` | 수정 |
| DELETE | `/api/posts/{id}` | 소프트 삭제 |
| GET | `/api/tags` | 인기 태그 |
| GET | `/api/tags/suggest?prefix=` | 태그 자동완성 |
| GET | `/api/tags/{name}/posts` | 태그별 게시글 |
| GET | `/api/search?q=&scope=&category=&framework=&tag=` | 검색 |
| POST | `/api/posts/{id}/images` | 이미지 업로드 (`multipart/form-data`, field: `file`) |
| GET | `/api/posts/{id}/images` | 이미지 목록 |
| DELETE | `/api/posts/{id}/images/{imageId}` | 이미지 삭제 (작성자) |

### 이미지 업로드

- 지원 형식: JPEG, PNG, GIF, WebP (최대 5MB)
- `S3_ENABLED=true` → AWS S3 (또는 `S3_ENDPOINT`로 MinIO 등)
- `S3_ENABLED=false` (기본) → 로컬 `uploads/` 폴더 + `http://localhost:8080/uploads/...` URL
- DB `images` 테이블에 S3 object key 저장, 응답에는 공개 URL 반환
- 구독자 전용 글(`locked`)은 이미지도 숨김

### 인증 (임시)

JWT 연동 전까지 요청 헤더 `X-User-Id` 로 사용자를 식별합니다.

### 구독자 전용 글

`visibility: SUBSCRIBERS` 인 글은 구독 중이거나 작성자 본인만 본문을 볼 수 있습니다. 그 외에는 `locked: true` 와 함께 본문이 숨겨집니다.

구독 도메인 병합 전에는 `board.stub.StubSubscriberAccessPort`가 항상 미구독으로 처리합니다 (작성자 본인 제외).

### troubleshooting_meta 예시

```json
{
  "category": "RUNTIME",
  "environment": {
    "language": "Java",
    "languageVersion": "21",
    "framework": "Spring Boot",
    "frameworkVersion": "3.2.0",
    "os": "Windows 11",
    "deployTarget": "Docker"
  },
  "error": {
    "code": "500",
    "message": "Connection refused",
    "type": "java.net.ConnectException"
  },
  "symptom": "API 호출 시 간헐적 500",
  "rootCause": "커넥션 풀 부족",
  "resolutionSummary": "pool size 20으로 상향"
}
```

`category` 와 `error.message` 또는 `symptom` 중 하나는 필수입니다.

### 검색 scope

- `CONTENT` — 제목/본문 FULLTEXT
- `ERROR_MESSAGE` — `meta_error_message` FULLTEXT
- `ALL` — 제목/본문 (기본)
