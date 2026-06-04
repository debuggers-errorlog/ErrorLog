import styled from 'styled-components';
import MainLayout from '../components/layout/MainLayout';
import { Card } from '../components/common/Styled';

const Message = styled(Card)`
  text-align: center;
  padding: 48px 24px;

  h1 {
    font-size: 22px;
    margin-bottom: 12px;
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    line-height: 1.6;
  }
`;

export default function MyPage() {
  return (
    <MainLayout hideRight>
      <Message>
        <h1>마이페이지</h1>
        <p>
          회원/인증 팀 API 연동 전입니다.
          <br />
          프로필, 구독 목록, 작성 글 관리 기능이 여기에 들어갑니다.
        </p>
      </Message>
    </MainLayout>
  );
}
