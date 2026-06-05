import {
  LayoutGrid,
  Monitor,
  Server,
  Database,
  Container,
  Smartphone,
  Cloud,
  Gauge,
  GitBranch,
  Bug,
} from 'lucide-react';

/** UI 카테고리 — 백엔드 TroubleshootingCategory와 1:1 매핑은 팀 협의 필요 */
export const CATEGORIES = [
  { id: 'all', label: '전체', icon: LayoutGrid, count: 1234 },
  { id: 'frontend', label: 'Frontend', icon: Monitor, count: 342 },
  { id: 'backend', label: 'Backend', icon: Server, count: 289 },
  { id: 'database', label: 'Database', icon: Database, count: 156 },
  { id: 'devops', label: 'DevOps', icon: Container, count: 98 },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, count: 67 },
  { id: 'cloud', label: 'Cloud', icon: Cloud, count: 112 },
  { id: 'performance', label: 'Performance', icon: Gauge, count: 45 },
  { id: 'git', label: 'Git', icon: GitBranch, count: 34 },
  { id: 'debugging', label: 'Debugging', icon: Bug, count: 91 },
];
