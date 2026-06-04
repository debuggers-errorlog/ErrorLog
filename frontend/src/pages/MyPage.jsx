import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProfile, updateMyProfile } from '../api/user'
import { logout, withdraw } from '../api/auth'

const NAV_ITEMS = [
  { key: 'summary', label: '활동 요약' },
  { key: 'posts', label: '내 게시글' },
  { key: 'answers', label: '내 답변' },
  { key: 'questions', label: '내 질문' },
  { key: 'subscriptions', label: '구독 관리' },
]

export default function MyPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [activeNav, setActiveNav] = useState('summary')
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ nickname: '', password: '', bio: '', link: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [withdrawPassword, setWithdrawPassword] = useState('')
  const [showWithdraw, setShowWithdraw] = useState(false)

  useEffect(() => {
    getMyProfile()
      .then(({ data }) => {
        setProfile(data)
        setForm({ nickname: data.nickname, password: '', bio: data.bio || '', link: data.link || '' })
      })
      .catch(() => navigate('/login'))
  }, [navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {}
      if (form.nickname !== profile.nickname) payload.nickname = form.nickname
      if (form.password) payload.password = form.password
      if (form.bio !== (profile.bio || '')) payload.bio = form.bio
      if (form.link !== (profile.link || '')) payload.link = form.link
      const { data } = await updateMyProfile(payload)
      setProfile(data)
      setEditMode(false)
      setForm({ nickname: data.nickname, password: '', bio: data.bio || '', link: data.link || '' })
    } catch (err) {
      setError(err.response?.data?.message || '수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try { await logout() } finally {
      localStorage.clear()
      navigate('/login')
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawPassword) return setError('비밀번호를 입력해주세요.')
    try {
      await withdraw(withdrawPassword)
      localStorage.clear()
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || '회원탈퇴에 실패했습니다.')
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">불러오는 중...</p>
      </div>
    )
  }

  const initials = profile.nickname?.slice(0, 1).toUpperCase() || '?'
  const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-input-background text-input-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 text-sm transition-shadow'

  return (
    <div className="min-h-screen bg-background flex">
      {/* 사이드바 */}
      <aside className="w-52 flex-shrink-0 border-r border-border bg-card flex flex-col py-6 px-3">
        {/* 프로필 헤더 */}
        <div className="text-center pb-5 mb-4 border-b border-border">
          <div className="w-12 h-12 rounded-full bg-accent border border-border flex items-center justify-center text-lg font-medium mx-auto mb-2.5"
            style={{ color: 'var(--neon-blue)' }}>
            {initials}
          </div>
          <p className="text-sm font-medium text-foreground truncate">{profile.nickname}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{profile.email}</p>
        </div>

        {/* 네비게이션 */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.key} onClick={() => { setActiveNav(item.key); setEditMode(false) }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                activeNav === item.key
                  ? 'bg-accent border border-border font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
              style={activeNav === item.key ? { color: 'var(--neon-blue)' } : {}}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* 하단 메뉴 */}
        <div className="mt-4 pt-4 border-t border-border flex flex-col gap-0.5">
          <button onClick={() => { setActiveNav('edit'); setEditMode(true) }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors text-left">
            프로필 편집
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors text-left">
            로그아웃
          </button>
          <button onClick={() => setShowWithdraw(!showWithdraw)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors text-left">
            회원탈퇴
          </button>
        </div>
      </aside>

      {/* 메인 */}
      <main className="flex-1 px-8 py-8 overflow-y-auto">

        {/* ── 활동 요약 ── */}
        {activeNav === 'summary' && (
          <div>
            <h2 className="text-base font-medium text-foreground mb-5">활동 요약</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: '게시글', value: '-', accent: true },
                { label: '답변', value: '-' },
                { label: '구독 중', value: '-', gold: true },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xl font-medium mb-1"
                    style={{ color: s.accent ? 'var(--neon-blue)' : s.gold ? 'var(--gold)' : 'var(--foreground)' }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">최근 활동 내역이 여기에 표시됩니다.</p>
          </div>
        )}

        {/* ── 프로필 편집 ── */}
        {(activeNav === 'edit' || editMode) && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-medium text-foreground">프로필 편집</h2>
              <button onClick={() => { setEditMode(false); setActiveNav('summary') }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                취소
              </button>
            </div>
            <form onSubmit={handleUpdate} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">닉네임</label>
                <input type="text" name="nickname" value={form.nickname} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  새 비밀번호 <span className="text-muted-foreground font-normal">(변경 시에만 입력)</span>
                </label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">한 줄 소개</label>
                <input type="text" name="bio" value={form.bio} onChange={handleChange}
                  placeholder="한 줄 소개를 입력해주세요" className={inputCls} />
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
                {loading ? '저장 중...' : '저장'}
              </button>
            </form>
          </div>
        )}

        {/* ── 그 외 메뉴 플레이스홀더 ── */}
        {!['summary', 'edit'].includes(activeNav) && !editMode && (
          <div>
            <h2 className="text-base font-medium text-foreground mb-5">
              {NAV_ITEMS.find(n => n.key === activeNav)?.label}
            </h2>
            <p className="text-sm text-muted-foreground">준비 중입니다.</p>
          </div>
        )}

        {/* ── 회원탈퇴 패널 ── */}
        {showWithdraw && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
            <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-base font-medium text-foreground">회원탈퇴</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                탈퇴하시려면 비밀번호를 입력해주세요. 이 작업은 되돌릴 수 없습니다.
              </p>
              <input type="password" value={withdrawPassword}
                onChange={(e) => { setWithdrawPassword(e.target.value); setError('') }}
                placeholder="비밀번호 입력" className={inputCls} />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <div className="flex gap-2">
                <button onClick={() => setShowWithdraw(false)}
                  className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors">
                  취소
                </button>
                <button onClick={handleWithdraw}
                  className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                  탈퇴 확인
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
