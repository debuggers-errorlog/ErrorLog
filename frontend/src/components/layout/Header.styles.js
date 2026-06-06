import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  height: ${({ theme }) => theme.layout.headerHeight};
  background: ${({ theme }) => theme.colors.bgElevated};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxContentWidth};
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 20px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.accent};
  white-space: nowrap;
  font-family: ${({ theme }) => theme.font.mono};

  span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
`;

export const SearchBar = styled.div`
  flex: 1;
  max-width: 560px;
  position: relative;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    width: 18px;
    height: 18px;
  }

  input {
    width: 100%;
    padding: 10px 16px 10px 42px;
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
    outline: none;
    transition: border-color 0.15s;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &:focus {
      border-color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;
