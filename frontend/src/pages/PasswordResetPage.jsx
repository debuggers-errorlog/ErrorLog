import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { sendVerificationEmail, resetPassword } from '../api/auth'
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

const BackLink = styled(Link)`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: inline-block;
  margin-bottom: 32px;
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
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

const InputRow = styled.div`
  display: flex;
  gap: 8px;
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

const GridTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
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
  { color: '#00c2ff', title: '무료 게시글', desc: '누구나 트러블슈팅 경험을 공유할 수 있어요' },
  { color: '#f0b429', title: '크리에이터 구독', desc: '특정 전문가를 구독하고 PRO 콘텐츠를 받아보세요' },
  { color: '#00c2ff', title: '전문가 질문', desc: '크리에이터에게 직접 질문할 수 있어요' },
]

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
          <BackLink to="/login">← 로그인으로 돌아가기</BackLink>
          <Subtitle>이메일로 인증 후 재설정할 수 있어요</Subtitle>
          <Title>비밀번호 재설정</Title>

          <Form onSubmit={handleSubmit}>
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
                    onChange={handleChange} placeholder="인증 코드 6자리" style={{ marginTop: 8 }} />
                </>
              )}
            </Field>

            <GridTwo>
              <Field>
                <Label>새 비밀번호</Label>
                <Input type="password" name="newPassword" value={form.newPassword}
                  onChange={handleChange} placeholder="••••••••" required />
              </Field>
              <Field>
                <Label>비밀번호 확인</Label>
                <Input type="password" name="newPasswordConfirm" value={form.newPasswordConfirm}
                  onChange={handleChange} placeholder="••••••••" required />
              </Field>
            </GridTwo>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <SubmitButton type="submit" disabled={loading}>
              {loading ? '재설정 중...' : '비밀번호 재설정'}
            </SubmitButton>
          </Form>
        </FormSection>
      </PageWrapper>
    </>
  )
}
