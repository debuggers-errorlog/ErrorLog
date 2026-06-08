import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import CategorySidebar from '../components/sidebar/CategorySidebar';
import FilterSidebar from '../components/sidebar/FilterSidebar';
import WeeklyStats from '../components/sidebar/WeeklyStats';
import PostFeed from '../components/post/PostFeed';
import { fetchPosts } from '../api/postApi';
import { useBoardSidebarData } from '../hooks/useBoardSidebarData';
import { mapApiPost } from '../utils/postMapper';

export default function HomePage() {
  const navigate = useNavigate();
  const { categories, weeklyStats } = useBoardSidebarData();
  const [posts, setPosts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFree, setShowFree] = useState(true);
  const [showPremium, setShowPremium] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = activeCategory !== 'all' ? { category: activeCategory } : {};
    fetchPosts(params)
      .then((data) => {
        setPosts(Array.isArray(data) ? data.map(mapApiPost) : []);
        setLoadError('');
      })
      .catch(() => {
        setPosts([]);
        setLoadError('게시글을 불러오지 못했습니다.');
      });
  }, [activeCategory]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return (showFree && !post.isPremium) || (showPremium && post.isPremium);
    });
  }, [posts, showFree, showPremium]);

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
            categories={categories}
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
      rightSidebar={<WeeklyStats stats={weeklyStats} />}
    >
      {loadError && <p style={{ color: '#f85149', marginBottom: 16 }}>{loadError}</p>}
      <PostFeed posts={filteredPosts} />
    </MainLayout>
  );
}
