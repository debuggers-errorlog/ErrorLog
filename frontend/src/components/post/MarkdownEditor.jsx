import { useCallback } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { uploadEditorImage } from '../../api/postApi';
import { isLoggedIn } from '../../utils/authSession';
import { normalizeImageUrl } from '../../utils/imageUrl';
import { renderMarkdown } from '../../utils/markdownParser';
import { EditorWrapper } from './MarkdownEditor.styles';

export default function MarkdownEditor({ value, onChange }) {
  const handleChange = useCallback(
    ({ text }) => {
      onChange(text);
    },
    [onChange],
  );

  const handleImageUpload = useCallback((file, callback) => {
    if (!isLoggedIn()) {
      alert('이미지 업로드를 하려면 로그인이 필요합니다.');
      return Promise.reject(new Error('Not logged in'));
    }

    const upload = uploadEditorImage(file)
      .then(({ url }) => {
        const normalized = normalizeImageUrl(url);
        if (!normalized) {
          throw new Error('Upload response missing url');
        }
        if (typeof callback === 'function') {
          callback(normalized);
        }
        return normalized;
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        } else if (err.message !== 'Not logged in') {
          alert('이미지 업로드에 실패했습니다. 서버 연결을 확인해주세요.');
        }
        throw err;
      });

    return upload;
  }, []);

  return (
    <EditorWrapper>
      <MdEditor
        value={value}
        style={{ height: '520px' }}
        renderHTML={renderMarkdown}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
        placeholder="에러 상황, 원인 분석, 해결 방법을 마크다운으로 작성해주세요."
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
            fullScreen: true,
            hideMenu: true,
          },
          canView: {
            menu: true,
            md: true,
            html: true,
            fullScreen: true,
            hideMenu: true,
          },
          syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
          imageAccept: '.jpg,.jpeg,.png,.gif,.webp',
        }}
      />
    </EditorWrapper>
  );
}
