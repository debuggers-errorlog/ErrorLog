/**
 * QuestionInboxPage.jsx
 *
 * "내 질문 요청" 목록 페이지입니다.
 * - 보낸 요청 탭  : 내가 다른 멘토에게 보낸 요청 목록 (취소 가능)
 * - 받은 요청 탭  : 멘토인 내가 받은 요청 목록 (수락 / 거절 가능)
 *
 * 상태(Status) 종류:
 *   PENDING  → 대기 중  (수락/거절/취소 가능)
 *   ACCEPTED → 수락됨   → questions 레코드가 생성됨
 *   REJECTED → 거절됨
 *   CANCELED → 취소됨
 *
 * 라우팅: /questions/inbox
 * App.jsx 에 아래 라우트를 추가해야 합니다:
 *   import QuestionInboxPage from './pages/QuestionInboxPage'
 *   <Route path="/questions/inbox" element={<PrivateRoute><QuestionInboxPage /></PrivateRoute>} />
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    getSentRequests,
    getReceivedRequests,
    acceptRequest,
    rejectRequest,
    cancelRequest,
} from '../api/questionApi';
import MainLayout from '../components/layout/MainLayout';

// ── 상태별 배지 색상 설정 ──────────────────────────────────────
const STATUS_MAP = {
    PENDING:  { label: '대기 중',  bg: 'rgba(240,180,41,0.15)', color: '#f0b429' },
    ACCEPTED: { label: '수락됨',  bg: 'rgba(63,185,80,0.15)',  color: '#3fb950' },
    REJECTED: { label: '거절됨',  bg: 'rgba(248,81,73,0.15)',  color: '#f85149' },
    CANCELED: { label: '취소됨',  bg: 'rgba(110,118,129,0.15)', color: '#6e7681' },
};

// ── 스타일 ──────────────────────────────────────────────────────

const PageWrapper = styled.div`
  max-width: 740px;
  margin: 0 auto;
  padding: 32px 16px;
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 2px;
  }
`;

const TabRow = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  background: transparent;
  cursor: pointer;
  transition: color 0.15s;
`;

const RequestList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RequestCard = styled.li`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;               /* flex 자식이 overflow: hidden 되려면 필요 */
`;

const CardTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardMeta = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;

const StatusBadge = styled.span`
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

const ActionRow = styled.div`
  flex-shrink: 0;
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;

  background: ${({ $variant, theme }) => {
    if ($variant === 'accept')  return theme.colors.success;
    if ($variant === 'reject')  return theme.colors.danger;
    return 'transparent';
}};
  color: ${({ $variant, theme }) => {
    if ($variant === 'accept' || $variant === 'reject') return '#fff';
    return theme.colors.textMuted;
}};
  border-color: ${({ $variant, theme }) =>
    $variant === 'cancel' ? theme.colors.borderLight : 'transparent'};

  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

// ── 날짜 포맷 헬퍼 ──────────────────────────────────────────────
function formatDate(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── 컴포넌트 ────────────────────────────────────────────────────

export default function QuestionInboxPage() {
    // 탭: 'received'(받은 요청) | 'sent'(보낸 요청)
    const [tab, setTab] = useState('received');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 탭이 바뀔 때마다 목록을 새로 불러옵니다.
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const list =
                    tab === 'received'
                        ? await getReceivedRequests()
                        : await getSentRequests();
                setItems(list ?? []);
            } catch {
                setItems([]);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [tab]);

    // 수락 버튼 핸들러
    async function handleAccept(e, requestId) {
        // 카드 클릭(navigate) 이벤트가 함께 실행되지 않도록 막기
        e.stopPropagation();
        try {
            const question = await acceptRequest(requestId);
            // 수락 성공 → 생성된 질문 채팅 페이지로 바로 이동
            navigate(`/questions/${question.id}`);
        } catch (err) {
            alert(err.response?.data?.message || '수락에 실패했습니다.');
        }
    }

    // 거절 버튼 핸들러
    async function handleReject(e, requestId) {
        e.stopPropagation();
        if (!window.confirm('요청을 거절하시겠습니까?')) return;
        try {
            await rejectRequest(requestId);
            // 목록에서 해당 항목의 상태만 변경
            setItems((prev) =>
                prev.map((it) =>
                    it.id === requestId ? { ...it, status: 'REJECTED' } : it
                )
            );
        } catch (err) {
            alert(err.response?.data?.message || '거절에 실패했습니다.');
        }
    }

    // 취소 버튼 핸들러
    async function handleCancel(e, requestId) {
        e.stopPropagation();
        if (!window.confirm('요청을 취소하시겠습니까?')) return;
        try {
            await cancelRequest(requestId);
            setItems((prev) =>
                prev.map((it) =>
                    it.id === requestId ? { ...it, status: 'CANCELED' } : it
                )
            );
        } catch (err) {
            alert(err.response?.data?.message || '취소에 실패했습니다.');
        }
    }

    // 카드 클릭 시 요청 상세 페이지로 이동
    function handleCardClick(item) {
        navigate(`/questions/requests/${item.id}`);
    }

    const statusInfo = (status) => STATUS_MAP[status] ?? { label: status, bg: '#333', color: '#ccc' };

    return (
        <MainLayout>
            <PageWrapper>
                <PageTitle>질문 요청 관리</PageTitle>

                <TabRow>
                    <Tab $active={tab === 'received'} onClick={() => setTab('received')}>
                        받은 요청
                    </Tab>
                    <Tab $active={tab === 'sent'} onClick={() => setTab('sent')}>
                        보낸 요청
                    </Tab>
                </TabRow>

                {loading && <EmptyState>불러오는 중...</EmptyState>}

                {!loading && items.length === 0 && (
                    <EmptyState>
                        {tab === 'received' ? '받은 요청이 없습니다.' : '보낸 요청이 없습니다.'}
                    </EmptyState>
                )}

                {!loading && items.length > 0 && (
                    <RequestList>
                        {items.map((item) => {
                            const s = statusInfo(item.status);
                            const isPending = item.status === 'PENDING';

                            return (
                                <RequestCard key={item.id} onClick={() => handleCardClick(item)}>
                                    <CardBody>
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardMeta>
                                            {tab === 'received'
                                                ? `${item.requesterNickname} · ${formatDate(item.createdAt)}`
                                                : `→ ${item.receiverNickname} · ${formatDate(item.createdAt)}`}
                                        </CardMeta>
                                    </CardBody>

                                    <StatusBadge $bg={s.bg} $color={s.color}>
                                        {s.label}
                                    </StatusBadge>

                                    {/* PENDING 상태일 때만 액션 버튼 표시 */}
                                    {isPending && (
                                        <ActionRow>
                                            {tab === 'received' ? (
                                                <>
                                                    <ActionBtn
                                                        $variant="accept"
                                                        onClick={(e) => handleAccept(e, item.id)}
                                                    >
                                                        수락
                                                    </ActionBtn>
                                                    <ActionBtn
                                                        $variant="reject"
                                                        onClick={(e) => handleReject(e, item.id)}
                                                    >
                                                        거절
                                                    </ActionBtn>
                                                </>
                                            ) : (
                                                <ActionBtn
                                                    $variant="cancel"
                                                    onClick={(e) => handleCancel(e, item.id)}
                                                >
                                                    취소
                                                </ActionBtn>
                                            )}
                                        </ActionRow>
                                    )}
                                </RequestCard>
                            );
                        })}
                    </RequestList>
                )}
            </PageWrapper>
        </MainLayout>
    );
}