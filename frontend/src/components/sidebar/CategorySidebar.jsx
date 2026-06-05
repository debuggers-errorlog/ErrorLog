import styled from 'styled-components';
import { Card, SectionTitle } from '../common/Styled';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Item = styled.li`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 14px;
    color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.textSecondary)};
    background: ${({ theme, $active }) => ($active ? theme.colors.accentDim : 'transparent')};
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: ${({ theme, $active }) =>
        $active ? theme.colors.accentDim : theme.colors.surfaceHover};
      color: ${({ theme, $active }) => ($active ? theme.colors.accent : theme.colors.text)};
    }

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
  }

  span.count {
    margin-left: auto;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export default function CategorySidebar({ categories, activeId, onSelect }) {
  return (
    <Card>
      <SectionTitle>카테고리</SectionTitle>
      <List>
        {categories.map(({ id, label, icon: Icon, count }) => (
          <Item key={id} $active={activeId === id}>
            <button type="button" onClick={() => onSelect(id)}>
              <Icon size={18} />
              {label}
              <span className="count">{count.toLocaleString()}</span>
            </button>
          </Item>
        ))}
      </List>
    </Card>
  );
}
