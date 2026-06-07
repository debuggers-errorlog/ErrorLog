import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/layout/Header'
import {
    getQuestionDetail,
    writeAnswer,
    updateAnswer,
    deleteAnswer,
} from '../api/questionApi'
import {getMyProfile} from "../api/user.js";

const STATUS_STYLE = {
    ACTIVE: { label: '진행 중', color: '#3fb950', bg: 'rgba(63,185,80,0.15)' },
    CLOSED: { label: '종료',    color: '#6e7681', bg: 'rgba(110,118,129,0.15)' },
}

function fmtTime(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}


const PageWrapper = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.bg};
    display: flex;
    flex-direction: column;
`

const ChatContainer = styled.div`
    max-width: 720px;
    width: 100%;
    margin: 0 auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 16px;
    padding-top: 8px;
    padding-bottom: 0;
`

const QuestionCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: 16px 18px;
    margin-bottom: 16px;
`

const QuestionTitle = styled.h2`
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 8px;
`

const QuestionContent = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  white-space: pre-wrap;
`

const MetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
`

const MetaText = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
`

const StatusBadge = styled.span`
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`

const ChatArea = styled.div`
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 8px;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.border} transparent;
`

const BubbleRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${({ $isMine }) => ($isMine ? 'flex-end' : 'flex-start')};
`

const NickLabel = styled.span`
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 4px;
    padding: 0 6px;
`

const Bubble = styled.div`
    max-width: 65%;
    padding: 10px 14px;
    border-radius: ${({ $isMine }) =>
    $isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;

    background: ${({ $isMine, theme }) =>
    $isMine ? theme.colors.accentDim : theme.colors.surface};
    border: 1px solid
    ${({ $isMine, theme }) =>
    $isMine ? theme.colors.accent : theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
`

const TimeLabel = styled.span`
    font-size: 10px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 2px;
    padding: 0 6px;
`

const MenuRow = styled.div`
    display: flex;
    gap: 8px;
    padding: 0 6px;
    margin-top: 2px;
`

const MenuBtn = styled.button`
  font-size: 11px;
  color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.textMuted};
  background: transparent;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`

const EditBox = styled.textarea`
    max-width: 65%;
    width: 100%;
    padding: 10px 12px;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.bgElevated};
    border: 1px solid ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    resize: none;
    outline: none;
    font-family: ${({ theme }) => theme.font.sans};
    line-height: 1.6;
`

const EditBtnRow = styled.div`
    display: flex;
    gap: 6px;
    margin-top: 4px;
`

const SmallBtn = styled.button`
    padding: 4px 12px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    background: ${({ $primary, theme }) => $primary ? theme.colors.accent : 'transparent'};
    color: ${({ $primary, theme }) => $primary ? '#0b0e14' : theme.colors.textMuted};
    border: 1px solid ${({ $primary, theme }) =>
    $primary ? theme.colors.accent : theme.colors.borderLight};
    &:hover { opacity: 0.8; }
`

const InputArea = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 0 20px;
  display: flex;
  gap: 10px;
  align-items: flex-end;
