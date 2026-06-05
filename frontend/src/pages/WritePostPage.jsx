import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { LayoutRoot, LayoutBody, WriteGrid } from '../components/layout/MainLayout.styles';
import {
  WriteHeader,
  TitleInput,
  Select,
  TagInputRow,
  TagChipList,
  TagChip,
  FrameworkList,
  FrameworkItem,
  VisibilityOption,
  PremiumLabel,
  Button,
  Card,
  SectionTitle,
} from '../components/post/WritePostForm';
import MarkdownEditor from '../components/post/MarkdownEditor';
import { FRAMEWORKS } from '../mocks/frameworks';
import { createPost } from '../api/postApi';
import { setUserId } from '../api/client';

const TROUBLESHOOTING_CATEGORIES = [
  { value: 'RUNTIME', label: 'Runtime' },
  { value: 'DATABASE', label: 'Database' },
  { value: 'NETWORK', label: 'Network' },
  { value: 'BUILD', label: 'Build' },
  { value: 'DEPLOY', label: 'Deploy' },
  { value: 'CONFIG', label: 'Config' },
  { value: 'PERFORMANCE', label: 'Performance' },
  { value: 'SECURITY', label: 'Security' },
  { value: 'OTHER', label: 'Other' },
];

export default function WritePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('RUNTIME');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [frameworks, setFrameworks] = useState([]);
  const [visibility, setVisibility] = useState('PUBLIC');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setUserId(1);
  }, []);

  const addTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const toggleFramework = (name) => {
    setFrameworks((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name],
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);

    try {
      const post = await createPost({
        title,
        content,
        visibility,
        tags,
        troubleshootingMeta: {
          category,
          environment: {
            framework: frameworks[0] || null,
          },
          error: { message: title },
          symptom: content.slice(0, 200),
        },
      });

      navigate(`/posts/${post.id}`);
    } catch {
      alert('게시에 실패했습니다. 백엔드 서버와 X-User-Id(임시 인증)를 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LayoutRoot>
      <Header />
      <LayoutBody>
        <WriteGrid>
          <div>
            <WriteHeader>
              <button type="button" className="cancel" onClick={() => navigate(-1)}>
                취소
              </button>
              <Button $variant="primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? '게시 중...' : '게시하기'}
              </Button>
            </WriteHeader>

            <TitleInput
              placeholder="제목을 입력하세요..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <MarkdownEditor value={content} onChange={setContent} />
          </div>

          <div>
            <Card style={{ marginBottom: 20 }}>
              <SectionTitle>카테고리 *</SectionTitle>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">카테고리 선택</option>
                {TROUBLESHOOTING_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Card>

            <Card style={{ marginBottom: 20 }}>
              <SectionTitle>에러 태그</SectionTitle>
              <TagInputRow>
                <input
                  placeholder="태그 입력 (예: CORS, 404)"
                  value={tagInput}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button $variant="outline" $size="sm" onClick={addTag}>
                  추가
                </Button>
              </TagInputRow>
              <TagChipList>
                {tags.map((tag) => (
                  <TagChip key={tag}>
                    #{tag}
                    <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
                      ×
                    </button>
                  </TagChip>
                ))}
              </TagChipList>
            </Card>

            <Card style={{ marginBottom: 20 }}>
              <SectionTitle>프레임워크/기술 스택</SectionTitle>
              <FrameworkList>
                {FRAMEWORKS.map((fw) => (
                  <FrameworkItem key={fw}>
                    <input
                      type="checkbox"
                      checked={frameworks.includes(fw)}
                      onChange={() => toggleFramework(fw)}
                    />
                    {fw}
                  </FrameworkItem>
                ))}
              </FrameworkList>
            </Card>

            <Card>
              <SectionTitle>공개 설정</SectionTitle>
              <VisibilityOption $active={visibility === 'PUBLIC'}>
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'PUBLIC'}
                  onChange={() => setVisibility('PUBLIC')}
                />
                <div>
                  <strong>전체 공개</strong>
                  <span className="desc">모든 사용자가 볼 수 있습니다</span>
                </div>
              </VisibilityOption>
              <VisibilityOption $active={visibility === 'SUBSCRIBERS'}>
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === 'SUBSCRIBERS'}
                  onChange={() => setVisibility('SUBSCRIBERS')}
                />
                <div>
                  <strong>
                    구독자 전용 <PremiumLabel>프리미엄</PremiumLabel>
                  </strong>
                  <span className="desc">나를 구독한 사용자만 볼 수 있습니다</span>
                </div>
              </VisibilityOption>
            </Card>
          </div>
        </WriteGrid>
      </LayoutBody>
    </LayoutRoot>
  );
}
