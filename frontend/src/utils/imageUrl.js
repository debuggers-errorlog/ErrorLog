/** 업로드 API URL → 프론트(Vite proxy)에서 접근 가능한 경로로 정규화 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.startsWith('/uploads/')) return trimmed;
    if (trimmed.startsWith('/')) return trimmed;

    const parsed = new URL(trimmed);
    const path = parsed.pathname.startsWith('/') ? parsed.pathname : `/${parsed.pathname}`;

    // 기존 S3 직접 URL → 백엔드 /uploads 프록시 경로로 변환
    if (parsed.hostname.includes('.s3.') || parsed.hostname.startsWith('s3.')) {
      if (path.length > 1) {
        return `/uploads${path}`;
      }
    }

    if (path.startsWith('/uploads/')) {
      return path;
    }

    return trimmed;
  } catch {
    return trimmed.startsWith('uploads/') ? `/${trimmed}` : trimmed;
  }
}

export function extractUploadUrl(data) {
  if (!data) return null;
  if (typeof data === 'string') return normalizeImageUrl(data);
  return normalizeImageUrl(data.url ?? data.imageUrl ?? data.publicUrl);
}

/** 저장된 마크다운의 이미지 URL 정규화 + 빈 URL 치환 */
export function normalizeMarkdownImages(markdown) {
  if (!markdown || typeof markdown !== 'string') return markdown;
  return markdown.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (match, alt, url) => {
    const normalized = normalizeImageUrl(url);
    if (!normalized) {
      return `_[이미지를 불러올 수 없습니다: ${alt || 'unknown'}]_`;
    }
    return `![${alt}](${normalized})`;
  });
}
