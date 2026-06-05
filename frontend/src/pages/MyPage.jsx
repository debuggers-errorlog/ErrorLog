import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getMyProfile, updateMyProfile, getMyPosts } from '../api/user'
import { logout, withdraw } from '../api/auth'
import Header from '../components/layout/Header'

const NAV_ITEMS = [
  { key: 'summary', label: '활동 요약' },
  { key: 'posts', label: '내 게시글' },
  { key: 'answers', label: '내 답변' },
  { key: 'questions', label: '내 질문' },
  { key: 'subscriptions', label: '구독 관리' },
]

/* ── Layout ── */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
`

const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 24px 12px;
`

const Main = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
`

/* ── Sidebar ── */
const ProfileHeader = styled.div`
  text-align: center;
  padding-bottom: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
  margin: 0 auto 10px;
`

const ProfileName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ProfileEmail = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`

const NavItem = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  text-align: left;
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.textMuted)};
  background: ${({ $active, theme }) => ($active ? theme.colors.accentDim : 'transparent')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`

const SidebarBottom = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const SidebarAction = styled.button`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  text-align: left;
  color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.textMuted)};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ $danger, theme }) => ($danger ? 'rgba(248,81,73,0.1)' : theme.colors.surfaceHover)};
    color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.text)};
  }
`

/* ── Section ── */
const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
`

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

/* ── Summary ── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  text-align: center;
`

const StatValue = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: ${({ $accent, $gold, theme }) =>
    $accent ? theme.colors.accent : $gold ? theme.colors.premium : theme.colors.text};
  margin-bottom: 4px;
`

const StatLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`

/* ── Posts ── */
const PostCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  margin-bottom: 12px;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.borderLight}; }
`

const PostTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`

const PostTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

const PostDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  flex-shrink: 0;
`

const PostExcerpt = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 10px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const Tag = styled.span`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
`

const ViewCount = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
`

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`

const PageBtn = styled.button`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgElevated};
  transition: color 0.15s, background 0.15s;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
  &:disabled { opacity: 0.4; }
`

const PageInfo = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`

/* ── Form ── */
const EditForm = styled.form`
  max-width: 440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

const OptionalBadge = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Input = styled.input`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }
  &:focus { border-color: ${({ theme }) => theme.colors.accent}; }
`

const SubmitButton = styled.button`
  padding: 11px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.accent};
  color: #0b0e14;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; }
`

const CancelBtn = styled.button`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const ErrorMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
`

const EmptyText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`

