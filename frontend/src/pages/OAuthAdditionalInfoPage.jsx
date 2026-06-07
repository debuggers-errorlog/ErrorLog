import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import api from '../api/axios'
import { saveTokens } from '../utils/authSession'
import Header from '../components/layout/Header'

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
`

const SidePanel = styled.div`
  width: 280px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) { display: none; }
`

const Logo = styled.p`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 4px;
`

const LogoSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  margin-bottom: 32px;
`

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const FeatureDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
  margin-top: 6px;
`

const FeatureTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`

const FeatureDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`

const Copyright = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 32px;
  max-width: 440px;
  margin: 0 auto;
  width: 100%;
`

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
`

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

const OptionalBadge = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
`

const NicknameWrapper = styled.div`
  position: relative;
  span {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
  }
  input { padding-left: 24px; }
`

const Input = styled.input`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  width: 100%;
  transition: border-color 0.15s;
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`

const Hint = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`

const SubmitButton = styled.button`
  padding: 11px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.accent};
  color: #0b0e14;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; }
`

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
`

const FEATURES = [
  { color: '#00c2ff', title: '무료 · PRO 게시글', desc: '공개 범위를 선택해서 게시글을 발행할 수 있어요' },
  { color: '#f0b429', title: '크리에이터 구독', desc: '관심 전문가를 구독하고 PRO 전용 글을 받아보세요' },
  { color: '#00c2ff', title: '전문가 질문', desc: '특정 크리에이터에게 직접 질문할 수 있어요' },
]

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
      saveTokens(data.accessToken, data.refreshToken)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || '정보 저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <PageWrapper>
        <SidePanel>
          <Logo>&gt;_ errorLog</Logo>
          <LogoSub>함께 성장하는 개발자 커뮤니티</LogoSub>
          <FeatureList>
            {FEATURES.map((f) => (
              <FeatureItem key={f.title}>
                <FeatureDot $color={f.color} />
                <div>
                  <FeatureTitle>{f.title}</FeatureTitle>
                  <FeatureDesc>{f.desc}</FeatureDesc>
                </div>
              </FeatureItem>
            ))}
          </FeatureList>
          <Copyright>© 2025 ErrorLog</Copyright>
        </SidePanel>

        <FormSection>
          <Subtitle>거의 다 왔어요!</Subtitle>
          <Title>프로필을 완성해 주세요</Title>

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>닉네임 *</Label>
              <NicknameWrapper>
                <span>@</span>
                <Input type="text" name="nickname" value={form.nickname}
                  onChange={handleChange} placeholder="kimdev" required />
              </NicknameWrapper>
              <Hint>errorlog.io/@{form.nickname || 'kimdev'} 로 공개됩니다</Hint>
            </Field>

            <Field>
              <Label>한 줄 소개 <OptionalBadge>(선택)</OptionalBadge></Label>
              <Input type="text" name="bio" value={form.bio} onChange={handleChange}
                placeholder="React · TypeScript 좋아하는 프론트엔드 개발자입니다" />
            </Field>

            <Field>
              <Label>GitHub / 블로그 <OptionalBadge>(선택)</OptionalBadge></Label>
              <Input type="url" name="link" value={form.link} onChange={handleChange}
                placeholder="https://github.com/" />
            </Field>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? '저장 중...' : '가입 완료'}
            </SubmitButton>
          </Form>
        </FormSection>
      </PageWrapper>
    </>
  )
}
