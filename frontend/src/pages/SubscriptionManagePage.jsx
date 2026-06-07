import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCheck } from "lucide-react";
import styled from "styled-components";
import { getSubscriptionList } from '../api/subscriptionApi';

const Page = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text};
  box-sizing: border-box;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionBtn = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  border: 1px solid ${({ theme }) => theme.colors.accent}4d;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.accentDim};
  }
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const SectionHeader = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Badge = styled.span`
  width: 22px;
  height: 22px;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  border-radius: 50%;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  flex-shrink: 0;
`;

const Name = styled.p`
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Date = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 2px 0 0;
`;

const RenewBtn = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
`;

const MutedText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.danger};
`;

export function SubscriptionManagePage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    async function fetchList() {
      try {
        const { data } = await getSubscriptionList();
        setData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, []);

  const formatDate = (dateStr) => {
    const d = new window.Date(dateStr);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
  };

  if (loading) return <Page><MutedText>불러오는 중...</MutedText></Page>;
  if (error) return <Page><ErrorText>{error}</ErrorText></Page>;

  return (
      <Page>
        <Content>
          <Header>
            <HeaderRow>
              <div>
                <Title>구독 관리</Title>
                <Subtitle>구독 중인 크리에이터와 구독자를 관리하세요</Subtitle>
              </div>
              <HeaderActions>
                <ActionBtn onClick={() => navigate("/subscription-settings")}>구독 플랜 설정</ActionBtn>
                <ActionBtn onClick={() => navigate("/settlement")}>정산 관리</ActionBtn>
                <CloseBtn onClick={() => navigate(-1)}>✕</CloseBtn>
              </HeaderActions>
            </HeaderRow>
          </Header>

          <Grid>
            <div>
              <SectionHeader>
                <SectionTitleRow>
                  <Users size={18} />
                  <SectionTitle>내가 구독중인 개발자</SectionTitle>
                  <Badge>{data.followingCount}</Badge>
                </SectionTitleRow>
              </SectionHeader>
              <List>
                {data.following.length === 0 ? (
                    <MutedText>구독중인 개발자가 없습니다.</MutedText>
                ) : (
                    data.following.map((item) => (
                        <Card key={item.creatorId}>
                          <CardLeft>
                            <Avatar>{item.creatorName[0]}</Avatar>
                            <div>
                              <Name>{item.creatorName}</Name>
                              <Date>구독 만료 날짜 : {formatDate(item.expiredAt)}</Date>
                            </div>
                          </CardLeft>
                          <RenewBtn onClick={() => navigate(`/subscriptions/${item.creatorId}/payment`, {
                            state: { expiredAt: item.expiredAt }
                          })}>
                            구독 연장하기
                          </RenewBtn>
                        </Card>
                    ))
                )}
              </List>
            </div>

            <div>
              <SectionHeader>
                <SectionTitleRow>
                  <UserCheck size={18} />
                  <SectionTitle>나를 구독하는 개발자</SectionTitle>
                  <Badge>{data.followerCount}</Badge>
                </SectionTitleRow>
              </SectionHeader>
              <List>
                {data.followers.length === 0 ? (
                    <MutedText>구독자가 없습니다.</MutedText>
                ) : (
                    data.followers.map((item) => (
                        <Card key={item.subscriberId}>
                          <CardLeft>
                            <Avatar>{item.subscriberName[0]}</Avatar>
                            <div>
                              <Name>{item.subscriberName}</Name>
                              <Date>구독 시작 날짜 : {formatDate(item.createdAt)}</Date>
                            </div>
                          </CardLeft>
                        </Card>
                    ))
                )}
              </List>
            </div>
          </Grid>
        </Content>
      </Page>
  );
}
