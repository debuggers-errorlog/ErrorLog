import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { GlobalStyle } from './theme/GlobalStyle';
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
import { SubscriptionInfoPage } from './pages/SubscriptionInfoPage';
import { SubscriptionPaymentPage } from './pages/SubscriptionPaymentPage';
import { SubscriptionManagePage } from './pages/SubscriptionManagePage';
import { SettlementPage } from './pages/SettlementPage';
import { SubscriptionSettingsPage } from './pages/SubscriptionSettingsPage';
import AdminLayout from './components/layout/Adminlayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import UserManagement from './pages/admin/UserManagement.jsx'
import ContentManagement from './pages/admin/ContentManagement.jsx'
import SettlementManagement from './pages/admin/SettlementManagement.jsx'
import SubscriptionManagement from './pages/admin/SubscriptionManagement.jsx'
import QuestionManagement from './pages/admin/QuestionManagement.jsx'
import ReportManagement from './pages/admin/ReportManagement.jsx'
import AdminRoute from './components/admin/AdminRoute';
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="/oauth/additional-info" element={<OAuthAdditionalInfoPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="/write" element={<WritePostPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
            <Route path="/subscriptions/:creatorId/info" element={<SubscriptionInfoPage />} />
            <Route path="/subscriptions/:creatorId/payment" element={<PrivateRoute><SubscriptionPaymentPage /></PrivateRoute>} />
            <Route path="/subscriptions/manage" element={<PrivateRoute><SubscriptionManagePage /></PrivateRoute>} />
            <Route path="/subscription-settings" element={<PrivateRoute><SubscriptionSettingsPage /></PrivateRoute>} />
            <Route path="/settlement" element={<PrivateRoute><SettlementPage /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="settlement" element={<SettlementManagement />} />
                <Route path="subscription" element={<SubscriptionManagement />} />
                <Route path="questions" element={<QuestionManagement />} />
                <Route path="reports" element={<ReportManagement />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}