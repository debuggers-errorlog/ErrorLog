import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Header from '../components/layout/Header'
import { getRequestDetail, acceptRequest, rejectRequest } from '../api/questionApi'
import { MOCK_REQUEST_DETAIL,
    MOCK_REQUEST_DETAIL_ACCEPTED,
    MOCK_REQUEST_DETAIL_REJECTED,
    MOCK_REQUEST_DETAIL_PENDING_SENT,
    MOCK_REQUEST_DETAIL_CANCELED} from '../mocks/questions'

const STATUS_MAP = {
    PENDING:  { label: '대기 중', color: '#f0b429', bg: 'rgba(240,180,41,0.15)' },
    ACCEPTED: { label: '수락됨',  color: '#3fb950', bg: 'rgba(63,185,80,0.15)'  },
    REJECTED: { label: '거절됨',  color: '#f85149', bg: 'rgba(248,81,73,0.15)'  },
    CANCELLED: { label: '취소됨',  color: '#6e7681', bg: 'rgba(110,118,129,0.15)' },
}

function fmtDate(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function unwrapApiData(res) {
    return res?.data?.data ?? res?.data ?? res
}

function getMockRequestDetail(requestId) {
    const map = {
        '1': MOCK_REQUEST_DETAIL,
        '2': MOCK_REQUEST_DETAIL_ACCEPTED,
        '3': MOCK_REQUEST_DETAIL_REJECTED,
        '4': MOCK_REQUEST_DETAIL_PENDING_SENT,
        '5': MOCK_REQUEST_DETAIL_CANCELED,
    }
    return map[String(requestId)] ?? MOCK_REQUEST_DETAIL
}

const PageWrapper = styled.div`
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.bg};
`

const Container = styled.div`
    max-width: 720px;
    margin: 0 auto;
    padding: 24px 16px 48px;
`

const BackRow = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textMuted};
    background: transparent;
    cursor: pointer;
    margin-bottom: 20px;
    padding: 0;
    &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const RequestCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: 20px 22px;
    margin-bottom: 12px;
`

const TitleRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
`

const Title = styled.h2`
    font-size: 17px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.4;
    flex: 1;
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

const MetaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
    flex-wrap: wrap;
`

const MetaText = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
    display: flex;
    align-items: center;
    gap: 4px;
`

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: 14px 0;
`

const ContentBox = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.75;
    white-space: pre-wrap;
    word-break: break-word;
`

const ImageSection = styled.div`
    margin-top: 16px;
`

const ImageLabel = styled.p`
    font-size: 11px;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 8px;
`

const ImageGrid = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`

const ImageThumb = styled.img`
    width: 100px;
    height: 80px;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    cursor: pointer;
    transition: opacity 0.15s;
    &:hover { opacity: 0.85; }
`

const ActionCard = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: 18px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
`

const ActionHint = styled.div`
    flex: 1;
    min-width: 0;
`

const ActionHintTitle = styled.p`
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 2px;
`

const ActionHintDesc = styled.p`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.5;
`

const BtnRow = styled.div`
    display: flex;
    gap: 8px;
    flex-shrink: 0;
`

const Btn = styled.button`
    padding: 9px 20px;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    white-space: nowrap;
    &:hover { opacity: 0.85; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }

    background: ${({ $variant, theme }) => {
    if ($variant === 'accept') return theme.colors.accent
    if ($variant === 'chat')   return theme.colors.success
    return 'transparent'
}};
    color: ${({ $variant }) =>
    ($variant === 'accept' || $variant === 'chat') ? '#0b0e14' : 'inherit'};
    border: ${({ $variant, theme }) => {
    if ($variant === 'reject') return `1px solid ${theme.colors.danger}`
    if ($variant === 'ghost')  return `1px solid ${theme.colors.borderLight}`
    return 'none'
}};
    color: ${({ $variant, theme }) => {
    if ($variant === 'accept' || $variant === 'chat') return '#0b0e14'
    if ($variant === 'reject') return theme.colors.danger
    return theme.colors.textMuted
}};
`

const ErrorMsg = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.danger};
    margin-bottom: 10px;
`

const LoadingText = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
    text-align: center;
    padding: 80px 0;
