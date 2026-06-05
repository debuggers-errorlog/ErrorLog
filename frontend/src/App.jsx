import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SubscriptionInfoPage } from './pages/SubscriptionInfoPage' // 1. 구독전 정보확인
import { SubscriptionPaymentPage } from './pages/SubscriptionPaymentPage' // 2. 결제창
import { SubscriptionManagePage } from './pages/SubscriptionManagePage.jsx' // 3. 구독관리
import { SubscriptionSettingsPage } from './pages/SubscriptionSettingsPage' // 4. 구독 플랜 설정

function App() {
  return (
      <BrowserRouter>
        <Routes>
            {/* 구독 결제 정보 확인 */}
          <Route path="/subscriptions/:creatorId/info" element={<SubscriptionInfoPage />} />
            {/* 결제 화면 */}
            <Route path="/subscriptions/:creatorId/payment" element={<SubscriptionPaymentPage />} />
            {/* 구독 관리 */}
            <Route path="/subscriptions/manage" element={<SubscriptionManagePage />} />
            {/* 구독 플랜 설정 */}
            <Route path="/subscription-settings" element={<SubscriptionSettingsPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App