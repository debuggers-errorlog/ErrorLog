import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PostFeed from '../components/post/PostFeed';
import api from '../api/axios';
import { mapApiPost } from '../utils/postMapper';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState(q);

  useEffect(() => {
    if (!q) {
      setPosts([]);
      setLoadError('');
      return;
    }

    api
      .get('/search', { params: { q } })
      .then(({ data }) => {
        const items = data.content ?? data;
        setPosts(Array.isArray(items) ? items.map(mapApiPost) : []);
        setLoadError('');
      })
      .catch(() => {
        setPosts([]);
        setLoadError('검색 결과를 불러오지 못했습니다.');
      });
  }, [q]);

  return (
    <MainLayout
      hideRight
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {loadError && <p style={{ color: '#f85149', marginBottom: 16 }}>{loadError}</p>}
      <PostFeed posts={posts} title={`"${q}" 검색 결과`} />
    </MainLayout>
  );
}
