import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PostFeed from '../components/post/PostFeed';
import { MOCK_POSTS } from '../mocks/posts';
import client from '../api/client';

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(q);

  useEffect(() => {
    if (!q) {
      setPosts([]);
      return;
    }

    client
      .get('/search', { params: { q } })
      .then(({ data }) => {
        const items = data.content ?? data;
        setPosts(
          items.map((p) => ({
            ...MOCK_POSTS[0],
            id: p.id,
            title: p.title,
            excerpt: p.excerpt,
            locked: p.locked,
            isPremium: p.visibility === 'SUBSCRIBERS',
            tags: p.tags,
            viewCount: p.viewCount,
          })),
        );
      })
      .catch(() => setPosts(MOCK_POSTS.filter((p) => p.title.includes(q))));
  }, [q]);

  return (
    <MainLayout
      hideRight
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <PostFeed posts={posts} title={`"${q}" 검색 결과`} />
    </MainLayout>
  );
}
