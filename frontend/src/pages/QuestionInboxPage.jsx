import { Navigate, useLocation } from 'react-router-dom'

/** @deprecated 마이페이지 > 내 질문으로 통합됨 */
export default function QuestionInboxPage() {
  const location = useLocation()
  const questionTab = location.state?.tab === 'sent' ? 'sent-requests' : 'received-requests'

  return (
    <Navigate
      to="/mypage"
      replace
      state={{ questionTab }}
    />
  )
}
