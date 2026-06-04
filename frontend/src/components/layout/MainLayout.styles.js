import styled from 'styled-components';

export const LayoutRoot = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const LayoutBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 24px;
`;

export const LayoutGrid = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxContentWidth};
  display: grid;
  grid-template-columns: ${({ theme, $hideRight }) =>
    `${theme.layout.sidebarWidth} 1fr ${$hideRight ? '0' : theme.layout.rightSidebarWidth}`};
  gap: 24px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: ${({ theme }) => theme.layout.sidebarWidth} 1fr;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const MainColumn = styled.main`
  min-width: 0;
`;

export const RightColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 1200px) {
    display: none;
  }
`;

export const WriteGrid = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxContentWidth};
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