`


export default function QuestionRequestDetailPage() {
    const { requestId } = useParams()
    const navigate = useNavigate()

    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [acting, setActing] = useState(false)   // 수락/거절 버튼 로딩
    const [error, setError] = useState('')

    useEffect(() => {
        async function load() {
            setLoading(true)
            setError('')

            try {
                const res = await getRequestDetail(requestId)
                const detail = unwrapApiData(res)
                console.log('[DEBUG] request detail:', detail)
                if (detail && String(detail.id) === String(requestId)) {
                    setRequest(detail)
                } else {
                    console.warn('[mock] id 불일치 → mock 사용', detail?.id, requestId)
                    setRequest(getMockRequestDetail(requestId))
                }
            } catch (e) {
                console.warn('[mock] getRequestDetail 실패 → mock 사용', e)
                setRequest(getMockRequestDetail(requestId))
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [requestId])

    async function handleAccept() {
        const priceText = request.questionPrice != null
            ? `₩${Number(request.questionPrice).toLocaleString()}`
            : '설정된 금액'
        if (!confirm(`질문을 수락할까요?\n질문자에게 ${priceText}가 결제됩니다.`)) return

        setActing(true)
        setError('')

        try {
            const question = await acceptRequest(requestId)
            navigate(`/questions/${question.id}`)
        } catch (err) {
            setError(err.response?.data?.message || '수락에 실패했습니다.')
            setActing(false)
        }
    }

    async function handleReject() {
        if (!confirm('질문을 거절할까요?')) return
        setActing(true)
        setError('')
        try {
            await rejectRequest(requestId)
            setRequest(prev => ({ ...prev, status: 'REJECTED' }))
        } catch (err) {
            setError(err.response?.data?.message || '거절에 실패했습니다.')
        } finally {
            setActing(false)
        }
    }

    if (loading) {
        return (
            <PageWrapper>
                <Header />
                <Container>
                    <LoadingText>불러오는 중...</LoadingText>
                </Container>
            </PageWrapper>
        )
    }

    if (!request) {
        return (
            <PageWrapper>
                <Header />
                <Container>
                    <LoadingText>{error || '요청 정보를 불러오지 못했습니다.'}</LoadingText>
                </Container>
            </PageWrapper>
        )
    }

    const s = STATUS_MAP[request.status] ?? { label: request.status, color: '#ccc', bg: '#333' }
    const isPending  = request.status === 'PENDING'
    const isAccepted = request.status === 'ACCEPTED'

    // 액션 카드 텍스트
    const actionHint = {
        PENDING:  {
            title: '수락하면 결제가 진행됩니다',
            desc: request.questionPrice != null
                ? `질문자에게 ₩${Number(request.questionPrice).toLocaleString()}가 청구됩니다. 거절 시 비용이 청구되지 않습니다.`
                : '거절 시 비용이 청구되지 않습니다.',
        },
        ACCEPTED: { title: '이미 수락된 질문입니다',    desc: '채팅방에서 대화를 이어가세요.' },
        REJECTED: { title: '거절된 요청입니다',         desc: '비용이 청구되지 않았습니다.' },
        CANCELLED: { title: '취소된 요청입니다',         desc: '요청자가 취소한 질문입니다.' },
    }[request.status] ?? { title: '', desc: '' }

    return (
        <PageWrapper>
            <Header />
            <Container>

                <BackRow onClick={() => navigate('/mypage', { state: { questionTab: 'received-requests' } })}>
                    ← 받은 요청 목록
                </BackRow>

                <RequestCard>
                    <TitleRow>
                        <Title>{request.title}</Title>
                        <StatusBadge $bg={s.bg} $color={s.color}>{s.label}</StatusBadge>
                    </TitleRow>

                    <MetaRow>
                        <MetaText>👤 {request.requesterNickname}</MetaText>
                        <MetaText>📅 {fmtDate(request.createdAt)}</MetaText>
                    </MetaRow>

                    <Divider />

                    <ContentBox>{request.content}</ContentBox>

                    {request.imageUrls?.length > 0 && (
                        <ImageSection>
                            <ImageLabel>첨부 이미지 {request.imageUrls.length}장</ImageLabel>
                            <ImageGrid>
                                {request.imageUrls.map((url, i) => (
                                    <ImageThumb
                                        key={i}
                                        src={url}
                                        alt={`첨부 ${i + 1}`}
                                        onClick={() => window.open(url, '_blank')}
                                    />
                                ))}
                            </ImageGrid>
                        </ImageSection>
                    )}
                </RequestCard>

                {error && <ErrorMsg>{error}</ErrorMsg>}

                <ActionCard>
                    <ActionHint>
                        <ActionHintTitle>{actionHint.title}</ActionHintTitle>
                        <ActionHintDesc>{actionHint.desc}</ActionHintDesc>
                    </ActionHint>

                    <BtnRow>
                        {isPending && (
                            <>
                                <Btn $variant="accept" onClick={handleAccept} disabled={acting}>
                                    {acting ? '처리 중...' : '수락하기'}
                                </Btn>
                                <Btn $variant="reject" onClick={handleReject} disabled={acting}>
                                    거절하기
                                </Btn>
                            </>
                        )}

                        {isAccepted && request.questionId && (
                            <Btn $variant="chat"
                                 onClick={() => navigate(`/questions/${request.questionId}`)}>
                                채팅방으로 이동 →
                            </Btn>
                        )}

                        <Btn $variant="ghost" onClick={() => navigate('/mypage', { state: { questionTab: 'received-requests' } })}>
                            목록으로
                        </Btn>
                    </BtnRow>
                </ActionCard>

            </Container>
        </PageWrapper>
    )
}