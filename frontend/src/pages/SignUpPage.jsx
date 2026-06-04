import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sendVerificationEmail, signUp } from '../api/auth'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
    verificationCode: '',
    bio: '',
    link: '',
  })
  const [codeSent, setCodeSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSendCode = async () => {
    if (!form.email) return setError('이메일을 입력해주세요.')
    setSendingCode(true)
    try {
      await sendVerificationEmail(form.email)
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
    if (form.password !== form.passwordConfirm) return setError('비밀번호가 일치하지 않습니다.')
    setLoading(true)
    try {
      await signUp({
        email: form.email,
        nickname: form.nickname,
        password: form.password,
        verificationCode: form.verificationCode,
        bio: form.bio || null,
        link: form.link || null,
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 text-sm transition-shadow'

  return (
    <div className="min-h-screen bg-background flex">
      {/* 왼쪽 패널 */}
      <div className="hidden lg:flex w-72 flex-col flex-shrink-0 bg-card border-r border-border px-8 py-10">
        <div className="mb-8">
          <p className="font-mono text-lg font-medium tracking-tight" style={{ color: 'var(--neon-blue)' }}>&gt;_ errorLog</p>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed">함께 성장하는 개발자 커뮤니티</p>
        </div>

        <div className="flex flex-col gap-5 flex-1">
          {[
            { color: 'var(--neon-blue)', title: '무료 · PRO 게시글', desc: '공개 범위를 선택해서 게시글을 발행할 수 있어요' },
            { color: 'var(--gold)', title: '크리에이터 구독', desc: '관심 전문가를 구독하고 PRO 전용 글을 받아보세요' },
            { color: 'var(--neon-blue)', title: '전문가 질문', desc: '특정 크리에이터에게 직접 질문할 수 있어요' },
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
        <p className="text-xs text-muted-foreground mt-6">© 2025 ErrorLog</p>
      </div>

      {/* 오른쪽 폼 */}
      <div className="flex-1 flex flex-col justify-center px-8 py-10 max-w-md mx-auto w-full">
        {/* 탭 */}
        <div className="flex border-b border-border mb-6">
          <Link to="/login"
            className="flex-1 text-center pb-2.5 text-sm text-muted-foreground border-b-2 border-transparent hover:text-foreground transition-colors">
            로그인
          </Link>
          <span className="flex-1 text-center pb-2.5 text-sm font-medium border-b-2"
            style={{ color: 'var(--neon-blue)', borderColor: 'var(--neon-blue)' }}>
            회원가입
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-1">계정 정보를 입력해 주세요</p>
        <h1 className="text-xl font-medium text-foreground mb-6">회원가입</h1>

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
                  <span className="text-xs text-muted-foreground">인증 코드가 발송되었습니다. 5분 내로 입력해주세요.</span>
                  <span className={`text-xs font-medium tabular-nums ${timeLeft <= 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {timeLeft > 0 ? formatTime(timeLeft) : '만료됨'}
                  </span>
                </div>
                <input type="text" name="verificationCode" value={form.verificationCode} onChange={handleChange}
                  placeholder="인증 코드 6자리" className={`mt-2 ${inputCls}`} />
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">아이디 (핸들)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              <input type="text" name="nickname" value={form.nickname} onChange={handleChange}
                placeholder="kimdev" required className={`pl-7 ${inputCls}`} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              errorlog.io/@{form.nickname || 'kimdev'} 로 공개됩니다
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">비밀번호</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">비밀번호 확인</label>
              <input type="password" name="passwordConfirm" value={form.passwordConfirm} onChange={handleChange}
                placeholder="••••••••" required className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              한 줄 소개 <span className="text-muted-foreground font-normal">(선택)</span>
            </label>
            <input type="text" name="bio" value={form.bio} onChange={handleChange}
              placeholder="React · TypeScript 좋아하는 프론트엔드 개발자입니다"
              className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              GitHub / 블로그 <span className="text-muted-foreground font-normal">(선택)</span>
            </label>
            <input type="url" name="link" value={form.link} onChange={handleChange}
              placeholder="https://github.com/" className={inputCls} />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: 'var(--neon-blue)', color: '#000' }}>
            {loading ? '가입 중...' : '가입 완료'}
          </button>
        </form>
      </div>
    </div>
  )
}
