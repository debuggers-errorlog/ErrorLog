import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme/theme'
import { GlobalStyle } from './theme/GlobalStyle'
import { SubscriptionInfoPage } from './pages/SubscriptionInfoPage'
import { SubscriptionPaymentPage } from './pages/SubscriptionPaymentPage'
import { SubscriptionManagePage } from './pages/SubscriptionManagePage'
import { SettlementPage } from './pages/SettlementPage'
import { SubscriptionSettingsPage } from './pages/SubscriptionSettingsPage'

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <BrowserRouter>
                <Routes>
                    <Route path="/subscriptions/:creatorId/info" element={<SubscriptionInfoPage />} /> {/*구독 결제 전 정보 화면*/}
                    <Route path="/subscriptions/:creatorId/payment" element={<SubscriptionPaymentPage />} /> {/*구독 결제 화면*/}
                    <Route path="/subscriptions/manage" element={<SubscriptionManagePage />} /> {/*구독 관리 화면*/}
                    <Route path="/subscription-settings" element={<SubscriptionSettingsPage />} />  {/*구독 플랜 설정 화면*/}
                    <Route path="/settlement" element={<SettlementPage />} /> {/*정산 화면*/}
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App