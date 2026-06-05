import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'

export default function OAuthAdditionalInfoPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tempToken = searchParams.get('tempToken')

  const [form, setForm] = useState({ nickname: '', bio: '', link: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!tempToken) return navigate('/login', { replace: true })
    setLoading(true)
    try {
      const { data } = await api.post('/auth/oauth/additional-info', form, {
        headers: { Authorization: `Bearer ${tempToken}` },
      })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      navigate('/mypage', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || '정보 저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-input-background text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 text-sm transition-shadow'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-muted-foreground text-sm mb-1">거의 다 왔어요!</p>
        <h1 className="text-2xl font-medium text-foreground mb-6">프로필을 완성해 주세요</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">닉네임 *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
              <input type="text" name="nickname" value={form.nickname} onChange={handleChange}
                placeholder="kimdev" required className={`pl-7 ${inputCls}`} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              errorlog.io/@{form.nickname || 'kimdev'} 로 공개됩니다
            </p>
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
            {loading ? '저장 중...' : '가입 완료'}
          </button>
        </form>
      </div>
    </div>
  )
}
