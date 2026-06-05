import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { GlobalStyle } from './theme/GlobalStyle';

// 모든 페이지 임포트
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MyPage from './pages/MyPage';
import PasswordResetPage from './pages/PasswordResetPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import OAuthAdditionalInfoPage from './pages/OAuthAdditionalInfoPage';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import WritePostPage from './pages/WritePostPage';
import SearchPage from './pages/SearchPage';

// 로그인 여부 확인용 컴포넌트
function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <div className="dark">
            <Routes>
              {/* 인증 관련 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
              <Route path="/oauth/additional-info" element={<OAuthAdditionalInfoPage />} />

              {/* 게시판 관련 */}
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:postId" element={<PostDetailPage />} />
              <Route path="/write" element={<WritePostPage />} />
              <Route path="/search" element={<SearchPage />} />

              {/* 보호된 경로 */}
              <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />

              {/* 잘못된 경로 접근 시 홈으로 이동 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
  );
}