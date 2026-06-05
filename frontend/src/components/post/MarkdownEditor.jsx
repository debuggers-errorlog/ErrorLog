import { useCallback } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { uploadEditorImage } from '../../api/postApi';
import { renderMarkdown } from '../../utils/markdownParser';
import { EditorWrapper } from './MarkdownEditor.styles';

export default function MarkdownEditor({ value, onChange }) {
  const handleChange = useCallback(
    ({ text }) => {
      onChange(text);
    },
    [onChange],
  );

  const handleImageUpload = useCallback(async (file) => {
    try {
      const { url } = await uploadEditorImage(file);
      return url;
    } catch {
      alert('이미지 업로드에 실패했습니다. 로그인 상태와 서버 연결을 확인해주세요.');
      throw new Error('Image upload failed');
    }
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
