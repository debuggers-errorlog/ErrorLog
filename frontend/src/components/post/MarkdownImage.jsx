import { useState } from 'react';
import { normalizeImageUrl } from '../../utils/imageUrl';

export default function MarkdownImage({ src, alt }) {
  const normalizedSrc = normalizeImageUrl(src);
  const [failed, setFailed] = useState(false);

  if (!normalizedSrc || failed) {
    return (
      <span className="md-image-missing">
        [이미지를 불러올 수 없습니다: {alt || 'unknown'}]
      </span>
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt ?? ''}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, margin: '12px 0' }}
    />
  );
}
