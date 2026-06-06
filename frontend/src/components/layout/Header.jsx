import { useState, useEffect } from 'react';
import { Search, PenLine, User, LogIn, UserPlus } from 'lucide-react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));

  useEffect(() => {
    const handleStorage = () => setIsLoggedIn(!!localStorage.getItem('accessToken'));
    window.addEventListener('storage', handleStorage);
    // 라우트 이동 시에도 반영되도록 주기적으로 체크
    const interval = setInterval(handleStorage, 500);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

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
          {isLoggedIn ? (
            <>
              <Button $variant="primary" onClick={() => navigate('/write')}>
                <PenLine size={16} />
                글 작성하기
              </Button>
              <Button $variant="ghost" onClick={() => navigate('/mypage')}>
                <User size={16} />
                마이페이지
              </Button>
            </>
          ) : (
            <>
              <Button $variant="ghost" onClick={() => navigate('/login')}>
                <LogIn size={16} />
                로그인
              </Button>
              <Button $variant="primary" onClick={() => navigate('/signup')}>
                <UserPlus size={16} />
                회원가입
              </Button>
            </>
          )}
        </HeaderActions>
      </HeaderInner>
    </HeaderWrapper>
  );
}
