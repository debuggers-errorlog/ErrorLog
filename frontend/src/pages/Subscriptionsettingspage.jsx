import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Save } from "lucide-react";
import styled from "styled-components";
import { getSubscriptionSettings, createSubscriptionSettings, updateSubscriptionSettings }
    from '../api/subscriptionApi';

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

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
  max-width: 600px;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 100px;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const SuccessMsg = styled.div`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}4d;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 1rem;
`;

const ErrorMsg = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(248, 81, 73, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.danger}4d;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 1rem;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
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

const SaveBtn = styled.button`
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

const MutedText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function SubscriptionSettingsPage() {
    const navigate = useNavigate();

    const creatorId = 1; // JWT 연동 후 제거
    //const token = localStorage.getItem('accessToken');
    //const creatorId = token ? jwtDecode(token).userId : null;

    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [isExisting, setIsExisting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await getSubscriptionSettings(creatorId);
                setPrice(data.price);
                setDescription(data.description);
                setIsExisting(true);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const handleSubmit = async () => {
        if (!price || !description) {
            setMessage({ type: "error", text: "가격과 설명을 입력해주세요." });
            return;
        }
        try {
            if (isExisting) {
                await updateSubscriptionSettings(creatorId, { userId: creatorId, price: Number(price), description });
            } else {
                await createSubscriptionSettings({ userId: creatorId, price: Number(price), description });
            }
            setIsExisting(true);
            setMessage({ type: "success", text: "구독 플랜이 저장되었습니다!" });
        } catch {
            setMessage({ type: "error", text: "저장에 실패했습니다." });
        }
    };

    if (loading) return <Page><MutedText>불러오는 중...</MutedText></Page>;

    return (
        <Page>
            <Header>
                <HeaderRow>
                    <div>
                        <Title>구독 플랜 설정</Title>
                        <Subtitle>구독자에게 제공할 플랜을 설정하세요</Subtitle>
                    </div>
                    <CloseBtn onClick={() => navigate(-1)}>✕</CloseBtn>
                </HeaderRow>
            </Header>

            <Card>
                <SectionTitle>
                    <Settings size={16} />
                    플랜 정보
                </SectionTitle>

                <FormGroup>
                    <Label>월 구독료 (원)</Label>
                    <Input
                        type="text"
                        value={price}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setPrice(val);
                        }}
                        placeholder="예: 3900"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>플랜 설명</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="구독자에게 제공하는 혜택을 설명해주세요"
                    />
                </FormGroup>

                {message && (
                    message.type === "success"
                        ? <SuccessMsg>{message.text}</SuccessMsg>
                        : <ErrorMsg>{message.text}</ErrorMsg>
                )}

                <BtnRow>
                    <CancelBtn onClick={() => navigate(-1)}>취소</CancelBtn>
                    <SaveBtn onClick={handleSubmit}>
                        <Save size={16} />
                        {isExisting ? "수정하기" : "등록하기"}
                    </SaveBtn>
                </BtnRow>
            </Card>
        </Page>
    );
}
