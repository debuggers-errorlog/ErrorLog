export function buildWeeklyStats(stats) {
  return {
    newPosts: stats?.newPostsThisWeek ?? 0,
  };
}

/** @deprecated API 연동 전 호환용 */
export const WEEKLY_STATS = buildWeeklyStats({ newPostsThisWeek: 0 });
