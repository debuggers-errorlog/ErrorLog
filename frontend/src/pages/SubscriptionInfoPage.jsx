import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Star, FileText, Calendar, Heart, Bell, Unlock } from "lucide-react";
import styled from "styled-components";
import { getSubscriptionInfo } from '../api/subscriptionApi';

const Page = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  min-height: 100vh;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
`;

const TopHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const TopTitle = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const TopSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 6px;
`;

const CreatorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const CreatorAvatar = styled.div`
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

const CreatorName = styled.p`
  font-size: 17px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CreatorCta = styled.p`
  font-size: 17px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 2px 0 0;
`;

const PriceCard = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.accent}33;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PriceLabel = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.5rem;
`;

const PriceAmount = styled.span`
  font-size: 36px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
`;

const PricePeriod = styled.span`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PriceDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.75rem;
`;

const DateRange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
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

const BenefitCard = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BenefitIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}33;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const BenefitText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const PostCountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.75rem;
  background: ${({ theme }) => theme.colors.premiumDim};
  border: 1px solid ${({ theme }) => theme.colors.premium}4d;
  border-radius: 20px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.premium};
  margin-bottom: 1rem;
`;

const PostItem = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem 1.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PostTitle = styled.span`
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text};
`;

const PostLock = styled.div`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.premiumDim};
  border: 1px solid ${({ theme }) => theme.colors.premium}4d;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 1rem;
`;

const CtaSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TotalLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TotalAmount = styled.span`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.bg};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
`;

const CtaBtn = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export function SubscriptionInfoPage() {
    const { creatorId } = useParams();
    const navigate = useNavigate();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchInfo() {
            try {
                const { data } = await getSubscriptionInfo(creatorId);
                setInfo(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchInfo();
    }, [creatorId]);

    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const formatDate = (d) =>
        `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}`;

    if (loading) return <Page><LoadingText>불러오는 중...</LoadingText></Page>;
    if (error || !info) return <Page><ErrorText>{error ?? "오류가 발생했습니다."}</ErrorText></Page>;

    return (
        <Page>
            <TopHeader>
                <TopTitle>크리에이터 구독</TopTitle>
                <TopSubtitle>전문 지식을 지속적으로 받아보세요</TopSubtitle>
            </TopHeader>

            <CreatorHeader>
                <CreatorAvatar>{info.creatorName[0]}</CreatorAvatar>
                <div>
                    <CreatorName>{info.creatorName} 크리에이터</CreatorName>
                    <CreatorCta>구독 시작하기</CreatorCta>
                </div>
            </CreatorHeader>

            <PriceCard>
                <PriceLabel>월 구독료</PriceLabel>
                <div>
                    <PriceAmount>₩{info.price.toLocaleString()}</PriceAmount>
                    <PricePeriod> / 월</PricePeriod>
                </div>
                <PriceDesc>{info.description}</PriceDesc>
                <DateRange>
                    <Calendar size={14} />
                    <span>{formatDate(today)} ~ {formatDate(nextMonth)} · 부가세 포함 금액</span>
                </DateRange>
            </PriceCard>

            <SectionTitle>
                <Star size={16} />
                구독 혜택
            </SectionTitle>

            <BenefitCard>
                <BenefitIcon><Unlock size={16} /></BenefitIcon>
                <BenefitText>모든 유료글 무제한 열람</BenefitText>
            </BenefitCard>
            <BenefitCard>
                <BenefitIcon><Bell size={16} /></BenefitIcon>
                <BenefitText>새 프리미엄 글 알림 수신</BenefitText>
            </BenefitCard>

            <div style={{ marginTop: "1.5rem" }}>
                <SectionTitle>
                    <FileText size={16} />
                    프리미엄 콘텐츠
                </SectionTitle>
                <PostCountBadge>
                    <Lock size={12} />
                    총 {info.premiumPostCount}개의 프리미엄 글
                </PostCountBadge>
                {info.recentPremiumPosts.map((post) => (
                    <PostItem key={post.id}>
                        <PostTitle>{post.title}</PostTitle>
                        <PostLock><Lock size={13} /></PostLock>
                    </PostItem>
                ))}
            </div>

            <CtaSection>
                <TotalPrice>
                    <TotalLabel>총 결제 금액</TotalLabel>
                    <TotalAmount>₩{info.price.toLocaleString()}</TotalAmount>
                </TotalPrice>
                <BtnRow>
                    <CancelBtn onClick={() => navigate(-1)}>취소</CancelBtn>
                    <CtaBtn onClick={() => navigate(`/subscriptions/${creatorId}/payment`)}>
                        <Heart size={16} />
                        구독 시작하기
                    </CtaBtn>
                </BtnRow>
            </CtaSection>
        </Page>
    );
}
