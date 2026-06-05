import styled, { css } from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ $size }) => ($size === 'sm' ? '8px 14px' : '10px 18px')};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ $size }) => ($size === 'sm' ? '13px' : '14px')};
  font-weight: 600;
  transition: background 0.15s, border-color 0.15s, color 0.15s;

  ${({ $variant, theme }) =>
    $variant === 'primary' &&
    css`
      background: ${theme.colors.accent};
      color: #0b0e14;
      &:hover {
        background: ${theme.colors.accentHover};
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'ghost' &&
    css`
      background: transparent;
      color: ${theme.colors.text};
      border: 1px solid ${theme.colors.borderLight};
      &:hover {
        background: ${theme.colors.surfaceHover};
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'outline' &&
    css`
      background: transparent;
      color: ${theme.colors.accent};
      border: 1px solid ${theme.colors.accent};
      &:hover {
        background: ${theme.colors.accentDim};
      }
    `}
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme, $bg, $color }) =>
    $color === 'premium' ? theme.colors.premiumDim : $bg || theme.colors.accentDim};
  color: ${({ theme, $text, $color }) =>
    $color === 'premium' ? theme.colors.premium : $text || theme.colors.accent};
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ $padding }) => $padding || '20px'};
`;

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};

  &::before {
    content: '';
    width: 3px;
    height: 16px;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 2px;
  }
`;

export const Avatar = styled.div`
  width: ${({ $size }) => $size || 36}px;
  height: ${({ $size }) => $size || 36}px;
  border-radius: 50%;
  background: ${({ $color }) => $color || '#3b82f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => ($size > 36 ? 16 : 13)}px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`;
