import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/layout/Header'
import {
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest,
    cancelRequest,
} from '../api/questionApi'

const STATUS_MAP = {
    PENDING:  { label: '대기 중',  color: '#f0b429', bg: 'rgba(240,180,41,0.15)' },
    ACCEPTED: { label: '수락됨',  color: '#3fb950', bg: 'rgba(63,185,80,0.15)'  },
    REJECTED: { label: '거절됨',  color: '#f85149', bg: 'rgba(248,81,73,0.15)'  },
    CANCELLED: { label: '취소됨',  color: '#6e7681', bg: 'rgba(110,118,129,0.15)' },
}

const PageWrapper = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.bg};
`

const Container = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 32px 16px;
`

const PageTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        width: 4px;
        height: 18px;
        background: ${({ theme }) => theme.colors.accent};
        border-radius: 2px;
    }
`

const TabRow = styled.div`
    display: flex;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    margin-bottom: 20px;
`

const TabBtn = styled.button`
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.textMuted};
    border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
    background: transparent;
    cursor: pointer;
    transition: color 0.15s;
`

const CardList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Card = styled.li`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`

const CardBody = styled.div`
    flex: 1;
    min-width: 0;
`

const CardTitle = styled.p`
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const CardMeta = styled.p`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 3px;
`

const StatusBadge = styled.span`
    flex-shrink: 0;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    background: ${({ $bg }) => $bg};
    color: ${({ $color }) => $color};
`

const ActionRow = styled.div`
    flex-shrink: 0;
    display: flex;
    gap: 6px;
`

const ActionBtn = styled.button`
    padding: 5px 12px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    &:hover { opacity: 0.85; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }

    background: ${({ $variant, theme }) => {
        if ($variant === 'accept') return theme.colors.success
        if ($variant === 'reject') return theme.colors.danger
        return 'transparent'
    }};
    color: ${({ $variant, theme }) =>
            $variant === 'cancel' ? theme.colors.textMuted : '#fff'};
    border: ${({ $variant, theme }) =>
            $variant === 'cancel' ? `1px solid ${theme.colors.borderLight}` : 'none'};
`

const EmptyText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: 48px 0;
`

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 8px;
`

function fmtDate(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}


export default function QuestionInboxPage() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('received')   // 'received' | 'sent'
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function load() {
            setLoading(true)
            setError('')
            try {
                const list = tab === 'received'
                    ? await getReceivedRequests()
                    : await getSentRequests()
                setItems(list ?? [])
            } catch {
                setItems([])
                setError('목록을 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [tab])

    async function handleAccept(e, requestId) {
        e.stopPropagation()   // 카드 클릭(navigate)과 이벤트 분리
        try {
            const question = await acceptRequest(requestId)
            navigate(`/questions/${question.id}`)
        } catch (err) {
            setError(err.response?.data?.message || '수락에 실패했습니다.')
        }
    }

    async function handleReject(e, requestId) {
        e.stopPropagation()
        try {
            await rejectRequest(requestId)
            setItems((prev) =>
                prev.map((it) => it.id === requestId ? { ...it, status: 'REJECTED' } : it)
            )
        } catch (err) {
            setError(err.response?.data?.message || '거절에 실패했습니다.')
        }
    }

    async function handleCancel(e, requestId) {
        e.stopPropagation()
        try {
            await cancelRequest(requestId)
            setItems((prev) =>
                prev.map((it) => it.id === requestId ? { ...it, status: 'CANCELLED' } : it)
            )
        } catch (err) {
            setError(err.response?.data?.message || '취소에 실패했습니다.')
        }
    }

    return (
        <PageWrapper>
            <Header />
            <Container>
                <PageTitle>질문 요청 관리</PageTitle>

                <TabRow>
                    <TabBtn $active={tab === 'received'} onClick={() => setTab('received')}>
                        받은 요청
                    </TabBtn>
                    <TabBtn $active={tab === 'sent'} onClick={() => setTab('sent')}>
                        보낸 요청
                    </TabBtn>
                </TabRow>

                {error && <ErrorMsg>{error}</ErrorMsg>}

                {loading ? (
                    <EmptyText>불러오는 중...</EmptyText>
                ) : items.length === 0 ? (
                    <EmptyText>
                        {tab === 'received' ? '받은 요청이 없습니다.' : '보낸 요청이 없습니다.'}
                    </EmptyText>
                ) : (
                    <CardList>
                        {items.map((item) => {
                            const s = STATUS_MAP[item.status] ?? { label: item.status, color: '#ccc', bg: '#333' }
                            const isPending = item.status === 'PENDING'

                            return (
                                <Card key={item.id} onClick={() => navigate(`/questions/requests/${item.id}`)}>
                                    <CardBody>
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardMeta>
                                            {tab === 'received'
                                                ? `${item.requesterNickname} · ${fmtDate(item.createdAt)}`
                                                : `→ ${item.receiverNickname} · ${fmtDate(item.createdAt)}`}
                                        </CardMeta>
                                    </CardBody>

                                    <StatusBadge $bg={s.bg} $color={s.color}>{s.label}</StatusBadge>

                                    {isPending && (
                                        <ActionRow>
                                            {tab === 'received' ? (
                                                <>
                                                    <ActionBtn $variant="accept" onClick={(e) => handleAccept(e, item.id)}>
                                                        수락
                                                    </ActionBtn>
                                                    <ActionBtn $variant="reject" onClick={(e) => handleReject(e, item.id)}>
                                                        거절
                                                    </ActionBtn>
                                                </>
                                            ) : (
                                                <ActionBtn $variant="cancel" onClick={(e) => handleCancel(e, item.id)}>
                                                    취소
                                                </ActionBtn>
                                            )}
                                        </ActionRow>
                                    )}
                                </Card>
                            )
                        })}
                    </CardList>
                )}
            </Container>
        </PageWrapper>
    )
}