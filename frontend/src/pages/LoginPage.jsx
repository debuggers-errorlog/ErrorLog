import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(form)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      navigate('/mypage')
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* 왼쪽 브랜드 패널 */}
      <div className="hidden lg:flex w-72 flex-col flex-shrink-0 bg-card border-r border-border px-8 py-10">
        <div className="mb-8">
          <p className="font-mono text-[var(--neon-blue)] text-lg font-medium tracking-tight">&gt;_ errorLog</p>
          <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
            개발자들의 트러블슈팅 지식이 모이는 곳
          </p>
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
        {/* 탭 */}
        <div className="flex border-b border-border mb-6">
          <span className="flex-1 text-center pb-2.5 text-sm font-medium border-b-2 text-[var(--neon-blue)]"
            style={{ borderColor: 'var(--neon-blue)' }}>
            로그인
          </span>
          <Link to="/signup"
            className="flex-1 text-center pb-2.5 text-sm text-muted-foreground border-b-2 border-transparent hover:text-foreground transition-colors">
            회원가입
          </Link>
        </div>

        <p className="text-muted-foreground text-sm mb-1">다시 오셨군요!</p>
        <h1 className="text-2xl font-medium text-foreground mb-6">계정에 로그인하여 이어서 학습하세요</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="kim@example.com"
              required
              className="w-full px-3 py-2.5 rounded-lg bg-input-background text-input-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 text-sm transition-shadow"
              style={{ '--tw-ring-color': 'var(--neon-blue-glow)' }}
            />
          </div>

          <div>
            <div className="flex items-center mb-1.5">
              <label className="text-sm font-medium text-foreground">비밀번호</label>
            </div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2.5 rounded-lg bg-input-background text-input-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 text-sm transition-shadow"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-sm transition-opacity disabled:opacity-50 hover:opacity-90"
            style={{ background: 'var(--neon-blue)', color: '#000' }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/password-reset')}
            className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            비밀번호를 잊으셨나요?
          </button>
        </form>

      </div>
    </div>
  )
}
