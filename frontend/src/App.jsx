import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SubscriptionInfoPage } from './components/SubscriptionInfoPage' // 1. 구독전 정보확인
import { SubscriptionPaymentPage } from './components/SubscriptionPaymentPage' // 2. 결제창
import { SubscriptionManagePage } from './components/SubscriptionManagePage.jsx' // 3. 구독관리

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
        </Routes>
      </BrowserRouter>
  )
}

export default App