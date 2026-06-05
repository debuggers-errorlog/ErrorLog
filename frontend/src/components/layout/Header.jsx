import { Search, PenLine, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Styled';
import {
  HeaderWrapper,
  HeaderInner,
  Logo,
  SearchBar,
  HeaderActions,
} from './Header.styles';

export default function Header({ searchValue, onSearchChange, onSearchSubmit }) {
  const navigate = useNavigate();

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <HeaderWrapper>
      <HeaderInner>
        <Logo to="/">
          {'>_ '}
          <span>errorLog</span>
        </Logo>

        <SearchBar>
          <Search />
          <input
            type="search"
            placeholder="에러 코드나 키워드로 검색..."
            value={searchValue ?? ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </SearchBar>

        <HeaderActions>
          <Button $variant="primary" onClick={() => navigate('/write')}>
            <PenLine size={16} />
            글 작성하기
          </Button>
          <Button $variant="ghost" onClick={() => navigate('/mypage')}>
            <User size={16} />
            마이페이지
          </Button>
        </HeaderActions>
      </HeaderInner>
    </HeaderWrapper>
  );
}
