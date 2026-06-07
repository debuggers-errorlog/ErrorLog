import { useEffect, useState } from 'react';
import { fetchPostStats } from '../api/postApi';
import { buildCategoriesWithCounts, CATEGORY_DEFINITIONS } from '../mocks/categories';
import { buildWeeklyStats } from '../mocks/stats';

const EMPTY_CATEGORIES = buildCategoriesWithCounts({ totalPosts: 0, categoryCounts: {} });
const EMPTY_WEEKLY_STATS = buildWeeklyStats({ newPostsThisWeek: 0 });

export function useBoardSidebarData() {
  const [categories, setCategories] = useState(EMPTY_CATEGORIES);
  const [weeklyStats, setWeeklyStats] = useState(EMPTY_WEEKLY_STATS);

  useEffect(() => {
    fetchPostStats()
      .then((data) => {
        setCategories(buildCategoriesWithCounts(data));
        setWeeklyStats(buildWeeklyStats(data));
      })
      .catch(() => {
        setCategories(
          CATEGORY_DEFINITIONS.map((category) => ({ ...category, count: 0 })),
        );
        setWeeklyStats(EMPTY_WEEKLY_STATS);
      });
  }, []);

  return { categories, weeklyStats };
}