/* ── Modal ── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
`

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 24px;
  max-width: 360px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ModalTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const ModalDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`

const ModalActions = styled.div`
  display: flex;
  gap: 8px;
`

const ModalCancelBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.surfaceHover}; }
`

const ModalDangerBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  transition: opacity 0.15s;
  &:hover { opacity: 0.9; }
`

export default function MyPage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [activeNav, setActiveNav] = useState('summary')
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ nickname: '', password: '', bio: '', link: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [withdrawPassword, setWithdrawPassword] = useState('')
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [myPosts, setMyPosts] = useState([])
  const [postsPage, setPostsPage] = useState(0)
  const [postsTotalPages, setPostsTotalPages] = useState(0)
  const [postsLoading, setPostsLoading] = useState(false)

  useEffect(() => {
    getMyProfile()
      .then(({ data }) => {
        setProfile(data)
        setForm({ nickname: data.nickname, password: '', bio: data.bio || '', link: data.link || '' })
      })
      .catch(() => navigate('/login'))
  }, [navigate])

  useEffect(() => {
    if (activeNav !== 'posts') return
    setPostsLoading(true)
    getMyPosts(postsPage)
      .then(({ data }) => {
        setMyPosts(data.content)
        setPostsTotalPages(data.totalPages)
      })
      .finally(() => setPostsLoading(false))
  }, [activeNav, postsPage])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {}
      if (form.nickname !== profile.nickname) payload.nickname = form.nickname
      if (form.password) payload.password = form.password
      if (form.bio !== (profile.bio || '')) payload.bio = form.bio
      if (form.link !== (profile.link || '')) payload.link = form.link
      const { data } = await updateMyProfile(payload)
      setProfile(data)
      setEditMode(false)
      setForm({ nickname: data.nickname, password: '', bio: data.bio || '', link: data.link || '' })
    } catch (err) {
      setError(err.response?.data?.message || '수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try { await logout() } finally {
      localStorage.clear()
      navigate('/login')
    }
  }

  const handleWithdraw = async () => {
    const isGoogle = profile.provider === 'GOOGLE'
    if (!isGoogle && !withdrawPassword) return setError('비밀번호를 입력해주세요.')
    try {
      await withdraw(isGoogle ? null : withdrawPassword)
      localStorage.clear()
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || '회원탈퇴에 실패했습니다.')
    }
  }

  if (!profile) {
    return (
      <>
        <Header />
        <PageWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
          <EmptyText>불러오는 중...</EmptyText>
        </PageWrapper>
      </>
    )
  }

  const initials = profile.nickname?.slice(0, 1).toUpperCase() || '?'
  const isGoogle = profile.provider === 'GOOGLE'

  return (
    <>
      <Header />
      <PageWrapper>
        {/* 사이드바 */}
        <Sidebar>
          <ProfileHeader>
            <Avatar>{initials}</Avatar>
            <ProfileName>{profile.nickname}</ProfileName>
            <ProfileEmail>{profile.email}</ProfileEmail>
          </ProfileHeader>

          <Nav>
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.key} $active={activeNav === item.key && !editMode}
                onClick={() => { setActiveNav(item.key); setEditMode(false) }}>
                {item.label}
              </NavItem>
            ))}
          </Nav>

          <SidebarBottom>
            <SidebarAction onClick={() => { setActiveNav('edit'); setEditMode(true) }}>
              프로필 편집
            </SidebarAction>
            <SidebarAction onClick={handleLogout}>로그아웃</SidebarAction>
            <SidebarAction $danger onClick={() => setShowWithdraw(true)}>회원탈퇴</SidebarAction>
          </SidebarBottom>
        </Sidebar>

        {/* 메인 */}
        <Main>

          {/* 활동 요약 */}
          {activeNav === 'summary' && !editMode && (
            <>
              <SectionTitle>활동 요약</SectionTitle>
              <StatsGrid>
                <StatCard><StatValue $accent>-</StatValue><StatLabel>게시글</StatLabel></StatCard>
                <StatCard><StatValue>-</StatValue><StatLabel>답변</StatLabel></StatCard>
                <StatCard><StatValue $gold>-</StatValue><StatLabel>구독 중</StatLabel></StatCard>
              </StatsGrid>
              <EmptyText>최근 활동 내역이 여기에 표시됩니다.</EmptyText>
            </>
          )}

          {/* 내 게시글 */}
          {activeNav === 'posts' && !editMode && (
            <>
              <SectionTitle>내 게시글</SectionTitle>
              {postsLoading ? (
                <EmptyText>불러오는 중...</EmptyText>
              ) : myPosts.length === 0 ? (
                <EmptyText>작성한 게시글이 없습니다.</EmptyText>
              ) : (
                <>
                  {myPosts.map((post) => (
                    <PostCard key={post.id} onClick={() => navigate(`/posts/${post.id}`)}
                      style={{ cursor: 'pointer' }}>
                      <PostTop>
                        <PostTitle>{post.title}</PostTitle>
                        <PostDate>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</PostDate>
                      </PostTop>
                      {post.excerpt && <PostExcerpt>{post.excerpt}</PostExcerpt>}
                      <PostMeta>
                        {post.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}
                        <ViewCount>조회 {post.viewCount}</ViewCount>
                      </PostMeta>
                    </PostCard>
                  ))}
                  {postsTotalPages > 1 && (
                    <Pagination>
                      <PageBtn onClick={() => setPostsPage((p) => Math.max(0, p - 1))}
                        disabled={postsPage === 0}>이전</PageBtn>
                      <PageInfo>{postsPage + 1} / {postsTotalPages}</PageInfo>
                      <PageBtn onClick={() => setPostsPage((p) => Math.min(postsTotalPages - 1, p + 1))}
                        disabled={postsPage >= postsTotalPages - 1}>다음</PageBtn>
                    </Pagination>
                  )}
                </>
              )}
            </>
          )}

          {/* 프로필 편집 */}
          {editMode && (
            <>
              <SectionTitleRow>
                <SectionTitle style={{ margin: 0 }}>프로필 편집</SectionTitle>
                <CancelBtn onClick={() => { setEditMode(false); setActiveNav('summary') }}>취소</CancelBtn>
              </SectionTitleRow>
              <EditForm onSubmit={handleUpdate}>
                <Field>
                  <Label>닉네임</Label>
                  <Input type="text" name="nickname" value={form.nickname} onChange={handleChange} />
                </Field>
                {!isGoogle && (
                  <Field>
                    <Label>새 비밀번호 <OptionalBadge>(변경 시에만 입력)</OptionalBadge></Label>
                    <Input type="password" name="password" value={form.password}
                      onChange={handleChange} placeholder="••••••••" />
                  </Field>
                )}
                <Field>
                  <Label>한 줄 소개</Label>
                  <Input type="text" name="bio" value={form.bio} onChange={handleChange}
                    placeholder="한 줄 소개를 입력해주세요" />
                </Field>
                <Field>
                  <Label>GitHub / 블로그 <OptionalBadge>(선택)</OptionalBadge></Label>
                  <Input type="url" name="link" value={form.link} onChange={handleChange}
                    placeholder="https://github.com/" />
                </Field>
                {error && <ErrorMsg>{error}</ErrorMsg>}
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? '저장 중...' : '저장'}
                </SubmitButton>
              </EditForm>
            </>
          )}

          {/* 플레이스홀더 */}
          {!['summary', 'posts'].includes(activeNav) && !editMode && (
            <>
              <SectionTitle>{NAV_ITEMS.find(n => n.key === activeNav)?.label}</SectionTitle>
              <EmptyText>준비 중입니다.</EmptyText>
            </>
          )}
        </Main>

        {/* 회원탈퇴 모달 */}
        {showWithdraw && (
          <Overlay>
            <Modal>
              <ModalTitle>회원탈퇴</ModalTitle>
              <ModalDesc>
                {isGoogle
                  ? '탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
                  : '탈퇴하시려면 비밀번호를 입력해주세요. 이 작업은 되돌릴 수 없습니다.'}
              </ModalDesc>
              {!isGoogle && (
                <Input type="password" value={withdrawPassword}
                  onChange={(e) => { setWithdrawPassword(e.target.value); setError('') }}
                  placeholder="비밀번호 입력" />
              )}
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <ModalActions>
                <ModalCancelBtn onClick={() => setShowWithdraw(false)}>취소</ModalCancelBtn>
                <ModalDangerBtn onClick={handleWithdraw}>탈퇴 확인</ModalDangerBtn>
              </ModalActions>
            </Modal>
          </Overlay>
        )}
      </PageWrapper>
    </>
  )
}
