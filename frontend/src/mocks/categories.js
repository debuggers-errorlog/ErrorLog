import {
  LayoutGrid,
  Bug,
  Database,
  Network,
  Hammer,
  Container,
  Settings,
  Gauge,
  Shield,
  CircleEllipsis,
} from 'lucide-react';

/** 백엔드 TroubleshootingCategory와 동일한 id 사용 */
export const CATEGORY_DEFINITIONS = [
  { id: 'all', label: '전체', icon: LayoutGrid },
  { id: 'RUNTIME', label: 'Runtime', icon: Bug },
  { id: 'DATABASE', label: 'Database', icon: Database },
  { id: 'NETWORK', label: 'Network', icon: Network },
  { id: 'BUILD', label: 'Build', icon: Hammer },
  { id: 'DEPLOY', label: 'Deploy', icon: Container },
  { id: 'CONFIG', label: 'Config', icon: Settings },
  { id: 'PERFORMANCE', label: 'Performance', icon: Gauge },
  { id: 'SECURITY', label: 'Security', icon: Shield },
  { id: 'OTHER', label: 'Other', icon: CircleEllipsis },
];

export function buildCategoriesWithCounts(stats) {
  const counts = stats?.categoryCounts ?? {};
  return CATEGORY_DEFINITIONS.map((category) => ({
    ...category,
    count:
      category.id === 'all'
        ? (stats?.totalPosts ?? 0)
        : (counts[category.id] ?? 0),
  }));
}

/** @deprecated API 연동 전 호환용 — buildCategoriesWithCounts 사용 */
export const CATEGORIES = buildCategoriesWithCounts({ totalPosts: 0, categoryCounts: {} });
