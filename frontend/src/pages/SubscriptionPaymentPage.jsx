import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Shield, CheckCircle } from "lucide-react";
import styled from "styled-components";
import { subscribe } from '../api/subscriptionApi';
import { cancelPayment } from '../api/paymentApi';

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

const CardWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.accent};
  padding: 1.25rem 2rem;
  text-align: center;
  border-radius: ${({ theme }) => theme.radius.lg} ${({ theme }) => theme.radius.lg} 0 0;
`;

const HeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.bg};
  margin: 0;
`;

const OrderCard = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  margin-top: 0;
  border-radius: 0;
  padding: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top: none;
`;

const OrderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const OrderLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const OrderValue = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const Divider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0.25rem 0;
`;

const TotalCard = styled.div`
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}33;
  border-top: none;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TotalLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const TotalAmount = styled.span`
  font-size: 32px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  margin-top: 0.25rem;
`;

const VatText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0.25rem 0 0;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 1.25rem 0 0.75rem;
`;

const PaymentMethod = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.accent}4d;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MethodLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const RadioActive = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentDim};
  flex-shrink: 0;
`;

const CardIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}33;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MethodName = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const MethodDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 2px 0 0;
`;

const NoticeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const NoticeText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BtnArea = styled.div`
  margin-top: 1rem;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
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

const FooterText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin: 0;
`;

export function SubscriptionPaymentPage() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const expiredAt = location.state?.expiredAt;

  const handlePayment = async () => {
    try {
      await subscribe(Number(creatorId));
      alert("구독 결제가 완료되었습니다!");
      navigate(`/creator/${creatorId}`);
    } catch {
      alert("결제에 실패했습니다.");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelPayment(Number(creatorId));
    } catch (e) {
      console.error(e);
    } finally {
      alert("결제가 취소되었습니다.");
      navigate(`/creator/${creatorId}`);
    }
  };

  const startDate = expiredAt ? new Date(expiredAt) : new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  const formatDate = (d) =>
      `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

  return (
      <Page>
        <Content>
          <CardWrapper>
            <Header>
              <HeaderTitle>결제하기</HeaderTitle>
            </Header>

            <OrderCard>
              <OrderRow>
                <OrderLabel>크리에이터</OrderLabel>
                <OrderValue>김개발</OrderValue>
              </OrderRow>
              <Divider />
              <OrderRow>
                <OrderLabel>구독 기간</OrderLabel>
                <OrderValue>1개월</OrderValue>
              </OrderRow>
              <Divider />
              <OrderRow>
                <OrderLabel>이용 기간</OrderLabel>
                <OrderValue>{formatDate(startDate)} ~ {formatDate(endDate)}</OrderValue>
              </OrderRow>
            </OrderCard>

            <TotalCard>
              <TotalLabel>총 결제 금액</TotalLabel>
              <TotalAmount>₩3,900</TotalAmount>
              <VatText>부가세 포함</VatText>
            </TotalCard>

            <SectionTitle>결제 수단</SectionTitle>
            <PaymentMethod>
              <MethodLeft>
                <RadioActive />
                <CardIcon>
                  <CreditCard size={18} />
                </CardIcon>
                <div>
                  <MethodName>신용카드</MethodName>
                  <MethodDesc>안전한 카드 결제</MethodDesc>
                </div>
              </MethodLeft>
              <CheckCircle size={18} />
            </PaymentMethod>

            <NoticeBox>
              <Shield size={14} />
              <NoticeText>결제 버튼 클릭 시 PG사의 안전한 결제창으로 이동합니다</NoticeText>
            </NoticeBox>

            <BtnArea>
              <BtnRow>
                <CancelBtn onClick={handleCancel}>취소</CancelBtn>
                <CtaBtn onClick={handlePayment}>
                  <CreditCard size={16} />
                  ₩3,900 결제하기
                </CtaBtn>
              </BtnRow>
              <FooterText>구독 후 즉시 모든 프리미엄 콘텐츠에 접근할 수 있습니다</FooterText>
            </BtnArea>
          </CardWrapper>
        </Content>
      </Page>
  );
}