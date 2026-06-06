import styled from 'styled-components';
import { Card, SectionTitle } from '../common/Styled';

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.accent};
  }
`;

const SubLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 8px;
`;

export default function FilterSidebar({ showFree, showPremium, onToggleFree, onTogglePremium }) {
  return (
    <Card>
      <SectionTitle>필터</SectionTitle>
      <SubLabel>게시물 유형</SubLabel>
      <CheckRow>
        <input type="checkbox" checked={showFree} onChange={(e) => onToggleFree(e.target.checked)} />
        무료 콘텐츠
      </CheckRow>
      <CheckRow>
        <input
          type="checkbox"
          checked={showPremium}
          onChange={(e) => onTogglePremium(e.target.checked)}
        />
        프리미엄 콘텐츠
      </CheckRow>
    </Card>
  );
}
