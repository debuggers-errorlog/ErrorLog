import styled from 'styled-components';
import { Star } from 'lucide-react';
import { Card, SectionTitle } from '../common/Styled';

const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  span.label {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  span.value {
    font-size: 22px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export default function WeeklyStats({ stats }) {
  return (
    <Card>
      <SectionTitle>
        <Star size={16} color="#00c2ff" style={{ marginLeft: -4 }} />
        이번 주 통계
      </SectionTitle>
      <StatRow>
        <span className="label">새로운 게시물</span>
        <span className="value">{stats.newPosts}</span>
      </StatRow>
    </Card>
  );
}
