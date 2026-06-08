import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CategorySidebar from '../components/sidebar/CategorySidebar';
import FilterSidebar from '../components/sidebar/FilterSidebar';
import WeeklyStats from '../components/sidebar/WeeklyStats';
import PostFeed from '../components/post/PostFeed';
import { CATEGORIES } from '../mocks/categories';
import { WEEKLY_STATS } from '../mocks/stats';
import { MOCK_POSTS } from '../mocks/posts';
import { fetchPosts } from '../api/postApi';
import { getLikeStatus, getComments } from '../api/socialApi';

function mapApiPost(apiPost) {
  const locked = apiPost.locked;
  return {
    id: apiPost.id,
    authorId: apiPost.authorId,
    author: { nickname: apiPost.authorNickname ?? `User${apiPost.authorId}`, avatarColor: '#3b82f6' },
    title: apiPost.title,
    excerpt: apiPost.excerpt || '내용 미리보기 없음',
    category: 'backend',
    categoryLabel: apiPost.category || apiPost.troubleshootingMeta?.category || 'General',
    categoryColor: '#58a6ff',
    visibility: apiPost.visibility,
    locked,
    isPremium: apiPost.visibility === 'SUBSCRIBERS',
    tags: apiPost.tags || [],
    viewCount: apiPost.viewCount ?? 0,
    commentCount: 0,
    likeCount: 0,
    createdAt: apiPost.createdAt?.slice?.(0, 10) ?? '',
  };
}

export default function HomePage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFree, setShowFree] = useState(true);
  const [showPremium, setShowPremium] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts().then(async (data) => {
      if (Array.isArray(data) && data.length > 0 && data[0].title) {
        const mapped = data.map(mapApiPost);
        setPosts(mapped); // 일단 빠르게 표시

        // 좋아요/댓글 수를 Roof API로 게시글마다 채워서 실시간 반영
        const enriched = await Promise.all(
          mapped.map(async (p) => {
            try {
              const [likeRes, comments] = await Promise.all([
                getLikeStatus(p.id),
                getComments(p.id),
              ]);
              return { ...p, likeCount: likeRes.likeCount, commentCount: comments.length };
            } catch {
              return p; // 비로그인 등 실패 시 기존값 유지
            }
          })
        );
        setPosts(enriched);
      }
    });
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const typeOk =
        (showFree && !post.isPremium) || (showPremium && post.isPremium);
      const catOk = activeCategory === 'all' || post.category === activeCategory;
      return typeOk && catOk;
    });
  }, [posts, showFree, showPremium, activeCategory]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <MainLayout
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearch}
      leftSidebar={
        <>
          <CategorySidebar
            categories={CATEGORIES}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
          <FilterSidebar
            showFree={showFree}
            showPremium={showPremium}
            onToggleFree={setShowFree}
            onTogglePremium={setShowPremium}
          />
        </>
      }
      rightSidebar={<WeeklyStats stats={WEEKLY_STATS} />}
    >
      <PostFeed posts={filteredPosts} />
    </MainLayout>
  );
}
