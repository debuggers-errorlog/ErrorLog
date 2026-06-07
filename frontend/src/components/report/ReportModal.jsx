import { useState } from 'react'
import styled from 'styled-components'
import { createReport } from '../../api/report.js'

const REASONS = [
    { value: 'SPAM', label: '스팸/광고' },
    { value: 'ABUSE', label: '욕설/비방' },
    { value: 'INAPPROPRIATE', label: '부적절한 콘텐츠' },
    { value: 'COPYRIGHT', label: '저작권 침해' },
    { value: 'ETC', label: '기타' },
]

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  display: flex; align-items: center; justify-content: center; padding: 16px;
`
const Modal = styled.div`
  width: 100%; max-width: 420px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 24px; display: flex; flex-direction: column; gap: 16px;
`
const Title = styled.h2`
  font-size: 18px; font-weight: 600; color: ${({ theme }) => theme.colors.text};
`
const Field = styled.div`display: flex; flex-direction: column; gap: 6px;`
const Label = styled.label`
  font-size: 13px; font-weight: 500; color: ${({ theme }) => theme.colors.text};
`
const Select = styled.select`
  padding: 10px 12px; border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text}; font-size: 14px; outline: none;
`
const Textarea = styled.textarea`
  padding: 10px 12px; border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text}; font-size: 14px;
  outline: none; resize: vertical; min-height: 80px;
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`
const ErrorMsg = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.danger};`
const Buttons = styled.div`display: flex; gap: 8px; justify-content: flex-end;`
const CancelButton = styled.button`
  padding: 9px 16px; border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border}; background: none;
  color: ${({ theme }) => theme.colors.textSecondary}; font-size: 14px;
`
const SubmitButton = styled.button`
  padding: 9px 16px; border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.accent};
  color: #0b0e14; font-size: 14px; font-weight: 600;
  &:disabled { opacity: 0.5; }
`

export default function ReportModal({ open, onClose, targetType, targetId }) {
    const [reasonCategory, setReasonCategory] = useState('SPAM')
    const [reasonDetail, setReasonDetail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!open) return null

    const handleSubmit = async () => {
        setLoading(true); setError('')
        try {
            await createReport({ targetType, targetId, reasonCategory, reasonDetail })
            alert('신고가 접수되었습니다.')
            onClose()
        } catch (err) {
            if (err.response?.status === 401) setError('로그인 후 신고할 수 있습니다.')
            else setError(err.response?.data?.message || '신고 처리 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Overlay onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Title>신고하기</Title>
                <Field>
                    <Label>신고 사유</Label>
                    <Select value={reasonCategory} onChange={(e) => setReasonCategory(e.target.value)}>
                        {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </Select>
                </Field>
                <Field>
                    <Label>상세 내용 (선택)</Label>
                    <Textarea value={reasonDetail} maxLength={1000}
                              onChange={(e) => setReasonDetail(e.target.value)}
                              placeholder="신고 사유를 자세히 적어주세요" />
                </Field>
                {error && <ErrorMsg>{error}</ErrorMsg>}
                <Buttons>
                    <CancelButton type="button" onClick={onClose} disabled={loading}>취소</CancelButton>
                    <SubmitButton type="button" onClick={handleSubmit} disabled={loading}>
                        {loading ? '처리 중...' : '신고하기'}
                    </SubmitButton>
                </Buttons>
            </Modal>
        </Overlay>
    )
}