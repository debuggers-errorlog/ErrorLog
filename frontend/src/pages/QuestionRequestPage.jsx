import { useState, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ImagePlus, X } from 'lucide-react'
import styled from 'styled-components'
import { LayoutRoot, LayoutBody, WriteGrid } from '../components/layout/MainLayout.styles'
import Header from '../components/layout/Header'
import {
    WriteHeader,
    TitleInput,
    ContentTextarea,
    Button,
    Card,
    SectionTitle,
    PreviewGrid,
    PreviewItem,
    ImageDropzone,
} from '../components/post/WritePostForm'
import { sendQuestionRequest } from '../api/questionApi'
import client from '../api/client'

async function uploadRequestImages(requestId, files) {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    await client.post(`/images/REQUEST/${requestId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

const ReceiverBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};

  span.label {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
  }
  span.nick {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.accent};
  }
`

const SectionLabel = styled.p`
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 20px 0 10px;
`

const CharCount = styled.p`
  text-align: right;
  font-size: 12px;
  margin-top: 4px;
  color: ${({ $over, theme }) => ($over ? theme.colors.danger : theme.colors.textMuted)};
`

const ImageCount = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 6px;
`

const NoticeItem = styled.li`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;
  list-style: disc;
  margin-left: 16px;
`

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 8px;
`

const ProgressMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  margin-top: 8px;
`

const IMAGE_MAX    = 10

export default function QuestionRequestPage() {
    const navigate       = useNavigate()
    const { receiverId } = useParams()
    const { state }      = useLocation()
    const receiverNick   = state?.receiverNick ?? '알 수 없음'

    const [title,      setTitle]      = useState('')
    const [content,    setContent]    = useState('')
    const [imageFiles, setImageFiles] = useState([])   // File 객체 배열
    const [submitting, setSubmitting] = useState(false)
    const [progress,   setProgress]   = useState('')   // 단계별 진행 메시지
    const [error,      setError]      = useState('')

    const fileInputRef = useRef(null)


    function handleImageAdd(e) {
        const newFiles = Array.from(e.target.files || [])
        e.target.value = ''

        const next = [...imageFiles, ...newFiles]
        if (next.length > IMAGE_MAX) {
            setError(`이미지는 최대 ${IMAGE_MAX}장까지 첨부할 수 있습니다.`)
            return
        }

        setError('')
        setImageFiles(next)
    }

    function handleImageRemove(idx) {
        setImageFiles((prev) => prev.filter((_, i) => i !== idx))
    }

    async function handleSubmit() {
        if (!title.trim())   { setError('제목을 입력해 주세요.');  return }
        if (!content.trim()) { setError('내용을 입력해 주세요.');  return }

        setSubmitting(true)
        setError('')

        try {
            setProgress('질문 요청을 보내는 중...')
            const created = await sendQuestionRequest({
                receiverId: Number(receiverId),
                title,
                content,
            })

            if (imageFiles.length > 0) {
                setProgress('이미지를 업로드하는 중...')
                await uploadRequestImages(created.id, imageFiles)
            }

            navigate('/questions/inbox', { state: { tab: 'sent' } })
        } catch (err) {
            setError(err.response?.data?.message || '요청 전송에 실패했습니다.')
        } finally {
            setSubmitting(false)
            setProgress('')
        }
    }

    return (
        <LayoutRoot>
            <Header />
            <LayoutBody>
                <WriteGrid>

                    <div>
                        <WriteHeader>
                            <button type="button" className="cancel" onClick={() => navigate(-1)}>
                                취소
                            </button>
                            <Button
                                $variant="primary"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? '전송 중...' : '질문 보내기'}
                            </Button>
                        </WriteHeader>

                        <ReceiverBanner>
                            <span className="label">받는 사람</span>
                            <span className="nick">{receiverNick}</span>
                            <span className="label">멘토</span>
                        </ReceiverBanner>

                        <TitleInput
                            placeholder="질문 제목을 입력하세요..."
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setError('') }}
                            maxLength={100}
                        />

                        <ContentTextarea
                            placeholder={
                                '궁금한 내용을 자세히 작성해 주세요.\n\n예시:\n- 어떤 상황에서 문제가 발생했나요?\n- 어떤 것을 시도해 봤나요?\n- 기대하는 답변이 있으신가요?'
                            }
                            value={content}
                            onChange={(e) => { setContent(e.target.value); setError('') }}
                        />

                        <SectionLabel>
                            사진 첨부 (선택 · 최대 {IMAGE_MAX}장)
                        </SectionLabel>

                        {imageFiles.length > 0 && (
                            <PreviewGrid>
                                {imageFiles.map((file, idx) => (
                                    <PreviewItem key={`${file.name}-${idx}`}>
                                        <img src={URL.createObjectURL(file)} alt="" />
                                        <button type="button" onClick={() => handleImageRemove(idx)}>
                                            <X size={14} />
                                        </button>
                                    </PreviewItem>
                                ))}
                            </PreviewGrid>
                        )}

                        {imageFiles.length < IMAGE_MAX && (
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleImageAdd}
                                />
                                <ImageDropzone onClick={() => fileInputRef.current?.click()}>
                                    <ImagePlus size={36} />
                                    <p>클릭하여 이미지 추가 또는 드래그 앤 드롭</p>
                                </ImageDropzone>
                            </>
                        )}

                        {imageFiles.length > 0 && (
                            <ImageCount>
                                {imageFiles.length} / {IMAGE_MAX}장 선택됨
                            </ImageCount>
                        )}

                        {progress && <ProgressMsg>{progress}</ProgressMsg>}
                        {error    && <ErrorMsg>{error}</ErrorMsg>}
                    </div>

                    <div>
                        <Card style={{ marginBottom: 20 }}>
                            <SectionTitle>유료 질문 안내</SectionTitle>
                            <ul>
                                <NoticeItem>멘토가 수락해야 질문이 시작됩니다.</NoticeItem>
                                <NoticeItem>수락 시 결제가 진행됩니다.</NoticeItem>
                                <NoticeItem>멘토가 거절하면 비용이 청구되지 않습니다.</NoticeItem>
                                <NoticeItem>PENDING 상태에서는 직접 취소할 수 있습니다.</NoticeItem>
                            </ul>
                        </Card>

                        <Card>
                            <SectionTitle>작성 가이드</SectionTitle>
                            <ul>
                                <NoticeItem>구체적인 상황과 코드를 함께 첨부하면 빠른 답변에 도움이 됩니다.</NoticeItem>
                                <NoticeItem>이미 시도해 본 방법을 적어주세요.</NoticeItem>
                                <NoticeItem>제목은 핵심 문제를 요약해서 작성해 주세요.</NoticeItem>
                                <NoticeItem>에러 스크린샷을 첨부하면 더욱 좋습니다.</NoticeItem>
                            </ul>
                        </Card>
                    </div>

                </WriteGrid>
            </LayoutBody>
        </LayoutRoot>
    )
}