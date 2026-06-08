import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Save, MessageCircle } from "lucide-react";
import styled from "styled-components";
import {
    getMySubscriptionSettings,
    saveMySubscriptionSettings,
} from '../api/subscriptionApi';
import {
    getMyQuestionSettings,
    saveMyQuestionSettings,
} from '../api/questionSettingsApi';
import { getCurrentUserId, isLoggedIn } from '../utils/authSession';

const Page = styled.div`
  background: ${({ theme }) => theme.colors.bg};
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text};
  box-sizing: border-box;
`;

const Content = styled.div`
  max-width: 600px;
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
  margin-bottom: 1.25rem;
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
  box-sizing: border-box;
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
  box-sizing: border-box;
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
    const creatorId = getCurrentUserId();

    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [isSubscriptionExisting, setIsSubscriptionExisting] = useState(false);

    const [questionPrice, setQuestionPrice] = useState("");
    const [questionDescription, setQuestionDescription] = useState("");
    const [isQuestionExisting, setIsQuestionExisting] = useState(false);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (!isLoggedIn() || !creatorId) {
            navigate('/login');
        }
    }, [creatorId, navigate]);

    useEffect(() => {
        if (!creatorId) {
            setLoading(false);
            return;
        }

        async function fetchSettings() {
            try {
                const [subscriptionRes, questionRes] = await Promise.allSettled([
                    getMySubscriptionSettings(),
                    getMyQuestionSettings(),
                ]);

                if (subscriptionRes.status === 'fulfilled') {
                    const data = subscriptionRes.value.data;
                    if (data.userId === creatorId) {
                        setPrice(String(data.price ?? ''));
                        setDescription(data.description ?? '');
                        setIsSubscriptionExisting(true);
                    }
                }

                if (questionRes.status === 'fulfilled') {
                    const data = questionRes.value.data;
                    if (data.userId === creatorId) {
                        setQuestionPrice(String(data.price ?? ''));
                        setQuestionDescription(data.description ?? '');
                        setIsQuestionExisting(true);
                    }
                }
            } catch (e) {
                console.error(e);
                setMessage({ type: 'error', text: '설정 정보를 불러오지 못했습니다.' });
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, [creatorId]);

    const handleSubmit = async () => {
        if (!creatorId) {
            navigate('/login');
            return;
        }
        if (!price || !description) {
            setMessage({ type: "error", text: "구독 플랜의 가격과 설명을 입력해주세요." });
            return;
        }
        if (!questionPrice || !questionDescription) {
            setMessage({ type: "error", text: "질문 단가와 설명을 입력해주세요." });
            return;
        }
        try {
            await Promise.all([
                saveMySubscriptionSettings({
                    price: Number(price),
                    description,
                }),
                saveMyQuestionSettings({
                    price: Number(questionPrice),
                    description: questionDescription,
                }),
            ]);
            setIsSubscriptionExisting(true);
            setIsQuestionExisting(true);
            setMessage({ type: "success", text: "구독 플랜과 질문 단가가 저장되었습니다!" });
        } catch (e) {
            const status = e.response?.status;
            if (status === 401) {
                setMessage({ type: "error", text: "로그인이 만료되었습니다. 다시 로그인해주세요." });
            } else {
                setMessage({ type: "error", text: "저장에 실패했습니다." });
            }
        }
    };

    const isExisting = isSubscriptionExisting && isQuestionExisting;

    if (!creatorId) return null;

    if (loading) return <Page><MutedText>불러오는 중...</MutedText></Page>;

    return (
        <Page>
            <Content>
                <Header>
                    <HeaderRow>
                        <div>
                            <Title>구독 플랜 설정</Title>
                            <Subtitle>구독 플랜과 1:1 질문 단가를 함께 설정하세요</Subtitle>
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
                </Card>

                <Card>
                    <SectionTitle>
                        <MessageCircle size={16} />
                        1:1 질문 단가
                    </SectionTitle>

                    <FormGroup>
                        <Label>1회 질문료 (원)</Label>
                        <Input
                            type="text"
                            value={questionPrice}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, "");
                                setQuestionPrice(val);
                            }}
                            placeholder="예: 5900"
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>질문 답변 안내</Label>
                        <Textarea
                            value={questionDescription}
                            onChange={(e) => setQuestionDescription(e.target.value)}
                            placeholder="질문자에게 제공하는 답변 범위를 설명해주세요"
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
                            {isExisting ? "전체 수정하기" : "전체 등록하기"}
                        </SaveBtn>
                    </BtnRow>
                </Card>
            </Content>
        </Page>
    );
}