import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { sendVerificationEmail, signUp } from '../api/auth'
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
  overflow-y: auto;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  width: 100%;
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`

const InputRow = styled.div`
  display: flex;
  gap: 8px;
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

const Hint = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`

const GridTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`

const VerifyButton = styled.button`
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.surfaceHover}; }
  &:disabled { opacity: 0.5; }
`

const TimerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
`

const TimerText = styled.span`
  font-size: 12px;
  color: ${({ $expired, theme }) => ($expired ? theme.colors.danger : theme.colors.textMuted)};
  font-variant-numeric: tabular-nums;
`

const SubmitButton = styled.button`
  padding: 11px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.accent};
  color: #0b0e14;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.15s;
  margin-top: 4px;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; }
`

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
`

const BottomText = styled.p`
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 12px;
  a {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    &:hover { text-decoration: underline; }
  }
`

const OptionalBadge = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
`

const FEATURES = [
  { color: '#00c2ff', title: '무료 · PRO 게시글', desc: '공개 범위를 선택해서 게시글을 발행할 수 있어요' },
  { color: '#f0b429', title: '크리에이터 구독', desc: '관심 전문가를 구독하고 PRO 전용 글을 받아보세요' },
  { color: '#00c2ff', title: '전문가 질문', desc: '특정 크리에이터에게 직접 질문할 수 있어요' },
]

export default function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', nickname: '', password: '', passwordConfirm: '',
    verificationCode: '', bio: '', link: '',
  })
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

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSendCode = async () => {
    if (!form.email) return setError('이메일을 입력해주세요.')
    setSendingCode(true)
    try {
      await sendVerificationEmail(form.email, 'SIGNUP')
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
        <Tabs>
          <Tab as={Link} to="/login">로그인</Tab>
          <Tab $active>회원가입</Tab>
        </Tabs>

        <Subtitle>계정 정보를 입력해 주세요</Subtitle>
        <Title>회원가입</Title>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>이름</Label>
            <Input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="김민준" required />
          </Field>

          <Field>
            <Label>이메일</Label>
            <InputRow>
              <Input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="kim@example.com" required />
              <VerifyButton type="button" onClick={handleSendCode} disabled={sendingCode}>
                {sendingCode ? '발송 중...' : codeSent ? '재발송' : '인증'}
              </VerifyButton>
            </InputRow>
            {codeSent && (
              <>
                <TimerRow>
                  <span style={{ fontSize: 12, color: '#8b949e' }}>인증 코드가 발송되었습니다</span>
                  <TimerText $expired={timeLeft === 0}>
                    {timeLeft > 0 ? formatTime(timeLeft) : '만료됨'}
                  </TimerText>
                </TimerRow>
                <Input type="text" name="verificationCode" value={form.verificationCode}
                  onChange={handleChange} placeholder="인증 코드 6자리" />
              </>
            )}
          </Field>

          <Field>
            <Label>아이디 (핸들)</Label>
            <NicknameWrapper>
              <span>@</span>
              <Input type="text" name="nickname" value={form.nickname} onChange={handleChange}
                placeholder="kimdev" required />
            </NicknameWrapper>
            <Hint>errorlog.io/@{form.nickname || 'kimdev'} 로 공개됩니다</Hint>
          </Field>

          <GridTwo>
            <Field>
              <Label>비밀번호</Label>
              <Input type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••" required />
            </Field>
            <Field>
              <Label>비밀번호 확인</Label>
              <Input type="password" name="passwordConfirm" value={form.passwordConfirm}
                onChange={handleChange} placeholder="••••••••" required />
            </Field>
          </GridTwo>

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
            {loading ? '가입 중...' : '가입 완료'}
          </SubmitButton>
        </Form>

        <BottomText>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </BottomText>
      </FormSection>
    </PageWrapper>
    </>
  )
}
