import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MyPage from './pages/MyPage'
import PasswordResetPage from './pages/PasswordResetPage'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="dark">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
