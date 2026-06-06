import styled from 'styled-components';
import { ImagePlus, X } from 'lucide-react';
import { Card, SectionTitle, Button } from '../common/Styled';

export const WriteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  button.cancel {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

export const ImageDropzone = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 48px 24px;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  margin-bottom: 20px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentDim};
  }

  svg {
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  input {
    display: none;
  }
`;

export const PreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

export const PreviewItem = styled.div`
  position: relative;
  width: 120px;
  height: 90px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const TitleInput = styled.input`
  width: 100%;
  padding: 16px 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 28px;
  font-weight: 700;
  outline: none;
  margin-bottom: 16px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const ContentTextarea = styled.textarea`
  width: 100%;
  min-height: 360px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 15px;
  line-height: 1.7;
  resize: vertical;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  outline: none;
  margin-bottom: 16px;
`;

export const TagInputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;

  input {
    flex: 1;
    padding: 10px 12px;
    background: ${({ theme }) => theme.colors.bgElevated};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 14px;
    outline: none;
  }
`;

export const TagChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: ${({ theme }) => theme.colors.accentDim};
  color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 13px;

  button {
    color: inherit;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
`;

export const FrameworkList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FrameworkItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;

  input {
    accent-color: ${({ theme }) => theme.colors.accent};
  }
`;

export const VisibilityOption = styled.label`
  display: flex;
  gap: 12px;
  padding: 14px;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 10px;
  cursor: pointer;
  background: ${({ theme, $active }) => ($active ? theme.colors.accentDim : 'transparent')};

  input {
    margin-top: 4px;
    accent-color: ${({ theme }) => theme.colors.accent};
  }

  strong {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-bottom: 4px;
  }

  span.desc {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const PremiumLabel = styled.span`
  padding: 2px 8px;
  background: rgba(240, 180, 41, 0.15);
  color: #f0b429;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
`;

export function ImageUploadArea({ files, onAdd, onRemove }) {
  const handleChange = (e) => {
    onAdd(Array.from(e.target.files || []));
    e.target.value = '';
  };

  return (
    <>
      {files.length > 0 && (
        <PreviewGrid>
          {files.map((file, idx) => (
            <PreviewItem key={`${file.name}-${idx}`}>
              <img src={URL.createObjectURL(file)} alt="" />
              <button type="button" onClick={() => onRemove(idx)}>
                <X size={14} />
              </button>
            </PreviewItem>
          ))}
        </PreviewGrid>
      )}
      <ImageDropzone onClick={() => document.getElementById('image-input')?.click()}>
        <input id="image-input" type="file" accept="image/*" multiple onChange={handleChange} />
        <ImagePlus size={40} />
        <p>클릭하여 이미지 추가 또는 드래그 앤 드롭</p>
      </ImageDropzone>
    </>
  );
}

export { Button, Card, SectionTitle };
