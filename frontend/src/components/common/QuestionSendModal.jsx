import { useState } from 'react'
import styled from 'styled-components'
import { sendQuestionRequest } from '../../api/questionApi'


const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
`

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 24px;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ModalTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`

const NoticeBanner = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.premium};
  background: ${({ theme }) => theme.colors.premiumDim};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 12px;
  line-height: 1.6;
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
  font-family: ${({ theme }) => theme.font.sans};
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`

const Textarea = styled.textarea`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
  font-family: ${({ theme }) => theme.font.sans};
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
`

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
`

const CancelBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.surfaceHover}; }
`

const SubmitBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.accent};
  font-size: 14px;
  font-weight: 600;
  color: #0b0e14;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

// ── 컴포넌트 ────────────────────────────────────────────────────

export default function QuestionSendModal({ receiverId, receiverNick, onClose }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) onClose()
    }

    async function handleSubmit() {
        if (!title.trim()) { setError('제목을 입력해 주세요.'); return }
        if (!content.trim()) { setError('내용을 입력해 주세요.'); return }

        setLoading(true)
        setError('')
        try {
            await sendQuestionRequest({ receiverId, title, content })
            onClose()
        } catch (err) {
            setError(err.response?.data?.message || '요청 전송에 실패했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Overlay onClick={handleOverlayClick}>
            <Modal>
                <ModalTitle>
                    <span>{receiverNick}</span> 님에게 질문하기
                </ModalTitle>

                <NoticeBanner>
                    💡 유료 질문 — 멘토가 수락하면 결제가 진행됩니다. 거절 시 비용이 청구되지 않습니다.
                </NoticeBanner>

                <Field>
                    <Label>제목</Label>
                    <Input
                        type="text"
                        placeholder="질문 제목을 입력하세요"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setError('') }}
                        maxLength={100}
                    />
                </Field>

                <Field>
                    <Label>내용</Label>
                    <Textarea
                        placeholder="궁금한 내용을 자세히 적어주세요"
                        value={content}
                        onChange={(e) => { setContent(e.target.value); setError('') }}
                    />
                </Field>

                {error && <ErrorMsg>{error}</ErrorMsg>}

                <ModalActions>
                    <CancelBtn onClick={onClose}>취소</CancelBtn>
                    <SubmitBtn disabled={loading} onClick={handleSubmit}>
                        {loading ? '전송 중...' : '질문 보내기'}
                    </SubmitBtn>
                </ModalActions>
            </Modal>
        </Overlay>
    )
}