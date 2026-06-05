import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendVerificationEmail, resetPassword } from '../api/auth'

export default function PasswordResetPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', verificationCode: '', newPassword: '', newPasswordConfirm: '' })
  const [codeSent, setCodeSent] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  const startTimer = () => {
    setTimeLeft(300)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSendCode = async () => {
    if (!form.email) return setError('이메일을 입력해주세요.')
    setSendingCode(true)
    try {
      await sendVerificationEmail(form.email, 'PASSWORD_RESET')
      setCodeSent(true)
      startTimer()
    } catch (err) {
      setError(err.response?.data?.message || '인증 코드 발송에 실패했습니다.')
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!codeSent) return setError('이메일 인증을 완료해주세요.')
    if (form.newPassword !== form.newPasswordConfirm) return setError('비밀번호가 일치하지 않습니다.')
    setLoading(true)
    try {
      await resetPassword({
        email: form.email,
        verificationCode: form.verificationCode,
        newPassword: form.newPassword,
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || '비밀번호 재설정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 text-sm transition-shadow'

  return (
    <div className="min-h-screen bg-background flex">
      {/* 왼쪽 브랜드 패널 */}
      <div className="hidden lg:flex w-72 flex-col flex-shrink-0 bg-card border-r border-border px-8 py-10">
        <div className="mb-8">
          <p className="font-mono text-lg font-medium tracking-tight" style={{ color: 'var(--neon-blue)' }}>&gt;_ errorLog</p>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed">개발자들의 트러블슈팅 지식이 모이는 곳</p>
        </div>
        <div className="flex flex-col gap-5 flex-1">
          {[
            { color: 'var(--neon-blue)', title: '무료 게시글', desc: '누구나 트러블슈팅 경험을 공유할 수 있어요' },
            { color: 'var(--gold)', title: '크리에이터 구독', desc: '특정 전문가를 구독하고 PRO 콘텐츠를 받아보세요' },
            { color: 'var(--neon-blue)', title: '전문가 질문', desc: '크리에이터에게 직접 질문할 수 있어요' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.color }} />
              <div>
                <p className="text-sm font-medium text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">© 2025 ErrorLog</p>
      </div>

      {/* 오른쪽 폼 */}
      <div className="flex-1 flex flex-col justify-center px-8 py-10 max-w-md mx-auto w-full">
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
          ← 로그인으로 돌아가기
        </Link>

        <p className="text-muted-foreground text-sm mb-1">이메일로 인증 후 재설정할 수 있어요</p>
        <h1 className="text-2xl font-medium text-foreground mb-6">비밀번호 재설정</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">이메일</label>
            <div className="flex gap-2">
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="kim@example.com" required className={`flex-1 ${inputCls}`} />
              <button type="button" onClick={handleSendCode} disabled={sendingCode}
                className="px-3 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50 whitespace-nowrap">
                {sendingCode ? '발송 중...' : codeSent ? '재발송' : '인증'}
              </button>
            </div>
            {codeSent && (
              <>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-muted-foreground">인증 코드가 발송되었습니다</span>
                  <span className={`text-xs font-medium tabular-nums ${timeLeft <= 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {timeLeft > 0 ? formatTime(timeLeft) : '만료됨'}
                  </span>
                </div>
                <input type="text" name="verificationCode" value={form.verificationCode} onChange={handleChange}
                  placeholder="인증 코드 6자리" className={`mt-2 ${inputCls}`} />
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">새 비밀번호</label>
              <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange}
                placeholder="••••••••" required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">비밀번호 확인</label>
              <input type="password" name="newPasswordConfirm" value={form.newPasswordConfirm} onChange={handleChange}
                placeholder="••••••••" required className={inputCls} />
            </div>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: 'var(--neon-blue)', color: '#000' }}>
            {loading ? '재설정 중...' : '비밀번호 재설정'}
          </button>
        </form>
      </div>
    </div>
  )
}
