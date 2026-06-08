import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";
import { getSettlement } from '../api/paymentApi';

const Page = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  min-height: 100vh;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 18px;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
`;

const TabRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tab = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.accent : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.bg : theme.colors.textMuted};
  transition: all 0.15s;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
`;

const MetricLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 0.5rem;
`;

const MetricValue = styled.p`
  font-size: 24px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  margin: 0;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const TableWrap = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 25%;
`;

const Td = styled.td`
  font-size: 13px;
  padding: 0.875rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ $accent, theme }) => $accent ? theme.colors.accent : theme.colors.text};
  font-weight: ${({ $accent }) => $accent ? 500 : 400};
  width: 25%;
`;

const MutedText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.danger};
`;

const TABS = [
  { label: "구독 수익", value: "SUBSCRIPTION" },
  { label: "질문글 수익", value: "QUESTION" },
  { label: "전체", value: null },
];

export function SettlementPage() {
  const navigate = useNavigate();
  //const creatorId = 2; // JWT 연동 후 제거
  const token = localStorage.getItem("accessToken");
  const creatorId = token ? jwtDecode(token).userId : null;

  const [activeTab, setActiveTab] = useState("SUBSCRIPTION");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettlement() {
      setLoading(true);
      try {
        const { data } = await getSettlement(creatorId, activeTab);
        setData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSettlement();
  }, [activeTab]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;
  };

  const formatPrice = (price) => `₩${price.toLocaleString()}`;
  const totalLabel = activeTab === "SUBSCRIPTION" ? "총 구독자 수" : activeTab === "QUESTION" ? "총 질문 건수" : "총 결제 건수";

  return (
      <Page>
        <Header>
          <HeaderRow>
            <div>
              <Title>정산 관리</Title>
              <Subtitle>구독 및 질문글 수익을 확인하세요</Subtitle>
            </div>
            <CloseBtn onClick={() => navigate(-1)}>✕</CloseBtn>
          </HeaderRow>
        </Header>

        <TabRow>
          {TABS.map((tab) => (
              <Tab
                  key={tab.label}
                  $active={activeTab === tab.value}
                  onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </Tab>
          ))}
        </TabRow>

        {loading ? (
            <MutedText>불러오는 중...</MutedText>
        ) : error ? (
            <ErrorText>{error}</ErrorText>
        ) : (
            <>
              <MetricGrid>
                <MetricCard>
                  <MetricLabel>이번 달 수익</MetricLabel>
                  <MetricValue>{formatPrice(data.thisMonthRevenue)}</MetricValue>
                </MetricCard>
                <MetricCard>
                  <MetricLabel>총 누적 수익</MetricLabel>
                  <MetricValue>{formatPrice(data.totalRevenue)}</MetricValue>
                </MetricCard>
                <MetricCard>
                  <MetricLabel>{totalLabel}</MetricLabel>
                  <MetricValue>{data.totalCount}건</MetricValue>
                </MetricCard>
              </MetricGrid>

              <SectionTitle>
                <Receipt size={16} />
                결제 내역
              </SectionTitle>

              <TableWrap>
                <Table>
                  <thead>
                  <tr>
                    <Th>결제자</Th>
                    <Th>결제 유형</Th>
                    <Th>금액</Th>
                    <Th>결제일</Th>
                  </tr>
                  </thead>
                  <tbody>
                  {data.details.length === 0 ? (
                      <tr>
                        <Td colSpan={4} style={{ textAlign: "center", color: "inherit" }}>
                          결제 내역이 없습니다.
                        </Td>
                      </tr>
                  ) : (
                      data.details.map((item) => (
                          <tr key={item.paymentId}>
                            <Td>{item.payerName}</Td>
                            <Td>{item.paymentType === "SUBSCRIPTION" ? "구독" : "질문글"}</Td>
                            <Td $accent>{formatPrice(item.price)}</Td>
                            <Td>{formatDate(item.createdAt)}</Td>
                          </tr>
                      ))
                  )}
                  </tbody>
                </Table>
              </TableWrap>
            </>
        )}
      </Page>
  );
}