`

const MessageInput = styled.textarea`
  flex: 1;
  padding: 11px 14px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  resize: none;
  max-height: 120px;
  outline: none;
  font-family: ${({ theme }) => theme.font.sans};
  line-height: 1.6;
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`

const SendBtn = styled.button`
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.accent};
    color: #0b0e14;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.15s;
    &:hover { opacity: 0.9; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
`

const ClosedBanner = styled.div`
    padding: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    text-align: center;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
`

const EmptyText = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    text-align: center;
    margin: 40px 0;
`


export default function QuestionDetailPage() {
    const { questionId } = useParams()
    const navigate = useNavigate()

    const [currentUserId, setCurrentUserId] = useState(null)
    useEffect(() => {
        getMyProfile().then(res => setCurrentUserId(res.data.id))
    }, [])

    const [question, setQuestion] = useState(null)
    const [answers, setAnswers] = useState([])
    const [inputText, setInputText] = useState('')
    const [sending, setSending] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')
    const [error, setError] = useState('')

    const chatEndRef = useRef(null)

    useEffect(() => {
        async function load() {
            try {
                const detail = await getQuestionDetail(questionId)
                setQuestion(detail)
                setAnswers(detail.answers ?? [])
            } catch {
                setError('질문을 불러오지 못했습니다.')
            }
        }
        load()
    }, [questionId])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [answers])

    async function handleSend() {
        const text = inputText.trim()
        if (!text || sending) return
        setSending(true)
        setError('')
        try {
            const newAnswer = await writeAnswer(questionId, { content: text })
            setAnswers((prev) => [...prev, newAnswer])
            setInputText('')
        } catch (err) {
            setError(err.response?.data?.message || '전송에 실패했습니다.')
        } finally {
            setSending(false)
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    function startEdit(answer) {
        setEditingId(answer.id)
        setEditText(answer.content)
        setError('')
    }

    async function submitEdit(answerId) {
        const text = editText.trim()
        if (!text) return
        try {
            const updated = await updateAnswer(answerId, { content: text })
            setAnswers((prev) => prev.map((a) => a.id === answerId ? updated : a))
            setEditingId(null)
        } catch (err) {
            setError(err.response?.data?.message || '수정에 실패했습니다.')
        }
    }

    async function handleDelete(answerId) {
        if (!confirm('메시지를 삭제할까요?')) return
        try {
            await deleteAnswer(answerId)
            setAnswers((prev) => prev.filter((a) => a.id !== answerId))
        } catch (err) {
            setError(err.response?.data?.message || '삭제에 실패했습니다.')
        }
    }


    const isActive = question?.status === 'ACTIVE'
    const s = STATUS_STYLE[question?.status] ?? {}

    return (
        <PageWrapper>
            <Header />
            <ChatContainer>

                {question && (
                    <QuestionCard>
                        <QuestionTitle>{question.title}</QuestionTitle>
                        <QuestionContent>{question.content}</QuestionContent>
                        <MetaRow>
                            <StatusBadge $bg={s.bg} $color={s.color}>{s.label}</StatusBadge>
                            <MetaText>{question.askerNickname} (질문자)</MetaText>
                            <MetaText>↔</MetaText>
                            <MetaText>{question.mentorNickname} (멘토)</MetaText>
                            <MetaText>{fmtTime(question.createdAt)}</MetaText>
                        </MetaRow>
                    </QuestionCard>
                )}

                {error && (
                    <p style={{ fontSize: '13px', color: '#f85149', marginBottom: '8px' }}>
                        {error}
                    </p>
                )}

                <ChatArea>
                    {answers.length === 0 && !error && (
                        <EmptyText>아직 메시지가 없습니다. 먼저 말을 걸어보세요!</EmptyText>
                    )}

                    {answers.map((answer) => {
                        const isMine = answer.authorId === currentUserId

                        return (
                            <BubbleRow key={answer.id} $isMine={isMine}>
                                <NickLabel>{answer.authorNickname}</NickLabel>

                                {editingId === answer.id ? (
                                    <>
                                        <EditBox
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            rows={3}
                                            autoFocus
                                        />
                                        <EditBtnRow>
                                            <SmallBtn $primary onClick={() => submitEdit(answer.id)}>저장</SmallBtn>
                                            <SmallBtn onClick={() => setEditingId(null)}>취소</SmallBtn>
                                        </EditBtnRow>
                                    </>
                                ) : (
                                    <>
                                        <Bubble $isMine={isMine}>{answer.content}</Bubble>
                                        <TimeLabel>{fmtTime(answer.updatedAt || answer.createdAt)}</TimeLabel>
                                        {isMine && (
                                            <MenuRow>
                                                <MenuBtn onClick={() => startEdit(answer)}>수정</MenuBtn>
                                                <MenuBtn $danger onClick={() => handleDelete(answer.id)}>삭제</MenuBtn>
                                            </MenuRow>
                                        )}
                                    </>
                                )}
                            </BubbleRow>
                        )
                    })}

                    <div ref={chatEndRef} />
                </ChatArea>

                {isActive ? (
                    <InputArea>
                        <MessageInput
                            placeholder="메시지를 입력하세요... (Enter: 전송 / Shift+Enter: 줄바꿈)"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={sending}
                            rows={1}
                        />
                        <SendBtn onClick={handleSend} disabled={sending || !inputText.trim()}>
                            ↑
                        </SendBtn>
                    </InputArea>
                ) : (
                    question && <ClosedBanner>이 질문은 종료되었습니다.</ClosedBanner>
                )}

            </ChatContainer>
        </PageWrapper>
    )
}