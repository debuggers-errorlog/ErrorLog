import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
    LayoutDashboard, Users, FileText,
    UserPlus, MessageCircleQuestion, Flag,
} from 'lucide-react';
import Header from '../../components/layout/Header'; // ⚠️ 본인 파일 위치 기준 경로로 수정

const menuItems = [
    { path: '/admin/dashboard',    label: '대시보드',      icon: LayoutDashboard },
    { path: '/admin/users',        label: '회원 관리',     icon: Users },
    { path: '/admin/content',      label: '콘텐츠 관리',   icon: FileText },
    { path: '/admin/subscription', label: '구독 관리',     icon: UserPlus },
    { path: '/admin/questions',    label: '1:1 질문 관리', icon: MessageCircleQuestion },
    { path: '/admin/reports',      label: '신고/문의 관리', icon: Flag },
];

const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
`;
const Body = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;        /* 자식(본문)이 따로 스크롤되게 하려면 필수 */
`;
const Sidebar = styled.aside`
  width: ${({ theme }) => theme.layout.sidebarWidth};
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
const SidebarTitle = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;
const Nav = styled.nav`
  flex: 1;
  padding: 12px 0;
`;
const MenuLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-right: 3px solid transparent;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
  &.active {                                   /* NavLink가 자동으로 붙여주는 클래스 */
    background: ${({ theme }) => theme.colors.accentDim};
    color: ${({ theme }) => theme.colors.accent};
    border-right-color: ${({ theme }) => theme.colors.accent};
  }
`;
const Main = styled.main`
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    background: #f9fafb;
    color: #1f2937;
`;

export default function AdminLayout() {
    return (
        <Page>
            <Header />
            <Body>
                <Sidebar>
                    <SidebarTitle>관리자 페이지</SidebarTitle>
                    <Nav>
                        {menuItems.map(({ path, label, icon: Icon }) => (
                            <MenuLink key={path} to={path} end>
                                <Icon size={18} />
                                <span>{label}</span>
                            </MenuLink>
                        ))}
                    </Nav>
                </Sidebar>
                <Main>
                    <Outlet />
                </Main>
            </Body>
        </Page>
    );
}