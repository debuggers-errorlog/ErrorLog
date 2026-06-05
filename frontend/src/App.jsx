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
                    <Route path="/subscriptions/:creatorId/info" element={<SubscriptionInfoPage />} />
                    <Route path="/subscriptions/:creatorId/payment" element={<SubscriptionPaymentPage />} />
                    <Route path="/subscriptions/manage" element={<SubscriptionManagePage />} />
                    <Route path="/subscription-settings" element={<SubscriptionSettingsPage />} />
                    <Route path="/settlement" element={<SettlementPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App