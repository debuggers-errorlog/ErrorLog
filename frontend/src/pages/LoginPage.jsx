import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { login } from '../api/auth'
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

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 24px;
`

const Tab = styled.span`
  flex: 1;
  text-align: center;
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.textMuted)};
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  cursor: pointer;
  transition: color 0.15s;
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

const SessionBanner = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 3px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 16px;
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

const Input = styled.input`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
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

const TextButton = styled.button`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
    white-space: nowrap;
  }
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`

const SocialButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`

const GoogleBadge = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: #444;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`

const BottomText = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 8px;
  a {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    &:hover { text-decoration: underline; }
  }
`

const FEATURES = [
  { color: '#00c2ff', title: '무료 게시글', desc: '누구나 트러블슈팅 경험을 공유할 수 있어요' },
  { color: '#f0b429', title: '크리에이터 구독', desc: '특정 전문가를 구독하고 PRO 콘텐츠를 받아보세요' },
  { color: '#00c2ff', title: '전문가 질문', desc: '크리에이터에게 직접 질문할 수 있어요' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('session') === 'expired'
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
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.')
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
          <LogoSub>개발자들의 트러블슈팅 지식이 모이는 곳</LogoSub>
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
          <Tabs>
            <Tab $active>로그인</Tab>
            <Tab as={Link} to="/signup">회원가입</Tab>
          </Tabs>

          <Subtitle>다시 오셨군요!</Subtitle>
          <Title>계정에 로그인하여 이어서 학습하세요</Title>

          {sessionExpired && (
            <SessionBanner>
              세션이 만료되었습니다. 다시 로그인해주세요.
            </SessionBanner>
          )}

          <Form onSubmit={handleSubmit}>
            <Field>
              <Label>이메일</Label>
              <Input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="kim@example.com" required />
            </Field>

            <Field>
              <Label>비밀번호</Label>
              <Input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required />
            </Field>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </SubmitButton>

            <TextButton type="button" onClick={() => navigate('/password-reset')}>
              비밀번호를 잊으셨나요?
            </TextButton>

            <Divider><span>또는 소셜 계정으로</span></Divider>

            <SocialButton type="button"
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}>
              <GoogleBadge>G</GoogleBadge>
              구글
            </SocialButton>
          </Form>

          <BottomText>
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </BottomText>
        </FormSection>
      </PageWrapper>
    </>
  )
}
