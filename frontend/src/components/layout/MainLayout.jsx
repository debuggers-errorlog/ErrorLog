import Header from './Header';
import {
  LayoutRoot,
  LayoutBody,
  LayoutGrid,
  LeftColumn,
  MainColumn,
  RightColumn,
} from './MainLayout.styles';

export default function MainLayout({
  children,
  rightSidebar,
  leftSidebar,
  hideRight = false,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}) {
  return (
    <LayoutRoot>
      <Header
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
      />
      <LayoutBody>
        <LayoutGrid $hideRight={hideRight || !rightSidebar}>
          <LeftColumn>{leftSidebar}</LeftColumn>
          <MainColumn>{children}</MainColumn>
          {!hideRight && rightSidebar && <RightColumn>{rightSidebar}</RightColumn>}
        </LayoutGrid>
      </LayoutBody>
    </LayoutRoot>
  );
}

export { LayoutBody, WriteGrid } from './MainLayout.styles';
